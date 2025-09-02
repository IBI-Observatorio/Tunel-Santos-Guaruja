# Deploy no Railway

## ⚠️ CONFIGURAÇÃO IMPORTANTE PARA NODE.JS 20

O projeto usa `better-sqlite3` que requer Node.js 20+ e Python para compilação.

### Arquivos de Configuração Necessários

#### 1. `nixpacks.toml` (já criado)
Define o ambiente com Node.js 20 e Python3 para compilação.

#### 2. `railway.json` (já atualizado)
Configurado para usar o nixpacks.toml personalizado.

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

### 2. Fazer Commit das Configurações
```bash
git add nixpacks.toml railway.json server.js README_DEPLOY.md
git commit -m "Configurar deploy Railway com Node.js 20 e Python"
git push origin main
```

### 3. Configurar Railway

1. Acesse [Railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project" → "Deploy from GitHub repo"
4. Selecione este repositório
5. Railway usará automaticamente as configurações do nixpacks.toml

### 4. Variáveis de Ambiente

No painel do Railway, adicione as seguintes variáveis:

```
OPENAI_API_KEY=sua_chave_api_aqui
NODE_ENV=production
PORT=${{PORT}}  # Railway fornece automaticamente
```

### 5. Deploy Automático

Railway fará o deploy automaticamente quando você:
- Fizer push para a branch main
- Ou clicar em "Deploy" manualmente

### 6. Comandos Railway

O Railway executará automaticamente (definido em nixpacks.toml):
1. `npm ci` - Instala dependências (com Node.js 20 e Python)
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