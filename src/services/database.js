// Serviço de banco de dados local usando IndexedDB
import { adminLog, adminError } from '../utils/debug.js';

class NewsDatabase {
  constructor() {
    this.dbName = 'TunnelNewsDB';
    this.storeName = 'news';
    this.version = 1;
    this.db = null;
  }

  // Inicializar banco de dados
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        adminError('Erro ao abrir banco de dados');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        adminLog('Banco de dados inicializado');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Criar object store para notícias se não existir
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          // Criar índices para busca eficiente
          objectStore.createIndex('date', 'date', { unique: false });
          objectStore.createIndex('source', 'source', { unique: false });
          objectStore.createIndex('category', 'category', { unique: false });
          objectStore.createIndex('url', 'url', { unique: true });
          objectStore.createIndex('title_hash', 'titleHash', { unique: true });
        }
      };
    });
  }

  // Gerar hash simples para título (evitar duplicatas)
  generateTitleHash(title) {
    let hash = 0;
    const str = title.toLowerCase().replace(/\s+/g, '');
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  // Adicionar notícia ao banco
  async addNews(newsItem) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      // Adicionar hash do título para evitar duplicatas
      const newsWithHash = {
        ...newsItem,
        titleHash: this.generateTitleHash(newsItem.title),
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      adminLog(`💾 Salvando notícia com data: ${newsItem.date}`);

      const request = store.add(newsWithHash);

      request.onsuccess = () => {
        adminLog('Notícia adicionada:', newsItem.title);
        resolve(request.result);
      };

      request.onerror = () => {
        // Se erro for de chave duplicada, ignorar
        if (request.error.name === 'ConstraintError') {
          adminLog('Notícia já existe:', newsItem.title);
          resolve(null);
        } else {
          adminError('Erro ao adicionar notícia:', request.error);
          reject(request.error);
        }
      };
    });
  }

  // Adicionar múltiplas notícias
  async addMultipleNews(newsArray) {
    const results = [];
    for (const news of newsArray) {
      try {
        const result = await this.addNews(news);
        if (result) results.push(result);
      } catch (error) {
        adminError('Erro ao adicionar notícia:', error);
      }
    }
    return results;
  }

  // Buscar todas as notícias
  async getAllNews(limit = 50) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('date');
      
      const news = [];
      let count = 0;
      
      // Primeiro, vamos verificar quantas notícias existem no total
      const countRequest = store.count();
      countRequest.onsuccess = () => {
        adminLog(`🔍 Total de notícias no banco antes de buscar: ${countRequest.result}`);
      };
      
      // Buscar em ordem decrescente de data
      const request = index.openCursor(null, 'prev');

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor && count < limit) {
          news.push(cursor.value);
          count++;
          cursor.continue();
        } else {
          adminLog(`📦 Recuperadas ${news.length} notícias do banco (limite: ${limit})`);
          resolve(news);
        }
      };

      request.onerror = () => {
        adminError('Erro ao buscar notícias:', request.error);
        reject(request.error);
      };
    });
  }

  // Buscar notícias por categoria
  async getNewsByCategory(category, limit = 20) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('category');
      
      const news = [];
      let count = 0;
      
      const request = index.openCursor(IDBKeyRange.only(category));

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor && count < limit) {
          news.push(cursor.value);
          count++;
          cursor.continue();
        } else {
          // Ordenar por data (mais recentes primeiro)
          news.sort((a, b) => new Date(b.date) - new Date(a.date));
          resolve(news);
        }
      };

      request.onerror = () => {
        adminError('Erro ao buscar notícias por categoria:', request.error);
        reject(request.error);
      };
    });
  }

  // Buscar notícias dos últimos N dias
  async getRecentNews(days = 7) {
    if (!this.db) await this.init();

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('date');
      
      const news = [];
      const range = IDBKeyRange.lowerBound(cutoffDateStr);
      const request = index.openCursor(range, 'prev');

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          news.push(cursor.value);
          cursor.continue();
        } else {
          resolve(news);
        }
      };

      request.onerror = () => {
        adminError('Erro ao buscar notícias recentes:', request.error);
        reject(request.error);
      };
    });
  }

  // Limpar notícias antigas (manter apenas últimos 30 dias)
  async cleanOldNews(daysToKeep = 30) {
    if (!this.db) await this.init();

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    adminLog(`🗑️ Limpando notícias anteriores a: ${cutoffDateStr}`);

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('date');
      
      let deletedCount = 0;
      const range = IDBKeyRange.upperBound(cutoffDateStr, true);
      const request = index.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          store.delete(cursor.primaryKey);
          deletedCount++;
          cursor.continue();
        } else {
          adminLog(`${deletedCount} notícias antigas removidas`);
          resolve(deletedCount);
        }
      };

      request.onerror = () => {
        adminError('Erro ao limpar notícias antigas:', request.error);
        reject(request.error);
      };
    });
  }

  // Limpar TODAS as notícias do banco
  async clearAllNews() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        adminLog('Banco de dados limpo completamente');
        localStorage.removeItem('lastNewsUpdate');
        resolve(true);
      };

      request.onerror = () => {
        adminError('Erro ao limpar banco de dados:', request.error);
        reject(request.error);
      };
    });
  }

  // Verificar se notícia já existe
  async newsExists(url) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('url');
      const request = index.get(url);

      request.onsuccess = () => {
        resolve(request.result !== undefined);
      };

      request.onerror = () => {
        adminError('Erro ao verificar notícia:', request.error);
        reject(request.error);
      };
    });
  }

  // Obter estatísticas do banco
  async getStats() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const countRequest = store.count();

      countRequest.onsuccess = () => {
        // Formatar data/hora para padrão brasileiro
        const lastUpdateRaw = localStorage.getItem('lastNewsUpdate');
        let lastUpdate = 'Nunca';
        
        if (lastUpdateRaw) {
          const date = new Date(lastUpdateRaw);
          // Verifica se é uma data válida
          if (!isNaN(date.getTime())) {
            lastUpdate = date.toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          }
        }
        
        const stats = {
          totalNews: countRequest.result,
          lastUpdate: lastUpdate,
          dbSize: this.estimateSize()
        };
        resolve(stats);
      };

      countRequest.onerror = () => {
        adminError('Erro ao obter estatísticas:', countRequest.error);
        reject(countRequest.error);
      };
    });
  }

  // Estimar tamanho do banco
  estimateSize() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      return navigator.storage.estimate().then(estimate => {
        return {
          usage: (estimate.usage / 1024 / 1024).toFixed(2) + ' MB',
          quota: (estimate.quota / 1024 / 1024).toFixed(2) + ' MB'
        };
      });
    }
    return { usage: 'N/A', quota: 'N/A' };
  }

  // Exportar notícias para backup
  async exportNews() {
    const allNews = await this.getAllNews(1000); // Exportar até 1000 notícias
    return JSON.stringify(allNews, null, 2);
  }

  // Importar notícias de backup
  async importNews(jsonData) {
    try {
      const news = JSON.parse(jsonData);
      if (Array.isArray(news)) {
        const results = await this.addMultipleNews(news);
        return { success: true, imported: results.length };
      }
      return { success: false, error: 'Formato inválido' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Exportar instância única
const newsDB = new NewsDatabase();
export default newsDB;