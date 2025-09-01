#!/usr/bin/env python3
"""
Script robusto para converter todos os PDFs para Markdown com tradução
Continua de onde parou se interrompido
"""

import os
import sys
import fitz
import re
from pathlib import Path
from typing import Optional, Tuple
import unicodedata
from deep_translator import GoogleTranslator
import time
import json

def clean_filename(filename: str) -> str:
    """Limpa o nome do arquivo"""
    filename = unicodedata.normalize('NFKD', filename)
    filename = re.sub(r'[^\w\s.-]', '_', filename)
    filename = re.sub(r'\s+', ' ', filename)
    return filename.strip()

def detect_language(text: str) -> str:
    """Detecta idioma do texto de forma rápida"""
    if not text or len(text) < 30:
        return 'pt'
    
    # Analisa apenas os primeiros 300 caracteres
    sample = text[:300].lower()
    
    # Palavras chave em inglês
    en_keywords = ['the ', ' of ', ' and ', ' to ', ' in ', ' is ', ' for ', ' with ']
    en_count = sum(1 for kw in en_keywords if kw in sample)
    
    # Se tem muitas palavras em inglês, é inglês
    return 'en' if en_count >= 3 else 'pt'

def translate_text(text: str, max_chunk_size: int = 4900) -> Tuple[str, bool]:
    """Traduz texto usando Google Translate com tratamento de erros"""
    
    if not text or len(text.strip()) < 10:
        return text, False
        
    if detect_language(text) == 'pt':
        return text, False
    
    try:
        translator = GoogleTranslator(source='en', target='pt')
        
        # Texto pequeno
        if len(text) <= max_chunk_size:
            try:
                translated = translator.translate(text)
                return translated if translated else text, True
            except:
                return text, False
        
        # Texto grande - divide em chunks
        chunks = []
        lines = text.split('\n')
        current_chunk = []
        current_size = 0
        
        for line in lines:
            line_size = len(line)
            if current_size + line_size > max_chunk_size and current_chunk:
                # Traduz o chunk atual
                chunk_text = '\n'.join(current_chunk)
                try:
                    translated = translator.translate(chunk_text)
                    chunks.append(translated if translated else chunk_text)
                except:
                    chunks.append(chunk_text)
                current_chunk = [line]
                current_size = line_size
                time.sleep(0.1)
            else:
                current_chunk.append(line)
                current_size += line_size
        
        # Traduz o último chunk
        if current_chunk:
            chunk_text = '\n'.join(current_chunk)
            try:
                translated = translator.translate(chunk_text)
                chunks.append(translated if translated else chunk_text)
            except:
                chunks.append(chunk_text)
        
        return '\n'.join(chunks), True
        
    except Exception as e:
        return text, False

def pdf_to_markdown(pdf_path: str, output_path: str, translate: bool = True) -> bool:
    """Converte PDF para Markdown com tradução opcional"""
    try:
        doc = fitz.open(pdf_path)
        markdown_content = []
        
        # Título
        filename = os.path.basename(pdf_path).replace('.pdf', '')
        markdown_content.append(f"# {filename}\n")
        
        # Metadados
        markdown_content.append("<!--")
        markdown_content.append("  Documento convertido de PDF para Markdown")
        if translate:
            markdown_content.append("  Tradução automática aplicada quando detectado inglês")
        markdown_content.append("-->\n")
        
        # Processa cada página
        pages_translated = 0
        
        for page_num, page in enumerate(doc, 1):
            markdown_content.append(f"\n## Página {page_num}\n")
            
            text = page.get_text()
            
            if text.strip():
                # Formata o texto básico
                lines = text.split('\n')
                processed = []
                
                for line in lines:
                    line = line.strip()
                    if not line:
                        continue
                    
                    # Formatação básica
                    if line.isupper() and 3 < len(line) < 100:
                        processed.append(f"### {line}")
                    elif re.match(r'^\d+\.?\s+', line):
                        processed.append(line)
                    elif re.match(r'^[•·▪▫◦‣⁃]\s+', line):
                        processed.append(f"- {re.sub(r'^[•·▪▫◦‣⁃]\s+', '', line)}")
                    else:
                        processed.append(line)
                
                page_text = '\n'.join(processed)
                
                # Traduz se necessário e se não for muito grande
                if translate and len(page_text) < 10000:  # Limita páginas muito grandes
                    translated_text, was_translated = translate_text(page_text)
                    if was_translated:
                        page_text = translated_text
                        pages_translated += 1
                
                markdown_content.append(page_text)
            else:
                markdown_content.append("*[Página sem texto ou contém apenas imagens]*")
        
        doc.close()
        
        # Salva arquivo
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(markdown_content))
        
        if pages_translated > 0:
            print(f"    ✅ {pages_translated} páginas traduzidas")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Erro: {str(e)[:50]}")
        return False

