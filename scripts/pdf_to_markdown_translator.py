#!/usr/bin/env python3
"""
Script para converter arquivos PDF para Markdown com tradução automática
Mantém a estrutura de pastas e converte todos os PDFs encontrados
Traduz automaticamente conteúdo em inglês para português do Brasil usando OpenAI
"""

import os
import sys
import fitz  # PyMuPDF
import re
from pathlib import Path
from typing import Optional, Tuple
import unicodedata
from openai import OpenAI
from dotenv import load_dotenv
import time

# Carrega variáveis de ambiente
load_dotenv()

def clean_filename(filename: str) -> str:
    """
    Limpa o nome do arquivo removendo caracteres especiais problemáticos
    """
    # Remove caracteres de controle e normaliza
    filename = unicodedata.normalize('NFKD', filename)
    # Remove caracteres não ASCII exceto espaços e pontos
    filename = re.sub(r'[^\w\s.-]', '_', filename)
    # Remove espaços múltiplos
    filename = re.sub(r'\s+', ' ', filename)
    return filename.strip()

def detect_language(text: str) -> str:
    """
    Detecta se o texto está em inglês ou português
    
    Returns:
        'en' para inglês, 'pt' para português
    """
    # Palavras comuns em inglês
    english_words = ['the', 'and', 'of', 'to', 'in', 'is', 'for', 'with', 'that', 'this', 
                    'as', 'are', 'by', 'from', 'or', 'be', 'an', 'at', 'have', 'has']
    
    # Palavras comuns em português
    portuguese_words = ['de', 'da', 'do', 'para', 'com', 'em', 'por', 'que', 'não', 
                       'uma', 'um', 'os', 'as', 'dos', 'das', 'pelo', 'pela', 'sobre']
    
    text_lower = text.lower()
    
    # Conta ocorrências
    english_count = sum(1 for word in english_words if f' {word} ' in text_lower or text_lower.startswith(f'{word} '))
    portuguese_count = sum(1 for word in portuguese_words if f' {word} ' in text_lower or text_lower.startswith(f'{word} '))
    
    # Se houver significativamente mais palavras em inglês, considera como inglês
    if english_count > portuguese_count * 2:
        return 'en'
    return 'pt'

def translate_with_openai(text: str, api_key: Optional[str] = None) -> Tuple[str, bool]:
    """
    Traduz texto do inglês para português usando OpenAI
    
    Args:
        text: Texto para traduzir
        api_key: Chave da API OpenAI
    
    Returns:
        Tupla com (texto traduzido, sucesso da tradução)
    """
    if not api_key:
        api_key = os.getenv('OPENAI_API_KEY')
    
    if not api_key:
        print("  ⚠ Aviso: OPENAI_API_KEY não configurada. Pulando tradução.")
        return text, False
    
    # Detecta o idioma
    if detect_language(text) == 'pt':
        # Já está em português
        return text, False
    
    try:
        client = OpenAI(api_key=api_key)
        
        # Divide texto longo em chunks se necessário
        max_chars = 4000
        if len(text) > max_chars:
            # Processa em partes
            parts = []
            current_pos = 0
            
            while current_pos < len(text):
                end_pos = min(current_pos + max_chars, len(text))
                
                # Tenta encontrar um ponto de quebra natural (fim de frase)
                if end_pos < len(text):
                    for sep in ['\n\n', '\n', '. ', '! ', '? ']:
                        last_sep = text.rfind(sep, current_pos, end_pos)
                        if last_sep > current_pos:
                            end_pos = last_sep + len(sep)
                            break
                
                chunk = text[current_pos:end_pos]
                
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "Você é um tradutor profissional. Traduza o texto a seguir do inglês para o português do Brasil, mantendo toda a formatação markdown, quebras de linha e estrutura. Seja fiel ao conteúdo original."},
                        {"role": "user", "content": chunk}
                    ],
                    temperature=0.3,
                    max_tokens=4096
                )
                
                parts.append(response.choices[0].message.content)
                current_pos = end_pos
                
                # Pequena pausa para evitar rate limiting
                if current_pos < len(text):
                    time.sleep(0.5)
            
            return ''.join(parts), True
        else:
            # Texto pequeno, traduz de uma vez
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Você é um tradutor profissional. Traduza o texto a seguir do inglês para o português do Brasil, mantendo toda a formatação markdown, quebras de linha e estrutura. Seja fiel ao conteúdo original."},
                    {"role": "user", "content": text}
                ],
                temperature=0.3,
                max_tokens=4096
            )
            
            return response.choices[0].message.content, True
            
    except Exception as e:
        print(f"  ⚠ Erro na tradução: {str(e)}")
        return text, False

