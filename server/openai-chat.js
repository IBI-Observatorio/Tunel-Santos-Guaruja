import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega .env do diretório raiz
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// Fallback: lê diretamente do arquivo se necessário
let apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  try {
    const envContent = fsSync.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/^OPENAI_API_KEY=(.+)$/m);
    if (match) {
      apiKey = match[1].trim();
    }
  } catch (e) {
    console.error('Erro ao ler .env:', e);
  }
}

console.log('API Key carregada:', apiKey ? `${apiKey.substring(0, 20)}...` : 'NÃO ENCONTRADA');

const router = express.Router();

// Inicializa cliente OpenAI
const openai = new OpenAI({
  apiKey: apiKey || '',
});

// Carrega configuração do assistente
let assistantConfig = null;

async function loadAssistantConfig() {
  try {
    const configPath = path.join(__dirname, '..', '.openai_config.json');
    const configData = await fs.readFile(configPath, 'utf-8');
    assistantConfig = JSON.parse(configData);
    console.log('✅ Configuração do assistente carregada');
    return true;
  } catch (error) {
    console.error('❌ Erro ao carregar configuração do assistente:', error);
    // Tenta usar variáveis de ambiente como fallback
    if (process.env.OPENAI_ASSISTANT_ID) {
      assistantConfig = {
        assistant_id: process.env.OPENAI_ASSISTANT_ID,
        vector_store_id: process.env.OPENAI_VECTOR_STORE_ID
      };
      console.log('✅ Usando configuração das variáveis de ambiente');
      return true;
    }
    return false;
  }
}

// Carrega configuração na inicialização
loadAssistantConfig();

// Cache de threads por sessão (em produção, use Redis ou similar)
const threadCache = new Map();

// Limpa threads antigas periodicamente (a cada hora)
setInterval(() => {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  for (const [sessionId, data] of threadCache.entries()) {
    if (data.lastAccess < oneHourAgo) {
      threadCache.delete(sessionId);
    }
  }
}, 60 * 60 * 1000);

/**
 * Endpoint para chat com o assistente
 */
router.post('/chat', async (req, res) => {
  try {
    // Verifica se o assistente está configurado
    if (!assistantConfig) {
      const loaded = await loadAssistantConfig();
      if (!loaded) {
        return res.status(500).json({
          error: 'Assistente não configurado. Execute o script setup_openai_assistant.py primeiro.'
        });
      }
    }

    const { message, sessionId = 'default' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }

    // Obtém ou cria thread para a sessão
    let threadId;
    if (threadCache.has(sessionId)) {
      const threadData = threadCache.get(sessionId);
      threadId = threadData.threadId;
      threadData.lastAccess = Date.now();
    } else {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
      threadCache.set(sessionId, {
        threadId,
        lastAccess: Date.now()
      });
    }

    // Adiciona mensagem do usuário à thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message
    });

    // Executa o assistente
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantConfig.assistant_id
    });

    // Aguarda conclusão da execução
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    
    while (runStatus.status !== 'completed' && runStatus.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      
      // Timeout após 30 segundos
      if (Date.now() - new Date(runStatus.created_at * 1000) > 30000) {
        throw new Error('Timeout ao processar resposta');
      }
    }

    if (runStatus.status === 'failed') {
      throw new Error('Erro ao processar resposta do assistente');
    }

    // Obtém mensagens da thread
    const messages = await openai.beta.threads.messages.list(threadId);
    
    // Pega a última mensagem do assistente
    const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
    
    if (!assistantMessage) {
      throw new Error('Nenhuma resposta do assistente');
    }

    // Extrai o conteúdo da mensagem
    let responseContent = '';
    let citations = [];
    
    for (const content of assistantMessage.content) {
      if (content.type === 'text') {
        responseContent = content.text.value;
        
        // Extrai citações se houver
        if (content.text.annotations && content.text.annotations.length > 0) {
          citations = content.text.annotations
            .filter(ann => ann.type === 'file_citation')
            .map(ann => ({
              text: ann.text,
              file_id: ann.file_citation?.file_id
            }));
        }
      }
    }

    // Retorna resposta
    res.json({
      response: responseContent,
      citations,
      sessionId,
      threadId
    });

  } catch (error) {
    console.error('Erro no chat:', error);
    res.status(500).json({
      error: 'Erro ao processar mensagem',
      details: error.message
    });
  }
});

/**
 * Endpoint para buscar informações nos documentos (alternativa simples)
 */
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query é obrigatória' });
    }

    // Por enquanto, retorna resultados mockados
    // Em produção, você pode implementar busca direta nos arquivos locais
    res.json({
      results: [
        {
          title: 'Informações do Projeto',
          content: 'O Túnel Santos-Guarujá é um projeto de infraestrutura...',
          relevance: 0.95
        }
      ]
    });

  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({
      error: 'Erro ao realizar busca',
      details: error.message
    });
  }
});

/**
 * Endpoint para limpar histórico de uma sessão
 */
router.post('/clear-session', async (req, res) => {
  try {
    const { sessionId = 'default' } = req.body;
    
    if (threadCache.has(sessionId)) {
      threadCache.delete(sessionId);
    }
    
    res.json({ success: true, message: 'Sessão limpa com sucesso' });
  } catch (error) {
    console.error('Erro ao limpar sessão:', error);
    res.status(500).json({
      error: 'Erro ao limpar sessão',
      details: error.message
    });
  }
});

/**
 * Endpoint para verificar status do assistente
 */
router.get('/status', async (req, res) => {
  try {
    if (!assistantConfig) {
      await loadAssistantConfig();
    }

    if (!assistantConfig) {
      return res.json({
        configured: false,
        message: 'Assistente não configurado'
      });
    }

    // Verifica se o assistente existe
    try {
      const assistant = await openai.beta.assistants.retrieve(assistantConfig.assistant_id);
      
      res.json({
        configured: true,
        assistant: {
          id: assistant.id,
          name: assistant.name,
          model: assistant.model,
          created_at: assistant.created_at
        },
        vector_store_id: assistantConfig.vector_store_id,
        files_count: assistantConfig.files?.length || 0
      });
    } catch (error) {
      res.json({
        configured: false,
        message: 'Assistente configurado mas não encontrado na OpenAI',
        error: error.message
      });
    }

  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({
      error: 'Erro ao verificar status',
      details: error.message
    });
  }
});

export default router;