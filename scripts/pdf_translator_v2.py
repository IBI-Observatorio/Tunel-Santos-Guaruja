#!/usr/bin/env python3
"""
Script para converter arquivos PDF para Markdown com tradução automática
Versão ajustada com melhor detecção de idioma e tradução via OpenAI
"""

import os
import sys
import fitz  # PyMuPDF
import re
from pathlib import Path
from typing import Optional, Tuple
import unicodedata
from openai import OpenAI
import time

# Configuração da chave da API via variável de ambiente
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def clean_filename(filename: str) -> str:
    """
    Limpa o nome do arquivo removendo caracteres especiais problemáticos
    """
    filename = unicodedata.normalize('NFKD', filename)
    filename = re.sub(r'[^\w\s.-]', '_', filename)
    filename = re.sub(r'\s+', ' ', filename)
    return filename.strip()

def detect_language(text: str) -> str:
    """
    Detecta se o texto está em inglês ou português
    """
    if not text or len(text) < 50:
        return 'pt'  # Default para português em textos muito curtos
    
    # Palavras comuns em inglês
    english_indicators = [
        r'\b(the|and|of|to|in|is|for|with|that|this|as|are|by|from|or|be|an|at|have|has|was|were|been|but|not|on|it|can|will|may|would|could|should|all|more|than|which|who|what|when|where|why|how|if|then|than|because|while|after|before|during|through|under|over|between|into|about|against|upon|within|without|toward|towards|across|behind|below|above|around|beside|besides|beyond|along|among|throughout|underneath|inside|outside)\b',
        r'\b(agreement|contract|party|parties|shall|must|hereby|herein|whereas|therefore|pursuant|notwithstanding|provided|including|excluding|subject|terms|conditions|obligations|requirements|performance|compliance|provisions|regulations|accordance|applicable|governing|jurisdiction)\b'
    ]
    
    # Palavras comuns em português
    portuguese_indicators = [
        r'\b(de|da|do|das|dos|para|com|em|por|que|não|uma|um|os|as|pelo|pela|sobre|entre|após|antes|durante|através|sob|acima|abaixo|dentro|fora|contra|segundo|conforme|mediante|perante)\b',
        r'\b(contrato|acordo|parte|partes|deve|deverá|mediante|considerando|portanto|nos termos|obstante|desde que|incluindo|excluindo|sujeito|termos|condições|obrigações|requisitos|desempenho|cumprimento|disposições|regulamentos|conformidade|aplicável|regente|jurisdição)\b'
    ]
    
    text_lower = text.lower()
    
    # Conta matches para cada idioma
    english_matches = sum(len(re.findall(pattern, text_lower)) for pattern in english_indicators)
    portuguese_matches = sum(len(re.findall(pattern, text_lower)) for pattern in portuguese_indicators)
    
    # Calcula densidade de indicadores por 100 palavras
    word_count = len(text_lower.split())
    if word_count > 0:
        english_density = (english_matches / word_count) * 100
        portuguese_density = (portuguese_matches / word_count) * 100
        
        # Se inglês tem densidade significativamente maior, é inglês
        if english_density > portuguese_density * 1.5 and english_density > 5:
            return 'en'
    
    return 'pt'

