import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class NewsUpdater {
  constructor() {
    this.mediaStackApiKey = process.env.VITE_MEDIA_STACK_API_KEY;
    this.isUpdating = false;
  }

  async updateNews() {
    if (this.isUpdating) {
      console.log('⚠️ Atualização já em andamento, pulando...');
      return { success: false, message: 'Update already in progress' };
    }

    this.isUpdating = true;
    const startTime = Date.now();
    
    try {
      console.log('🔄 Iniciando busca de notícias da MediaStack...');
      
      // Buscar notícias da MediaStack
      const params = {
        access_key: this.mediaStackApiKey,
        keywords: 'tunel santos',
        countries: 'br',
        languages: 'pt',
        limit: 100,
        sort: 'published_desc'
      };

      const response = await axios.get('http://api.mediastack.com/v1/news', { params });
      
      if (response.data && response.data.data) {
        const articles = response.data.data;
        console.log(`✅ ${articles.length} notícias encontradas na MediaStack`);
        
        // Filtrar notícias relevantes
        const relevantNews = this.filterRelevantNews(articles);
        console.log(`📊 ${relevantNews.length} notícias relevantes após filtragem`);
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        return {
          success: true,
          totalFound: articles.length,
          relevantCount: relevantNews.length,
          duration: `${duration}s`,
          timestamp: new Date().toISOString()
        };
      }
      
      return {
        success: false,
        message: 'Nenhuma notícia encontrada',
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Erro ao atualizar notícias:', error.message);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    } finally {
      this.isUpdating = false;
    }
  }

  filterRelevantNews(articles) {
    return articles.filter(article => {
      const text = `${article.title} ${article.description || ''}`.toLowerCase();
      
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
}

export default new NewsUpdater();