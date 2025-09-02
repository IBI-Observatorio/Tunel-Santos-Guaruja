# Configuração do Cron Job no Railway

## 📅 Atualização Automática de Notícias

### 1. Adicionar Variáveis de Ambiente no Railway

No painel do Railway, adicione esta variável:

```bash
CRON_SECRET=sua-chave-secreta-aqui-mude-isso
```

⚠️ **IMPORTANTE**: Gere uma chave segura e única. Você pode usar:
```bash
openssl rand -hex 32
```

### 2. Configurar o Cron Job no Railway

No Railway, vá para a aba **"Cron Jobs"** do seu serviço e configure:

#### Opção A: Usando Railway Cron (Recomendado)

1. Clique em **"Add Cron Job"**
2. Configure:
   - **Name**: `Update News`
   - **Schedule**: `0 22 * * *` (22:00 todos os dias - horário UTC)
   - **Command**: 
   ```bash
   curl -X POST https://${{RAILWAY_PUBLIC_DOMAIN}}/api/cron/update-news \
     -H "x-cron-auth: ${{CRON_SECRET}}" \
     -H "Content-Type: application/json"
   ```

#### Opção B: Usando GitHub Actions (Alternativa)

Crie `.github/workflows/update-news.yml`:

```yaml
name: Update News

on:
  schedule:
    # Executa às 22:00 BRT (01:00 UTC)
    - cron: '0 1 * * *'
  workflow_dispatch: # Permite execução manual

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger News Update
        run: |
          curl -X POST ${{ secrets.RAILWAY_URL }}/api/cron/update-news \
            -H "x-cron-auth: ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json"
```

### 3. Horários de Execução

**Schedule Pattern**: `0 22 * * *`

- Formato: `minuto hora dia mês dia-da-semana`
- `0 22 * * *` = 22:00 todos os dias
- **ATENÇÃO**: Railway usa UTC por padrão

#### Conversão de Horários:
- 22:00 BRT (Brasil) = 01:00 UTC (verão)
- 22:00 BRT (Brasil) = 00:00 UTC (inverno)

Para executar às 22:00 no horário de Brasília:
- Horário de verão: use `0 1 * * *`
- Horário padrão: use `0 0 * * *`

### 4. Testar o Endpoint Manualmente

#### Teste local:
```bash
curl -X POST http://localhost:3001/api/cron/update-news \
  -H "x-cron-auth: default-secret-change-me" \
  -H "Content-Type: application/json"
```

#### Teste em produção:
```bash
curl -X POST https://seu-app.railway.app/api/cron/update-news \
  -H "x-cron-auth: sua-chave-secreta" \
  -H "Content-Type: application/json"
```

### 5. Verificar Status da Última Atualização

```bash
curl https://seu-app.railway.app/api/cron/check-update
```

### 6. Monitoramento

O endpoint retorna:
- `success`: true/false
- `totalFound`: número de notícias encontradas
- `relevantCount`: número de notícias relevantes
- `duration`: tempo de execução
- `timestamp`: data/hora da execução

### 7. Logs

Verifique os logs no Railway para acompanhar as execuções:
- `🔄 Iniciando atualização de notícias via cron job...`
- `✅ X notícias encontradas na MediaStack`
- `📊 Y notícias relevantes após filtragem`
- `✅ Cron job de notícias executado às [data/hora]`

### 8. Troubleshooting

#### Erro 401 Unauthorized
- Verifique se `CRON_SECRET` está configurado no Railway
- Confirme que o token está sendo enviado corretamente

#### Notícias não atualizam
- Verifique se `VITE_MEDIA_STACK_API_KEY` está configurada
- Confira os logs para erros da API MediaStack

#### Horário incorreto
- Railway usa UTC, ajuste o cron schedule conforme necessário
- Use https://crontab.guru/ para testar expressões cron

### 9. Alternativa: Railway CLI

Se preferir usar a CLI do Railway:

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Configurar cron
railway cron create \
  --name "Update News" \
  --schedule "0 22 * * *" \
  --command "curl -X POST https://\$RAILWAY_PUBLIC_DOMAIN/api/cron/update-news -H 'x-cron-auth: \$CRON_SECRET'"
```

### 10. Segurança

⚠️ **IMPORTANTE**:
- Sempre use HTTPS em produção
- Mantenha `CRON_SECRET` seguro e único
- Não commite secrets no código
- Rotacione a chave periodicamente
- Monitore logs para tentativas não autorizadas