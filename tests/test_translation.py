#!/usr/bin/env python3
"""
Script de teste para converter e traduzir apenas alguns PDFs
"""

import os
from pdf_translator_v2 import pdf_to_markdown
from pathlib import Path

def test_translation():
    """Testa a conversão e tradução de alguns arquivos"""
    
    # Lista de arquivos para testar (mistura de inglês e português)
    test_files = [
        "PDF/00-TENDER-NOTICE.pdf",  # Em inglês
        "PDF/00_EDITAL_.pdf",  # Em português
        "PDF/Santos_Guaruja_Immersed_Tunnel_march_2025_vfinal.pdf",  # Em inglês
    ]
    
    # Cria diretório de teste
    output_dir = Path("PDF_Test_Translation")
    output_dir.mkdir(exist_ok=True)
    
    print("=" * 60)
    print("TESTE DE CONVERSÃO E TRADUÇÃO")
    print("=" * 60)
    
    for pdf_file in test_files:
        if os.path.exists(pdf_file):
            filename = os.path.basename(pdf_file)
            output_file = output_dir / filename.replace('.pdf', '.md')
            
            print(f"\n📄 Processando: {filename}")
            print(f"   Destino: {output_file}")
            
            success = pdf_to_markdown(pdf_file, str(output_file), translate=True)
            
            if success:
                print(f"   ✅ Conversão concluída!")
                # Verifica tamanho do arquivo gerado
                size = os.path.getsize(output_file) / 1024  # KB
                print(f"   📊 Tamanho: {size:.1f} KB")
            else:
                print(f"   ❌ Erro na conversão")
        else:
            print(f"\n⚠️  Arquivo não encontrado: {pdf_file}")
    
    print("\n" + "=" * 60)
    print("Teste concluído! Verifique os arquivos em: PDF_Test_Translation/")
    print("=" * 60)

if __name__ == "__main__":
    test_translation()