import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import openaiChatRouter from './server/openai-chat.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração do OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

// Usar rotas do assistente OpenAI
app.use('/api/assistant', openaiChatRouter);

// Servir arquivos estáticos em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Cache de documentos
let documentsCache = [];
let documentEmbeddings = new Map();

// Função para carregar documentos markdown
async function loadDocuments() {
  try {
    const docsPath = path.join(__dirname, 'PDF_Markdown_Traduzido');
    const files = await fs.readdir(docsPath);
    
    documentsCache = [];
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(docsPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        
        // Divide o documento em chunks menores para melhor busca
        const chunks = splitIntoChunks(content, 1000);
        
        chunks.forEach((chunk, index) => {
          documentsCache.push({
            id: `${file}-${index}`,
            title: file.replace('.md', ''),
            content: chunk,
            file: file
          });
        });
      }
    }
    
    console.log(`Carregados ${documentsCache.length} chunks de documentos`);
  } catch (error) {
    console.error('Erro ao carregar documentos:', error);
  }
}

// Função para dividir texto em chunks
function splitIntoChunks(text, maxLength) {
  const chunks = [];
  const paragraphs = text.split('\n\n');
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    if ((currentChunk + paragraph).length > maxLength && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = paragraph;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

// Função para criar embedding
async function createEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Erro ao criar embedding:', error);
    return null;
  }
}

// Função para calcular similaridade de cosseno
function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Função de busca semântica
async function searchDocuments(query, topK = 5) {
  try {
    // Cria embedding da query
    const queryEmbedding = await createEmbedding(query);
    if (!queryEmbedding) return [];
    
    // Calcula embeddings dos documentos se ainda não existirem
    for (const doc of documentsCache) {
      if (!documentEmbeddings.has(doc.id)) {
        const embedding = await createEmbedding(doc.content);
        if (embedding) {
          documentEmbeddings.set(doc.id, embedding);
        }
      }
    }
    
    // Calcula similaridades
    const results = documentsCache
      .map(doc => {
        const docEmbedding = documentEmbeddings.get(doc.id);
        if (!docEmbedding) return null;
        
        return {
          ...doc,
          similarity: cosineSimilarity(queryEmbedding, docEmbedding)
        };
      })
      .filter(doc => doc !== null)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
    
    return results;
  } catch (error) {
    console.error('Erro na busca semântica:', error);
    // Fallback para busca por palavras-chave
    return searchByKeywords(query, topK);
  }
}

// Busca por palavras-chave (fallback)
function searchByKeywords(query, topK = 5) {
  const keywords = query.toLowerCase().split(' ').filter(word => word.length > 2);
  
  const results = documentsCache
    .map(doc => {
      const content = doc.content.toLowerCase();
      const title = doc.title.toLowerCase();
      
      let score = 0;
      keywords.forEach(keyword => {
        // Pontuação maior para matches no título
        if (title.includes(keyword)) score += 10;
        // Conta ocorrências no conteúdo
        const matches = (content.match(new RegExp(keyword, 'g')) || []).length;
        score += matches;
      });
      
      return { ...doc, score };
    })
    .filter(doc => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  
  return results;
}

// Endpoint de busca
app.post('/api/search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query é obrigatória' });
    }
    
    const results = await searchDocuments(query);
    
    res.json({ results });
  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({ error: 'Erro ao processar busca' });
  }
});

// Endpoint de chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages é obrigatório' });
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    res.json({ content: completion.choices[0].message.content });
  } catch (error) {
    console.error('Erro no chat:', error);
    res.status(500).json({ error: 'Erro ao processar mensagem' });
  }
});

// Endpoint de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', documents: documentsCache.length });
});

// Rota catch-all para SPA em produção
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Carrega documentos ao iniciar
loadDocuments().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});

// Recarrega documentos a cada 5 minutos
setInterval(loadDocuments, 5 * 60 * 1000);