def translate_with_openai(text: str) -> Tuple[str, bool]:
    """
    Traduz texto do inglês para português usando OpenAI
    """
    if not OPENAI_API_KEY:
        return text, False
    
    # Detecta o idioma
    language = detect_language(text)
    if language == 'pt':
        return text, False
    
    try:
        client = OpenAI(api_key=OPENAI_API_KEY)
        
        # Sistema de chunks para textos longos
        max_chars = 3500  # Reduzido para deixar margem
        
        if len(text) > max_chars:
            # Divide em partes menores
            parts = []
            current_pos = 0
            
            while current_pos < len(text):
                end_pos = min(current_pos + max_chars, len(text))
                
                # Encontra ponto de quebra natural
                if end_pos < len(text):
                    for sep in ['\n\n', '\n', '. ', '! ', '? ', ', ']:
                        last_sep = text.rfind(sep, current_pos, end_pos)
                        if last_sep > current_pos + max_chars//2:
                            end_pos = last_sep + len(sep)
                            break
                
                chunk = text[current_pos:end_pos]
                
                if chunk.strip():
                    response = client.chat.completions.create(
                        model="gpt-3.5-turbo",
                        messages=[
                            {
                                "role": "system", 
                                "content": """Você é um tradutor profissional especializado em documentos técnicos e jurídicos.
                                
Instruções:
1. Traduza do inglês para o português do Brasil
2. Mantenha TODA a formatação markdown (###, -, *, etc.)
3. Preserve quebras de linha e espaçamento
4. Mantenha números, datas e valores inalterados
5. Use terminologia técnica apropriada para contratos e documentos oficiais
6. Seja fiel ao original, não adicione nem remova conteúdo"""
                            },
                            {"role": "user", "content": chunk}
                        ],
                        temperature=0.3,
                        max_tokens=4000
                    )
                    
                    translated = response.choices[0].message.content
                    if translated:
                        parts.append(translated)
                    else:
                        parts.append(chunk)
                
                current_pos = end_pos
                
                # Pausa entre requisições
                if current_pos < len(text):
                    time.sleep(0.3)
            
            return '\n'.join(parts), True
        else:
            # Texto pequeno, traduz de uma vez
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system", 
                        "content": """Você é um tradutor profissional especializado em documentos técnicos e jurídicos.
                        
Instruções:
1. Traduza do inglês para o português do Brasil
2. Mantenha TODA a formatação markdown (###, -, *, etc.)
3. Preserve quebras de linha e espaçamento
4. Mantenha números, datas e valores inalterados
5. Use terminologia técnica apropriada para contratos e documentos oficiais
6. Seja fiel ao original, não adicione nem remova conteúdo"""
                    },
                    {"role": "user", "content": text}
                ],
                temperature=0.3,
                max_tokens=4000
            )
            
            translated = response.choices[0].message.content
            return translated if translated else text, True
            
    except Exception as e:
        print(f"  ⚠ Erro na tradução: {str(e)}")
        return text, False

