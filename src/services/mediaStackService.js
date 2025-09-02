import axios from 'axios';
import { adminLog, adminError } from '../utils/debug.js';

class MediaStackService {
  constructor() {
    this.apiKey = import.meta.env.VITE_MEDIA_STACK_API_KEY;
    // Usar HTTPS em produção, HTTP em desenvolvimento
    const isProduction = window.location.protocol === 'https:';
    this.baseUrl = isProduction ? 'https://api.mediastack.com/v1' : 'http://api.mediastack.com/v1';
    this.cache = new Map();
    this.cacheExpiration = 5 * 60 * 1000; // 5 minutes
    
    adminLog(`MediaStack API URL: ${this.baseUrl}`);
  }

  getCacheKey(params) {
    return JSON.stringify(params);
  }

  isValidCache(timestamp) {
    return Date.now() - timestamp < this.cacheExpiration;
  }

  async fetchNews(searchQuery = null, additionalParams = {}) {
    // MediaStack tem limitações na busca por palavras em português
    // Vamos buscar notícias gerais do Brasil e filtrar localmente
    const params = {
      access_key: this.apiKey,
      countries: 'br',
      languages: 'pt',
      limit: 100, // Buscar mais para compensar a filtragem local
      sort: 'published_desc',
      ...additionalParams
    };
    
    // Se houver query específica, adicionar
    if (searchQuery) {
      params.keywords = searchQuery;
    }

    const cacheKey = this.getCacheKey(params);
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isValidCache(cached.timestamp)) {
      adminLog('Returning cached MediaStack news');
      return cached.data;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/news`, { params });
      
      if (response.data && response.data.data) {
        let articles = this.formatArticles(response.data.data);
        
        // Filtrar localmente por relevância ao projeto
        if (!searchQuery || searchQuery === '') {
          articles = this.filterRelevantNews(articles);
        }
        
        const result = {
          articles,
          totalResults: articles.length,
          source: 'mediastack'
        };
        
        this.cache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });
        
        return result;
      }
      
      return {
        articles: [],
        totalResults: 0,
        source: 'mediastack'
      };
    } catch (error) {
      adminError('MediaStack API error:', error.response?.data || error.message);
      
      // Return cached data if available, even if expired
      if (cached) {
        adminLog('Returning expired cache due to error');
        return cached.data;
      }
      
      throw new Error(`MediaStack API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  formatArticles(articles) {
    return articles.map(article => {
      const formattedArticle = {
        title: article.title || 'Sem título',
        description: article.description || '',
        url: article.url || '#',
        urlToImage: article.image || null,
        publishedAt: article.published_at || new Date().toISOString(),
        source: {
          name: article.source || 'MediaStack'
        },
        author: article.author || null,
        category: article.category || null,
        language: article.language || 'pt',
        country: article.country || 'br'
      };
      
      adminLog(`📰 Artigo formatado - Data: ${formattedArticle.publishedAt}`);
      return formattedArticle;
    });
  }

  filterRelevantNews(articles) {
    return articles.filter(article => {
      const text = `${article.title} ${article.description}`.toLowerCase();
      
      // Palavras-chave relacionadas ao projeto
      const tunnelKeywords = ['túnel', 'tunel', 'travessia', 'ligação', 'submerso', 'imerso'];
      const locationKeywords = ['santos', 'guarujá', 'guaruja', 'porto', 'baixada santista'];
      const infrastructureKeywords = ['obra', 'construção', 'infraestrutura', 'mobilidade', 'transporte'];
      
      const hasTunnel = tunnelKeywords.some(word => text.includes(word));
      const hasLocation = locationKeywords.some(word => text.includes(word));
      const hasInfrastructure = infrastructureKeywords.some(word => text.includes(word));
      
      // Incluir se tiver pelo menos duas condições verdadeiras
      const relevanceCount = [hasTunnel, hasLocation, hasInfrastructure].filter(Boolean).length;
      return relevanceCount >= 2;
    });
  }

  clearCache() {
    this.cache.clear();
  }
}

export default new MediaStackService();