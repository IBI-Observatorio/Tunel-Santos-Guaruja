#!/usr/bin/env python3
import os
import re
import unicodedata
from pathlib import Path

def remove_accents(text):
    """Remove acentos de um texto"""
    nfkd = unicodedata.normalize('NFKD', text)
    return ''.join([c for c in nfkd if not unicodedata.combining(c)])

def normalize_name(name):
    """Normaliza nome removendo acentos, espaços e caracteres especiais"""
    # Remove extensão para processar
    if '.' in name:
        base, ext = os.path.splitext(name)
    else:
        base = name
        ext = ''
    
    # Remove acentos
    normalized = remove_accents(base)
    
    # Substitui espaços e caracteres especiais por underscore
    normalized = re.sub(r'[^\w\-]', '_', normalized)
    
    # Remove underscores múltiplos
    normalized = re.sub(r'_+', '_', normalized)
    
    # Remove underscore do início e fim
    normalized = normalized.strip('_')
    
    # Converte para minúsculas
    normalized = normalized.lower()
    
    # Adiciona extensão de volta
    if ext:
        normalized = normalized + ext.lower()
    
    return normalized

def rename_files_and_folders(root_path):
    """Renomeia todos os arquivos e pastas recursivamente"""
    root_path = Path(root_path)
    
    # Primeiro, coleta todos os arquivos e pastas
    all_paths = []
    
    # Coleta todos os caminhos
    for dirpath, dirnames, filenames in os.walk(root_path, topdown=False):
        dirpath = Path(dirpath)
        
        # Adiciona arquivos
        for filename in filenames:
            all_paths.append(('file', dirpath / filename))
        
        # Adiciona diretórios (exceto o root)
        for dirname in dirnames:
            full_path = dirpath / dirname
            if full_path != root_path:
                all_paths.append(('dir', full_path))
    
    # Ordena por profundidade (mais profundo primeiro) para evitar problemas
    all_paths.sort(key=lambda x: len(str(x[1]).split(os.sep)), reverse=True)
    
    # Processa renomeações
    rename_count = 0
    for path_type, old_path in all_paths:
        old_name = old_path.name
        new_name = normalize_name(old_name)
        
        if old_name != new_name:
            new_path = old_path.parent / new_name
            
            # Se já existe um arquivo com o novo nome, adiciona um número
            if new_path.exists() and old_path != new_path:
                counter = 1
                base_name, ext = os.path.splitext(new_name)
                while new_path.exists():
                    new_name = f"{base_name}_{counter}{ext}"
                    new_path = old_path.parent / new_name
                    counter += 1
            
            try:
                os.rename(old_path, new_path)
                print(f"Renomeado: {old_path.name} -> {new_name}")
                rename_count += 1
            except Exception as e:
                print(f"Erro ao renomear {old_path}: {e}")
    
    return rename_count

if __name__ == "__main__":
    target_dir = "PDF_Markdown_Traduzido"
    
    if not os.path.exists(target_dir):
        print(f"Diretório {target_dir} não encontrado!")
        exit(1)
    
    print(f"Normalizando nomes em {target_dir}...")
    print("-" * 50)
    
    count = rename_files_and_folders(target_dir)
    
    print("-" * 50)
    print(f"Total de arquivos/pastas renomeados: {count}")