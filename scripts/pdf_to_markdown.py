#!/usr/bin/env python3
"""
Script para converter arquivos PDF para Markdown
Mantém a estrutura de pastas e converte todos os PDFs encontrados
"""

import os
import sys
import fitz  # PyMuPDF
import re
from pathlib import Path
from typing import Optional
import unicodedata

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

def pdf_to_markdown(pdf_path: str, output_path: Optional[str] = None) -> bool:
    """
    Converte um arquivo PDF para Markdown
    
    Args:
        pdf_path: Caminho do arquivo PDF
        output_path: Caminho de saída (opcional)
    
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
                markdown_content.append(f"# {metadata.get('title', 'Documento PDF')}\n")
            
            # Adiciona metadados como comentário
            markdown_content.append("<!--")
            for key, value in metadata.items():
                if value:
                    markdown_content.append(f"  {key}: {value}")
            markdown_content.append("-->\n")
        else:
            # Se não houver título, usa o nome do arquivo
            filename = os.path.basename(pdf_path).replace('.pdf', '')
            markdown_content.append(f"# {filename}\n")
        
        # Processa cada página
        for page_num, page in enumerate(doc, 1):
            markdown_content.append(f"\n## Página {page_num}\n")
            
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
                
                markdown_content.extend(final_text)
            else:
                markdown_content.append("*[Página sem texto ou contém apenas imagens]*")
        
        # Fecha o documento
        doc.close()
        
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

def convert_all_pdfs(source_dir: str, target_dir: str):
    """
    Converte todos os PDFs em um diretório e subdiretórios
    
    Args:
        source_dir: Diretório de origem com PDFs
        target_dir: Diretório de destino para arquivos Markdown
    """
    source_path = Path(source_dir)
    target_path = Path(target_dir)
    
    # Cria o diretório de destino se não existir
    target_path.mkdir(parents=True, exist_ok=True)
    
    # Contador de arquivos
    total_files = 0
    successful = 0
    failed = 0
    
    # Encontra todos os arquivos PDF
    pdf_files = list(source_path.rglob('*.pdf'))
    total_files = len(pdf_files)
    
    print(f"Encontrados {total_files} arquivos PDF para converter")
    print("=" * 50)
    
    for pdf_file in pdf_files:
        # Calcula o caminho relativo
        relative_path = pdf_file.relative_to(source_path)
        
        # Cria o caminho de destino mantendo a estrutura de pastas
        target_file = target_path / relative_path.with_suffix('.md')
        
        # Cria o diretório de destino se necessário
        target_file.parent.mkdir(parents=True, exist_ok=True)
        
        print(f"Convertendo: {relative_path}")
        
        # Converte o arquivo
        if pdf_to_markdown(str(pdf_file), str(target_file)):
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
    
    # Executa a conversão
    convert_all_pdfs(source_dir, target_dir)

if __name__ == "__main__":
    main()