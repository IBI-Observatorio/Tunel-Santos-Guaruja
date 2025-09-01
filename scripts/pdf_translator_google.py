#!/usr/bin/env python3
"""
Script para converter PDFs para Markdown com tradução usando Google Translate
Versão otimizada para processar múltiplos arquivos rapidamente
"""

import os
import sys
import fitz  # PyMuPDF
import re
from pathlib import Path
from typing import Optional, Tuple
import unicodedata
from deep_translator import GoogleTranslator
import time

def clean_filename(filename: str) -> str:
    """Limpa o nome do arquivo"""
    filename = unicodedata.normalize('NFKD', filename)
    filename = re.sub(r'[^\w\s.-]', '_', filename)
    filename = re.sub(r'\s+', ' ', filename)
    return filename.strip()

def detect_language(text: str) -> str:
    """Detecta idioma do texto"""
    if not text or len(text) < 30:
        return 'pt'
    
    # Indicadores de inglês
    english_words = ['the', 'and', 'of', 'to', 'in', 'is', 'for', 'with', 'that', 'this', 
                    'agreement', 'contract', 'shall', 'must', 'hereby']
    
    # Indicadores de português
    portuguese_words = ['de', 'da', 'do', 'para', 'com', 'em', 'por', 'que', 'não', 
                       'contrato', 'acordo', 'deve', 'deverá']
    
    text_lower = text.lower()[:500]  # Analisa só o início
    
    english_count = sum(1 for word in english_words if f' {word} ' in text_lower)
    portuguese_count = sum(1 for word in portuguese_words if f' {word} ' in text_lower)
    
    return 'en' if english_count > portuguese_count * 1.5 else 'pt'

def translate_text(text: str, max_chunk_size: int = 4900) -> Tuple[str, bool]:
    """Traduz texto usando Google Translate"""
    
    if not text or detect_language(text) == 'pt':
        return text, False
    
    try:
        translator = GoogleTranslator(source='en', target='pt')
        
        # Se texto é pequeno, traduz direto
        if len(text) <= max_chunk_size:
            translated = translator.translate(text)
            return translated if translated else text, True
        
        # Divide em chunks para textos grandes
        chunks = []
        current_pos = 0
        
        while current_pos < len(text):
            end_pos = min(current_pos + max_chunk_size, len(text))
            
            # Encontra quebra natural
            if end_pos < len(text):
                for sep in ['\n\n', '\n', '. ', '! ', '? ']:
                    last_sep = text.rfind(sep, current_pos, end_pos)
                    if last_sep > current_pos + max_chunk_size//2:
                        end_pos = last_sep + len(sep)
                        break
            
            chunk = text[current_pos:end_pos]
            if chunk.strip():
                try:
                    translated_chunk = translator.translate(chunk)
                    chunks.append(translated_chunk if translated_chunk else chunk)
                except:
                    chunks.append(chunk)
                time.sleep(0.1)  # Evita rate limiting
            
            current_pos = end_pos
        
        return ''.join(chunks), True
        
    except Exception as e:
        print(f"  ⚠ Erro na tradução: {str(e)}")
        return text, False