def get_progress_file():
    """Retorna o caminho do arquivo de progresso"""
    return Path("conversion_progress.json")

def load_progress():
    """Carrega o progresso salvo"""
    progress_file = get_progress_file()
    if progress_file.exists():
        with open(progress_file, 'r') as f:
            return set(json.load(f))
    return set()

def save_progress(completed_files):
    """Salva o progresso"""
    with open(get_progress_file(), 'w') as f:
        json.dump(list(completed_files), f)

def convert_all_pdfs():
    """Converte todos os PDFs com continuação automática"""
    source_path = Path("PDF")
    target_path = Path("PDF_Markdown_PT")
    target_path.mkdir(parents=True, exist_ok=True)
    
    # Carrega progresso anterior
    completed = load_progress()
    
    # Lista todos os PDFs
    pdf_files = list(source_path.rglob('*.pdf'))
    total = len(pdf_files)
    
    # Filtra arquivos já processados
    pending_files = [f for f in pdf_files if str(f) not in completed]
    already_done = len(completed)
    
    print(f"🚀 Conversão de PDFs para Markdown com Tradução")
    print(f"📊 Status: {already_done}/{total} já convertidos")
    print(f"📝 Pendentes: {len(pending_files)} arquivos")
    print("=" * 60)
    
    successful = already_done
    failed = 0
    
    for idx, pdf_file in enumerate(pending_files, 1):
        relative_path = pdf_file.relative_to(source_path)
        target_file = target_path / relative_path.with_suffix('.md')
        target_file.parent.mkdir(parents=True, exist_ok=True)
        
        current_total = already_done + idx
        print(f"\n[{current_total}/{total}] {relative_path.name[:50]}")
        
        try:
            if pdf_to_markdown(str(pdf_file), str(target_file), translate=True):
                successful += 1
                completed.add(str(pdf_file))
                save_progress(completed)
                print(f"  ✅ Salvo: {target_file.name}")
            else:
                failed += 1
                print(f"  ⚠️  Falhou - continuando...")
        except KeyboardInterrupt:
            print("\n\n⚠️  Interrompido pelo usuário")
            print(f"Progresso salvo: {successful}/{total}")
            print("Execute novamente para continuar de onde parou")
            save_progress(completed)
            sys.exit(0)
        except Exception as e:
            failed += 1
            print(f"  ❌ Erro inesperado: {str(e)[:50]}")
            continue
        
        # Pequena pausa para não sobrecarregar
        if idx % 10 == 0:
            time.sleep(1)
    
    # Resultado final
    print("\n" + "=" * 60)
    print(f"✨ CONVERSÃO CONCLUÍDA!")
    print(f"  ✅ Sucesso: {successful}")
    print(f"  ❌ Falhas: {failed}")
    print(f"  📁 Arquivos em: PDF_Markdown_PT/")
    
    # Remove arquivo de progresso ao terminar
    progress_file = get_progress_file()
    if progress_file.exists():
        progress_file.unlink()

def main():
    print("Iniciando conversão de todos os PDFs...")
    print("Pressione Ctrl+C a qualquer momento para pausar")
    print("")
    convert_all_pdfs()

if __name__ == "__main__":
    main()