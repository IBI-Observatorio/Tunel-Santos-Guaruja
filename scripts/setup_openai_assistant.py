#!/usr/bin/env python3
"""
Script para configurar o assistente da OpenAI com File Search
Este script deve ser executado apenas uma vez para criar o assistente e fazer upload dos documentos
"""

import os
import time
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv
import json

# Carrega variáveis de ambiente do diretório pai
env_path = Path(__file__).parent.parent / '.env'
print(f"Carregando .env de: {env_path}")

# Tenta carregar com override=True para forçar
from dotenv import dotenv_values
config = dotenv_values(str(env_path))
print(f"Variáveis carregadas do .env: {list(config.keys())}")

# Define manualmente a variável de ambiente
if 'OPENAI_API_KEY' in config:
    os.environ['OPENAI_API_KEY'] = config['OPENAI_API_KEY']
    print(f"API Key definida manualmente: {config['OPENAI_API_KEY'][:20]}...")

# Inicializa cliente OpenAI
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def upload_files_to_openai():
    """Faz upload de todos os arquivos markdown para a OpenAI (incluindo subpastas)"""
    # Usa caminho relativo ao diretório do projeto
    markdown_dir = Path(__file__).parent.parent / 'PDF_Markdown_Traduzido'
    file_ids = []
    
    print("📤 Iniciando upload dos arquivos...")
    
    # Usa rglob para buscar recursivamente em todas as subpastas
    all_files = list(markdown_dir.rglob('*.md'))
    print(f"📁 Encontrados {len(all_files)} arquivos markdown\n")
    
    for i, file_path in enumerate(all_files, 1):
        try:
            # Mostra o caminho relativo para melhor visualização
            relative_path = file_path.relative_to(markdown_dir)
            print(f"  [{i}/{len(all_files)}] Enviando: {relative_path}")
            
            with open(file_path, 'rb') as file:
                response = client.files.create(
                    file=file,
                    purpose='assistants'
                )
                file_ids.append({
                    'id': response.id,
                    'filename': str(relative_path),
                    'full_path': str(file_path)
                })
                print(f"    ✅ ID: {response.id}")
                
            # Pequena pausa para evitar rate limiting
            if i % 10 == 0:
                time.sleep(1)
                
        except Exception as e:
            print(f"    ❌ Erro ao enviar {relative_path}: {e}")
    
    return file_ids

def create_vector_store(file_ids):
    """Cria um Vector Store com os arquivos enviados"""
    print("\n📊 Criando Vector Store...")
    
    try:
        vector_store = client.beta.vector_stores.create(
            name="Documentos Túnel Santos-Guarujá",
            file_ids=[f['id'] for f in file_ids]
        )
        print(f"✅ Vector Store criado: {vector_store.id}")
        return vector_store.id
    except Exception as e:
        print(f"❌ Erro ao criar Vector Store: {e}")
        return None

def create_assistant(vector_store_id):
    """Cria o assistente com File Search habilitado"""
    print("\n🤖 Criando assistente...")
    
    try:
        assistant = client.beta.assistants.create(
            name="Assistente Túnel Santos-Guarujá",
            instructions="""Você é um assistente especializado no projeto do Túnel Imerso Santos-Guarujá. 
            Sua função é responder perguntas sobre o projeto usando as informações dos documentos disponíveis.
            
            Diretrizes:
            - Seja preciso e objetivo nas respostas
            - Use informações dos documentos oficiais do projeto
            - Cite valores, prazos e dados técnicos quando relevante
            - Se não souber a resposta, indique que a informação não está disponível nos documentos
            - Mantenha um tom profissional e amigável
            - Responda em português brasileiro
            
            Contexto do projeto:
            - Túnel imerso ligando Santos a Guarujá
            - Primeiro túnel imerso do Brasil
            - Investimento de aproximadamente R$ 7 bilhões
            - PPP com concessão de 30 anos
            - 6 faixas de rodagem, ciclovia e passagem para pedestres
            """,
            model="gpt-4o-mini",
            tools=[{"type": "file_search"}],
            tool_resources={
                "file_search": {
                    "vector_store_ids": [vector_store_id]
                }
            }
        )
        print(f"✅ Assistente criado: {assistant.id}")
        return assistant.id
    except Exception as e:
        print(f"❌ Erro ao criar assistente: {e}")
        return None

def save_configuration(file_ids, vector_store_id, assistant_id):
    """Salva a configuração para uso posterior"""
    config = {
        'assistant_id': assistant_id,
        'vector_store_id': vector_store_id,
        'files': file_ids,
        'created_at': time.strftime('%Y-%m-%d %H:%M:%S')
    }
    
    config_file = Path(__file__).parent.parent / '.openai_config.json'
    with open(config_file, 'w') as f:
        json.dump(config, f, indent=2)
    
    print(f"\n💾 Configuração salva em {config_file}")
    print("\n📝 Adicione estas variáveis ao seu arquivo .env:")
    print(f"OPENAI_ASSISTANT_ID={assistant_id}")
    print(f"OPENAI_VECTOR_STORE_ID={vector_store_id}")

def main():
    """Função principal"""
    print("🚀 Configurando Assistente OpenAI para o Túnel Santos-Guarujá\n")
    
    # Verifica se a API key está configurada
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        print("❌ OPENAI_API_KEY não encontrada no arquivo .env")
        print("Por favor, adicione sua chave da API OpenAI ao arquivo .env")
        print(f"Debug - Variáveis de ambiente carregadas: {list(os.environ.keys())[:10]}")
        return
    
    print(f"✅ API Key encontrada: {api_key[:20]}...")
    
    # Verifica se já existe uma configuração
    config_file = Path(__file__).parent.parent / '.openai_config.json'
    if config_file.exists():
        with open(config_file, 'r') as f:
            existing_config = json.load(f)
        print(f"⚠️  Configuração existente encontrada (criada em {existing_config['created_at']})")
        response = input("Deseja sobrescrever? (s/n): ")
        if response.lower() != 's':
            print("Operação cancelada.")
            return
    
    # Upload dos arquivos
    file_ids = upload_files_to_openai()
    if not file_ids:
        print("❌ Nenhum arquivo foi enviado com sucesso")
        return
    
    print(f"\n✅ {len(file_ids)} arquivos enviados com sucesso")
    
    # Cria o Vector Store
    vector_store_id = create_vector_store(file_ids)
    if not vector_store_id:
        return
    
    # Cria o assistente
    assistant_id = create_assistant(vector_store_id)
    if not assistant_id:
        return
    
    # Salva a configuração
    save_configuration(file_ids, vector_store_id, assistant_id)
    
    print("\n✨ Configuração concluída com sucesso!")
    print("Agora você pode usar o assistente no seu aplicativo.")

if __name__ == "__main__":
    main()