def pdf_to_markdown(pdf_path: str, output_path: Optional[str] = None, translate: bool = True) -> bool:
    """Converte PDF para Markdown com opção de tradução"""
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
            markdown_content.append("  Tradução automática via Google Translate quando aplicável")
        markdown_content.append("-->\n")
        
        # Processa páginas
        for page_num, page in enumerate(doc, 1):
            markdown_content.append(f"\n## Página {page_num}\n")
            
            text = page.get_text()
            
            if text.strip():
                # Formata texto
                lines = text.split('\n')
                processed = []
                
                for line in lines:
                    line = line.strip()
                    if not line:
                        continue
                    
                    # Detecta formatação
                    if line.isupper() and 3 < len(line) < 100:
                        processed.append(f"### {line}")
                    elif re.match(r'^\d+\.?\s+', line):
                        processed.append(line)
                    elif re.match(r'^[•·▪▫◦‣⁃]\s+', line):
                        processed.append(f"- {re.sub(r'^[•·▪▫◦‣⁃]\s+', '', line)}")
                    else:
                        processed.append(line)
                
                page_text = '\n'.join(processed)
                
                # Traduz se necessário
                if translate:
                    page_text, was_translated = translate_text(page_text)
                    if was_translated:
                        print(f"    📝 Página {page_num} traduzida")
                
                markdown_content.append(page_text)
            else:
                markdown_content.append("*[Página sem texto ou contém apenas imagens]*")
        
        doc.close()
        
        # Salva arquivo
        if output_path is None:
            output_path = pdf_path.replace('.pdf', '.md')
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(markdown_content))
        
        return True
        
    except Exception as e:
        print(f"  ✗ Erro: {str(e)}")
        return False

def convert_all_pdfs(source_dir: str, target_dir: str, translate: bool = True, limit: Optional[int] = None):
    """Converte todos os PDFs"""
    source_path = Path(source_dir)
    target_path = Path(target_dir)
    target_path.mkdir(parents=True, exist_ok=True)
    
    pdf_files = list(source_path.rglob('*.pdf'))
    
    if limit:
        pdf_files = pdf_files[:limit]
    
    total = len(pdf_files)
    
    print(f"🚀 Convertendo {total} arquivos PDF")
    print(f"📝 Tradução: {'ATIVADA' if translate else 'DESATIVADA'}")
    print("=" * 50)
    
    successful = 0
    failed = 0
    
    for idx, pdf_file in enumerate(pdf_files, 1):
        relative_path = pdf_file.relative_to(source_path)
        target_file = target_path / relative_path.with_suffix('.md')
        target_file.parent.mkdir(parents=True, exist_ok=True)
        
        print(f"\n[{idx}/{total}] {relative_path.name}")
        
        if pdf_to_markdown(str(pdf_file), str(target_file), translate=translate):
            successful += 1
            print(f"  ✅ Concluído")
        else:
            failed += 1
            print(f"  ❌ Falhou")
    
    print("\n" + "=" * 50)
    print(f"✨ Conversão finalizada!")
    print(f"  ✅ Sucesso: {successful}")
    print(f"  ❌ Falhas: {failed}")
    print(f"  📁 Arquivos em: {target_dir}/")

def main():
    if len(sys.argv) > 1:
        if sys.argv[1] == "--auto":
            # Modo automático sem interação
            source = "PDF"
            target = "PDF_Markdown_Traduzido"
            
            if not os.path.exists(source):
                print(f"❌ Diretório '{source}' não encontrado!")
                sys.exit(1)
            
            convert_all_pdfs(source, target, translate=True)
        else:
            # Teste com arquivo específico
            test_file = sys.argv[1]
            if os.path.exists(test_file):
                print(f"Testando: {test_file}")
                output = test_file.replace('.pdf', '_translated.md')
                if pdf_to_markdown(test_file, output, translate=True):
                    print(f"✅ Convertido: {output}")
            else:
                print(f"❌ Arquivo não encontrado: {test_file}")
    else:
        # Conversão completa
        source = "PDF"
        target = "PDF_Markdown_PT"
        
        if not os.path.exists(source):
            print(f"❌ Diretório '{source}' não encontrado!")
            sys.exit(1)
        
        # Pergunta se quer converter todos ou apenas alguns
        print("Escolha uma opção:")
        print("1. Converter TODOS os arquivos (146 PDFs)")
        print("2. Converter apenas 10 arquivos como teste")
        print("3. Converter sem tradução")
        
        choice = input("\nOpção (1/2/3): ").strip()
        
        if choice == "2":
            convert_all_pdfs(source, target, translate=True, limit=10)
        elif choice == "3":
            convert_all_pdfs(source, target, translate=False)
        else:
            convert_all_pdfs(source, target, translate=True)

if __name__ == "__main__":
    main()