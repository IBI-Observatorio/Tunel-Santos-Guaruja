#!/usr/bin/env python3
"""
Script de teste rápido do assistente OpenAI
Cria um assistente de teste com apenas alguns arquivos
"""

import os
import time
from pathlib import Path
from openai import OpenAI
from dotenv import dotenv_values
import json

# Carrega variáveis de ambiente
env_path = Path(__file__).parent.parent / '.env'
config = dotenv_values(str(env_path))

if 'OPENAI_API_KEY' in config:
    os.environ['OPENAI_API_KEY'] = config['OPENAI_API_KEY']
    print(f"✅ API Key carregada: {config['OPENAI_API_KEY'][:20]}...")
else:
    print("❌ OPENAI_API_KEY não encontrada")
    exit(1)

# Inicializa cliente OpenAI
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def test_simple_assistant():
    """Testa criação de assistente sem arquivos"""
    print("\n🧪 Testando criação de assistente simples...")
    
    try:
        # Cria assistente sem arquivos primeiro
        assistant = client.beta.assistants.create(
            name="Assistente Teste - Túnel Santos-Guarujá",
            instructions="""Você é um assistente especializado no projeto do Túnel Imerso Santos-Guarujá. 
            Responda com base no seu conhecimento sobre o projeto.
            
            Informações principais:
            - Investimento total: R$ 7 bilhões
            - Prazo de concessão: 30 anos
            - Leilão: 5 de setembro de 2025
            - Extensão: 870m de túnel imerso
            - 6 faixas de rodagem + ciclovia + pedestres
            """,
            model="gpt-4o-2024-11-20",
            tools=[]  # Sem file_search por enquanto
        )
        
        print(f"✅ Assistente criado: {assistant.id}")
        
        # Testa o assistente
        thread = client.beta.threads.create()
        
        message = client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content="Qual o valor do investimento do túnel?"
        )
        
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant.id
        )
        
        # Aguarda resposta
        print("⏳ Aguardando resposta...")
        while run.status != "completed":
            time.sleep(1)
            run = client.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id
            )
            if run.status == "failed":
                print(f"❌ Erro: {run.last_error}")
                return
        
        # Obtém resposta
        messages = client.beta.threads.messages.list(thread_id=thread.id)
        assistant_message = messages.data[0]
        
        print(f"\n💬 Pergunta: Qual o valor do investimento do túnel?")
        print(f"🤖 Resposta: {assistant_message.content[0].text.value}")
        
        # Salva configuração
        config = {
            'assistant_id': assistant.id,
            'type': 'simple_test',
            'created_at': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        config_file = Path(__file__).parent.parent / '.openai_test_config.json'
        with open(config_file, 'w') as f:
            json.dump(config, f, indent=2)
        
        print(f"\n💾 Configuração de teste salva em {config_file}")
        print(f"📝 Para usar este assistente, adicione ao .env:")
        print(f"OPENAI_ASSISTANT_ID={assistant.id}")
        
        return assistant.id
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        return None

if __name__ == "__main__":
    print("🚀 Teste Rápido do Assistente OpenAI\n")
    assistant_id = test_simple_assistant()
    
    if assistant_id:
        print("\n✨ Teste concluído com sucesso!")
        print("O assistente está funcionando e pode responder perguntas básicas.")
        print("Para o assistente completo com todos os documentos, aguarde o script principal terminar.")