def pdf_to_markdown(pdf_path: str, output_path: Optional[str] = None, translate: bool = True) -> bool:
    """
    Converte um arquivo PDF para Markdown com opção de tradução
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
                markdown_content.append(f"# {title}\n")
            else:
                filename = os.path.basename(pdf_path).replace('.pdf', '')
                markdown_content.append(f"# {filename}\n")
            
            # Adiciona metadados como comentário
            markdown_content.append("<!--")
            markdown_content.append("  Documento convertido de PDF para Markdown")
            if translate:
                markdown_content.append("  Tradução automática aplicada quando detectado conteúdo em inglês")
            for key, value in metadata.items():
                if value:
                    markdown_content.append(f"  {key}: {value}")
            markdown_content.append("-->\n")
        else:
            filename = os.path.basename(pdf_path).replace('.pdf', '')
            markdown_content.append(f"# {filename}\n")
        
        # Processa páginas em lotes para tradução mais eficiente
        all_pages_text = []
        
        for page_num, page in enumerate(doc, 1):
            # Marca início da página
            all_pages_text.append(f"\n[PÁGINA_{page_num}_INÍCIO]\n")
            
            # Extrai texto
            text = page.get_text()
            
            if text.strip():
                # Processa formatação
                lines = text.split('\n')
                processed_lines = []
                
                for line in lines:
                    line = line.strip()
                    if not line:
                        processed_lines.append('')
                        continue
                    
                    # Detecta títulos
                    if line.isupper() and len(line) > 3 and len(line) < 100:
                        processed_lines.append(f"### {line}")
                    elif re.match(r'^\d+\.?\s+', line):
                        processed_lines.append(line)
                    elif re.match(r'^[•·▪▫◦‣⁃]\s+', line):
                        processed_lines.append(f"- {re.sub(r'^[•·▪▫◦‣⁃]\s+', '', line)}")
                    else:
                        processed_lines.append(line)
                
                # Junta parágrafos
                final_text = []
                current_paragraph = []
                
                for line in processed_lines:
                    if line.startswith('#') or line.startswith('-') or line.startswith('*') or re.match(r'^\d+\.', line) or line == '':
                        if current_paragraph:
                            final_text.append(' '.join(current_paragraph))
                            current_paragraph = []
                        if line or line == '':
                            final_text.append(line)
                    else:
                        current_paragraph.append(line)
                
                if current_paragraph:
                    final_text.append(' '.join(current_paragraph))
                
                all_pages_text.append('\n'.join(final_text))
            else:
                all_pages_text.append("*[Página sem texto ou contém apenas imagens]*")
            
            all_pages_text.append(f"\n[PÁGINA_{page_num}_FIM]\n")
        
        # Fecha o documento
        doc.close()
        
        # Junta todo o texto
        full_text = ''.join(all_pages_text)
        
        # Traduz se necessário
        if translate and full_text.strip():
            print(f"  📝 Analisando idioma e traduzindo se necessário...")
            translated_text, was_translated = translate_with_openai(full_text)
            
            if was_translated:
                print(f"  ✓ Tradução aplicada")
                full_text = translated_text
            else:
                print(f"  ℹ Conteúdo já em português ou tradução não necessária")
        
        # Reconstrói o markdown com páginas
        page_pattern = r'\[PÁGINA_(\d+)_INÍCIO\](.*?)\[PÁGINA_\d+_FIM\]'
        pages = re.findall(page_pattern, full_text, re.DOTALL)
        
        for page_num, content in pages:
            markdown_content.append(f"\n## Página {page_num}")
            markdown_content.append(content.strip())
        
        # Define o caminho de saída
        if output_path is None:
            output_path = pdf_path.replace('.pdf', '.md')
        
        # Escreve o arquivo
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(markdown_content))
        
        return True
        
    except Exception as e:
        print(f"  ✗ Erro ao converter {pdf_path}: {str(e)}")
        return False

def convert_all_pdfs(source_dir: str, target_dir: str, translate: bool = True):
    """
    Converte todos os PDFs em um diretório
    """
    source_path = Path(source_dir)
    target_path = Path(target_dir)
    
    # Cria diretório de destino
    target_path.mkdir(parents=True, exist_ok=True)
    
    # Encontra PDFs
    pdf_files = list(source_path.rglob('*.pdf'))
    total_files = len(pdf_files)
    
    print(f"Encontrados {total_files} arquivos PDF")
    print(f"Tradução automática: {'ATIVADA' if translate else 'DESATIVADA'}")
    print("=" * 50)
    
    successful = 0
    failed = 0
    
    for idx, pdf_file in enumerate(pdf_files, 1):
        relative_path = pdf_file.relative_to(source_path)
        target_file = target_path / relative_path.with_suffix('.md')
        
        # Cria diretório se necessário
        target_file.parent.mkdir(parents=True, exist_ok=True)
        
        print(f"\n[{idx}/{total_files}] Convertendo: {relative_path}")
        
        if pdf_to_markdown(str(pdf_file), str(target_file), translate=translate):
            successful += 1
            print(f"  ✓ Salvo em: {target_file.relative_to(target_path)}")
        else:
            failed += 1
    
    # Resumo
    print("\n" + "=" * 50)
    print(f"Conversão concluída!")
    print(f"  Total: {total_files}")
    print(f"  Sucesso: {successful}")
    print(f"  Falhas: {failed}")

def main():
    """
    Função principal
    """
    if len(sys.argv) > 1:
        # Modo teste com arquivo específico
        test_file = sys.argv[1]
        if os.path.exists(test_file):
            print(f"Testando conversão de: {test_file}")
            output = test_file.replace('.pdf', '_translated.md')
            if pdf_to_markdown(test_file, output, translate=True):
                print(f"✓ Arquivo convertido: {output}")
            else:
                print("✗ Erro na conversão")
        else:
            print(f"Arquivo não encontrado: {test_file}")
    else:
        # Conversão completa
        source_dir = "PDF"
        target_dir = "PDF_Markdown_Translated"
        
        if not os.path.exists(source_dir):
            print(f"Erro: Diretório '{source_dir}' não encontrado!")
            sys.exit(1)
        
        print("Iniciando conversão com tradução automática")
        print(f"  Origem: {source_dir}")
        print(f"  Destino: {target_dir}")
        print("")
        
        convert_all_pdfs(source_dir, target_dir, translate=True)

if __name__ == "__main__":
    main()