def pdf_to_markdown(pdf_path: str, output_path: Optional[str] = None, translate: bool = True) -> bool:
    """
    Converte um arquivo PDF para Markdown com opção de tradução
    
    Args:
        pdf_path: Caminho do arquivo PDF
        output_path: Caminho de saída (opcional)
        translate: Se deve traduzir conteúdo em inglês
    
    Returns:
        True se a conversão foi bem-sucedida, False caso contrário
    """
    try:
        # Abre o PDF
        doc = fitz.open(pdf_path)
        
        # Prepara o conteúdo markdown
        markdown_content = []
        
        # Extrai metadados
        metadata = doc.metadata
        if metadata:
            if metadata.get('title'):
                title = metadata.get('title', 'Documento PDF')
                if translate and detect_language(title) == 'en':
                    title, _ = translate_with_openai(title)
                markdown_content.append(f"# {title}\n")
            
            # Adiciona metadados como comentário
            markdown_content.append("<!--")
            markdown_content.append("  Documento convertido de PDF para Markdown")
            if translate:
                markdown_content.append("  Tradução automática aplicada quando necessário")
            for key, value in metadata.items():
                if value:
                    markdown_content.append(f"  {key}: {value}")
            markdown_content.append("-->\n")
        else:
            # Se não houver título, usa o nome do arquivo
            filename = os.path.basename(pdf_path).replace('.pdf', '')
            markdown_content.append(f"# {filename}\n")
        
        # Armazena todo o texto para tradução em batch
        full_text_parts = []
        page_markers = []
        
        # Processa cada página
        for page_num, page in enumerate(doc, 1):
            page_markers.append(len(full_text_parts))
            
            # Extrai o texto da página
            text = page.get_text()
            
            if text.strip():
                # Processa o texto para melhor formatação
                lines = text.split('\n')
                processed_lines = []
                
                for line in lines:
                    line = line.strip()
                    if not line:
                        continue
                    
                    # Detecta possíveis títulos (linhas em maiúsculas ou começando com números)
                    if line.isupper() and len(line) > 3 and len(line) < 100:
                        processed_lines.append(f"\n### {line}\n")
                    elif re.match(r'^\d+\.?\s+', line):
                        # Lista numerada
                        processed_lines.append(line)
                    elif re.match(r'^[•·▪▫◦‣⁃]\s+', line):
                        # Lista com bullets
                        processed_lines.append(f"- {re.sub(r'^[•·▪▫◦‣⁃]\s+', '', line)}")
                    else:
                        processed_lines.append(line)
                
                # Junta parágrafos quebrados
                final_text = []
                current_paragraph = []
                
                for line in processed_lines:
                    if line.startswith('#') or line.startswith('-') or line.startswith('*') or re.match(r'^\d+\.', line):
                        # É um título ou item de lista
                        if current_paragraph:
                            final_text.append(' '.join(current_paragraph))
                            current_paragraph = []
                        final_text.append(line)
                    elif line == '':
                        if current_paragraph:
                            final_text.append(' '.join(current_paragraph))
                            current_paragraph = []
                        final_text.append('')
                    else:
                        # Continua o parágrafo
                        current_paragraph.append(line)
                
                if current_paragraph:
                    final_text.append(' '.join(current_paragraph))
                
                full_text_parts.append('\n'.join(final_text))
            else:
                full_text_parts.append("*[Página sem texto ou contém apenas imagens]*")
        
        # Fecha o documento
        doc.close()
        
        # Traduz todo o conteúdo de uma vez se necessário
        if translate and full_text_parts:
            print(f"  📝 Processando tradução...")
            combined_text = '\n\n[PÁGINA_SEPARADOR]\n\n'.join(full_text_parts)
            translated_text, was_translated = translate_with_openai(combined_text)
            
            if was_translated:
                print(f"  ✓ Tradução concluída")
                # Separa o texto traduzido de volta em páginas
                translated_parts = translated_text.split('[PÁGINA_SEPARADOR]')
                
                # Reconstrói o conteúdo com as páginas traduzidas
                for i, part in enumerate(translated_parts, 1):
                    markdown_content.append(f"\n## Página {i}\n")
                    markdown_content.append(part.strip())
            else:
                # Usa o texto original
                for i, part in enumerate(full_text_parts, 1):
                    markdown_content.append(f"\n## Página {i}\n")
                    markdown_content.append(part)
        else:
            # Sem tradução
            for i, part in enumerate(full_text_parts, 1):
                markdown_content.append(f"\n## Página {i}\n")
                markdown_content.append(part)
        
        # Define o caminho de saída
        if output_path is None:
            output_path = pdf_path.replace('.pdf', '.md')
        
        # Escreve o arquivo markdown
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(markdown_content))
        
        return True
        
    except Exception as e:
        print(f"Erro ao converter {pdf_path}: {str(e)}")
        return False

