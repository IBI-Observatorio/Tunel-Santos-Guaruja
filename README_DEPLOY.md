# Deploy no Railway

## Passos para Deploy

### 1. Preparação Local
```bash
# Instalar dependências
npm install

# Testar build local
npm run build

# Testar servidor em produção
NODE_ENV=production npm run start:prod
```

### 2. Configurar Railway

1. Acesse [Railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project" → "Deploy from GitHub repo"
4. Selecione este repositório
5. Railway detectará automaticamente o Node.js

### 3. Variáveis de Ambiente

No painel do Railway, adicione as seguintes variáveis:

```
OPENAI_API_KEY=sua_chave_api_aqui
NODE_ENV=production
PORT=3001
```

### 4. Deploy Automático

Railway fará o deploy automaticamente quando você:
- Fizer push para a branch main
- Ou clicar em "Deploy" manualmente

### 5. Comandos Railway

O Railway executará automaticamente:
1. `npm install` - Instala dependências
2. `npm run build` - Compila o frontend
3. `npm run start:prod` - Inicia o servidor

### 6. Monitoramento

- Logs: Disponíveis no painel do Railway
- Health Check: `https://seu-app.railway.app/api/health`
- Métricas: Dashboard do Railway

## Estrutura de Arquivos

```
/
├── src/              # Código fonte React
├── dist/             # Build do frontend (gerado)
├── PDF_Markdown_Traduzido/  # Documentos para o chatbot
├── server.js         # Servidor Express
├── package.json      # Dependências e scripts
├── railway.json      # Configuração Railway
└── vite.config.js    # Configuração Vite
```

## Troubleshooting

### Erro de API Key
- Verifique se `OPENAI_API_KEY` está configurada no Railway

### Erro 404 no Frontend
- Certifique-se que o build foi executado
- Verifique se `NODE_ENV=production` está configurado

### Documentos não carregando
- Verifique se a pasta `PDF_Markdown_Traduzido` está no repositório
- Confirme que os arquivos .md estão presentes

## URLs Importantes

- Frontend: `https://seu-app.railway.app`
- API Chat: `https://seu-app.railway.app/api/chat`
- API Search: `https://seu-app.railway.app/api/search`
- Health Check: `https://seu-app.railway.app/api/health`