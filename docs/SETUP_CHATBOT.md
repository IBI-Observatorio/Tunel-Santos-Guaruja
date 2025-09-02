# Configuração do Chatbot com OpenAI Assistant API

Este guia explica como configurar o chatbot usando a API de Assistentes da OpenAI com File Search.

## Pré-requisitos

1. **Conta na OpenAI**: Você precisa ter uma conta na [OpenAI Platform](https://platform.openai.com/)
2. **API Key**: Obtenha sua API key em [OpenAI API Keys](https://platform.openai.com/api-keys)
3. **Python 3.8+**: Para executar o script de configuração
4. **Node.js 18+**: Para rodar o servidor

## Passo 1: Configurar Variáveis de Ambiente

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` e adicione sua API key:
```env
OPENAI_API_KEY=sk-...sua_chave_aqui...
```

## Passo 2: Instalar Dependências

### Dependências Python (para o script de setup)
```bash
pip install openai python-dotenv
```

### Dependências Node.js (para o servidor)
```bash
npm install
```

## Passo 3: Fazer Upload dos Documentos e Criar o Assistente

Execute o script de configuração:

```bash
cd scripts
python setup_openai_assistant.py
```

Este script irá:
1. Fazer upload de todos os 146 arquivos markdown da pasta `PDF_Markdown_Traduzido`
2. Criar um Vector Store com os documentos
3. Criar um assistente configurado para responder sobre o Túnel Santos-Guarujá
4. Salvar as configurações em `.openai_config.json`

**Importante**: Este processo pode levar alguns minutos devido à quantidade de arquivos.

## Passo 4: Atualizar o .env com as IDs Geradas

Após executar o script, você verá algo como:
```
📝 Adicione estas variáveis ao seu arquivo .env:
OPENAI_ASSISTANT_ID=asst_xxxxxxxxxxxxx
OPENAI_VECTOR_STORE_ID=vs_xxxxxxxxxxxxx
```

Adicione essas linhas ao seu arquivo `.env`.

## Passo 5: Iniciar o Servidor

Em um terminal, inicie o servidor backend:
```bash
npm run server
```

Em outro terminal, inicie o frontend:
```bash
npm run dev
```

## Passo 6: Testar o Chatbot

1. Acesse http://localhost:5173
2. Navegue até a seção "Assistente Virtual"
3. Faça perguntas sobre o projeto, como:
   - "Qual o valor total do investimento?"
   - "Quando será o leilão?"
   - "Quantos empregos serão gerados?"
   - "Qual será o prazo de construção?"

## Estrutura da API

### Endpoints Disponíveis

- **POST /api/assistant/chat**: Envia mensagem para o assistente
  - Body: `{ message: string, sessionId?: string }`
  - Response: `{ response: string, citations: array, sessionId: string }`

- **GET /api/assistant/status**: Verifica status do assistente
  - Response: `{ configured: boolean, assistant?: object, files_count?: number }`

- **POST /api/assistant/clear-session**: Limpa histórico da sessão
  - Body: `{ sessionId: string }`

## Custos Estimados

### Upload Inicial
- **Files Storage**: ~$0.20/GB/dia (os arquivos markdown são pequenos, ~10MB total)
- **Vector Store**: Incluído no storage

### Por Consulta
- **Assistants API**: ~$0.03 por 1K tokens (GPT-4 Turbo)
- **File Search**: ~$0.10 por GB pesquisado

### Estimativa Mensal
Para um uso moderado (1000 consultas/mês):
- Storage: ~$6/mês
- Consultas: ~$30-50/mês
- **Total estimado**: $36-56/mês

## Solução de Problemas

### Erro: "Assistente não configurado"
- Verifique se executou o script `setup_openai_assistant.py`
- Confirme que o arquivo `.openai_config.json` foi criado
- Verifique as variáveis de ambiente no `.env`

### Erro: "OPENAI_API_KEY não encontrada"
- Certifique-se de que adicionou sua API key ao arquivo `.env`
- Reinicie o servidor após adicionar a chave

### Timeout ao processar resposta
- O assistente pode demorar mais na primeira consulta
- Verifique sua conexão com a internet
- Considere aumentar o timeout no arquivo `server/openai-chat.js`

### Rate Limiting
- A OpenAI tem limites de taxa
- O script já inclui pausas entre uploads
- Se encontrar erros, aguarde alguns minutos e tente novamente

## Manutenção

### Atualizar Documentos
Para adicionar ou atualizar documentos:
1. Adicione os novos arquivos `.md` na pasta `PDF_Markdown_Traduzido`
2. Execute novamente o script `setup_openai_assistant.py`
3. O script perguntará se deseja sobrescrever a configuração existente

### Monitorar Uso
Acompanhe seu uso e custos em:
- [OpenAI Usage](https://platform.openai.com/usage)

### Logs e Debug
- Os logs do servidor mostram detalhes das requisições
- Use o endpoint `/api/assistant/status` para verificar a configuração
- O campo `citations` nas respostas mostra quais documentos foram consultados

## Segurança

⚠️ **Importante**:
- Nunca commite o arquivo `.env` com suas chaves
- O `.gitignore` já está configurado para ignorar `.env` e `.openai_config.json`
- Em produção, use variáveis de ambiente seguras
- Considere implementar rate limiting adicional
- Adicione autenticação se necessário

## Recursos Adicionais

- [OpenAI Assistants Documentation](https://platform.openai.com/docs/assistants)
- [File Search Guide](https://platform.openai.com/docs/guides/file-search)
- [Pricing Calculator](https://openai.com/pricing)