def convert_all_pdfs(source_dir: str, target_dir: str, translate: bool = True):
    """
    Converte todos os PDFs em um diretório e subdiretórios
    
    Args:
        source_dir: Diretório de origem com PDFs
        target_dir: Diretório de destino para arquivos Markdown
        translate: Se deve traduzir conteúdo em inglês
    """
    source_path = Path(source_dir)
    target_path = Path(target_dir)
    
    # Cria o diretório de destino se não existir
    target_path.mkdir(parents=True, exist_ok=True)
    
    # Verifica se a chave da API está configurada
    if translate and not os.getenv('OPENAI_API_KEY'):
        print("⚠️  ATENÇÃO: OPENAI_API_KEY não encontrada no ambiente.")
        print("   Para usar tradução automática, crie um arquivo .env com:")
        print("   OPENAI_API_KEY=sua_chave_aqui")
        print("   Continuando sem tradução...")
        print("")
        translate = False
    
    # Contador de arquivos
    total_files = 0
    successful = 0
    failed = 0
    
    # Encontra todos os arquivos PDF
    pdf_files = list(source_path.rglob('*.pdf'))
    total_files = len(pdf_files)
    
    print(f"Encontrados {total_files} arquivos PDF para converter")
    if translate:
        print("Tradução automática: ATIVADA")
    else:
        print("Tradução automática: DESATIVADA")
    print("=" * 50)
    
    for idx, pdf_file in enumerate(pdf_files, 1):
        # Calcula o caminho relativo
        relative_path = pdf_file.relative_to(source_path)
        
        # Cria o caminho de destino mantendo a estrutura de pastas
        target_file = target_path / relative_path.with_suffix('.md')
        
        # Cria o diretório de destino se necessário
        target_file.parent.mkdir(parents=True, exist_ok=True)
        
        print(f"\n[{idx}/{total_files}] Convertendo: {relative_path}")
        
        # Converte o arquivo
        if pdf_to_markdown(str(pdf_file), str(target_file), translate=translate):
            successful += 1
            print(f"  ✓ Salvo em: {target_file.relative_to(target_path)}")
        else:
            failed += 1
            print(f"  ✗ Falha na conversão")
    
    # Resumo
    print("\n" + "=" * 50)
    print(f"Conversão concluída!")
    print(f"  Total de arquivos: {total_files}")
    print(f"  Bem-sucedidos: {successful}")
    print(f"  Falharam: {failed}")

def main():
    """
    Função principal
    """
    # Define os diretórios
    source_dir = "PDF"
    target_dir = "PDF_Markdown"
    
    # Verifica se o diretório de origem existe
    if not os.path.exists(source_dir):
        print(f"Erro: O diretório '{source_dir}' não foi encontrado!")
        sys.exit(1)
    
    print(f"Iniciando conversão de PDFs para Markdown")
    print(f"  Origem: {source_dir}")
    print(f"  Destino: {target_dir}")
    print("")
    
    # Executa a conversão com tradução
    convert_all_pdfs(source_dir, target_dir, translate=True)

if __name__ == "__main__":
    main()