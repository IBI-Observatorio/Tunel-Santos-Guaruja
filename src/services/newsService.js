// Serviço para buscar notícias sobre o Túnel Santos-Guarujá
import newsDB from './database.js';

class NewsService {
  constructor() {
    this.searchTerms = [
      '"Túnel Santos-Guarujá"',
      '"Túnel Imerso Santos-Guarujá"'
    ];
    this.lastUpdateKey = 'lastNewsUpdate';
    
    // Inicializar banco de dados
    this.initDatabase();
  }

  async initDatabase() {
    try {
      await newsDB.init();
      console.log('Banco de dados de notícias inicializado');
      
      // Verificar se precisa atualizar
      this.checkForDailyUpdate();
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
    }
  }

  // Buscar notícias do banco de dados local
  async fetchNews() {
    try {
      // Buscar notícias do banco de dados local
      const news = await newsDB.getAllNews(50);
      return news;
    } catch (error) {
      console.error('Erro ao buscar notícias do banco:', error);
      return [];
    }
  }

  // Buscar notícias por categoria
  async fetchNewsByCategory(category) {
    try {
      if (category === 'all') {
        return await newsDB.getAllNews(50);
      }
      return await newsDB.getNewsByCategory(category, 50);
    } catch (error) {
      console.error('Erro ao buscar notícias por categoria:', error);
      return [];
    }
  }

  // Verificar e executar atualização diária
  async checkForDailyUpdate() {
    const lastUpdate = localStorage.getItem(this.lastUpdateKey);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Se não foi atualizado hoje ou nunca foi atualizado
    if (!lastUpdate || lastUpdate !== today) {
      // Executar atualização às 22h ou imediatamente se passou do horário
      const updateHour = 22; // 22h (10 PM)
      const currentHour = now.getHours();
      
      if (currentHour >= updateHour || !lastUpdate) {
        console.log('Executando atualização diária de notícias...');
        await this.performDailyUpdate();
      } else {
        // Agendar para 22h
        const msUntilUpdate = ((updateHour - currentHour) * 60 * 60 * 1000);
        console.log(`Atualização agendada para ${updateHour}h`);
        setTimeout(() => this.performDailyUpdate(), msUntilUpdate);
      }
    }
  }

  // Executar atualização diária
  async performDailyUpdate() {
    try {
      console.log('Iniciando atualização de notícias...');
      
      // Buscar notícias de todas as fontes
      const allNews = await this.fetchFromMultipleSources();
      
      // Processar e adicionar ao banco
      let addedCount = 0;
      console.log(`Total de notícias para processar: ${allNews.length}`);
      
      for (const news of allNews) {
        // Validação adicional antes de salvar
        const text = (news.title + ' ' + (news.summary || '')).toLowerCase();
        
        // Filtro positivo: deve conter "túnel" E "santos-guarujá"
        const hasTunnel = text.includes('túnel') || text.includes('tunel');
        const hasSantosGuaruja = (text.includes('santos') && text.includes('guarujá')) || 
                                 text.includes('santos-guarujá') || 
                                 text.includes('santos guarujá');
        
        // Só adicionar se tiver as duas palavras-chave
        if (hasTunnel && hasSantosGuaruja) {
          const exists = await newsDB.newsExists(news.url);
          if (!exists) {
            // Adicionar categoria antes de salvar
            const newsWithCategory = {
              ...news,
              category: this.categorizeNews(news),
              readTime: this.estimateReadTime(news.summary || '')
            };
            await newsDB.addNews(newsWithCategory);
            addedCount++;
            console.log('✅ Notícia adicionada com categoria:', newsWithCategory.category, '-', news.title);
          } else {
            console.log('⚠️ Notícia já existe no banco:', news.title);
          }
        } else {
          console.log('❌ Notícia rejeitada - Faltam palavras-chave:', {
            title: news.title.substring(0, 80),
            hasTunnel,
            hasSantosGuaruja
          });
        }
      }
      
      console.log(`🎉 Resultado final: ${addedCount} novas notícias adicionadas de ${allNews.length} processadas`);
      
      // Limpar notícias antigas (manter últimos 30 dias)
      await newsDB.cleanOldNews(30);
      
      // Atualizar timestamp da última atualização com data e hora completa
      const now = new Date().toISOString();
      localStorage.setItem(this.lastUpdateKey, now);
      
      // Agendar próxima atualização para amanhã às 22h
      setTimeout(() => this.performDailyUpdate(), 24 * 60 * 60 * 1000);
      
      return { success: true, added: addedCount };
    } catch (error) {
      console.error('Erro na atualização diária:', error);
      // Tentar novamente em 1 hora
      setTimeout(() => this.performDailyUpdate(), 60 * 60 * 1000);
      return { success: false, error: error.message };
    }
  }

  // Buscar de múltiplas fontes
  async fetchFromMultipleSources() {
    const sources = [
      this.fetchFromNewsAPI(),      // NewsAPI.org
      this.fetchFromLocalNews(),
      this.fetchFromGovernmentSources(),
      this.fetchFromRSSFeeds()
    ];

    const results = await Promise.allSettled(sources);
    
    // Combinar resultados de todas as fontes
    const allNews = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        console.log(`Fonte ${index + 1}: ${result.value.length} notícias`);
        allNews.push(...result.value);
      } else if (result.status === 'rejected') {
        console.error(`Fonte ${index + 1} falhou:`, result.reason);
      }
    });

    return allNews;
  }

  // Integração com NewsAPI.org (isolada)
  async fetchFromNewsAPI() {
    try {
      const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
      
      if (!API_KEY) {
        console.warn('NewsAPI key não encontrada');
        return [];
      }

      // Buscar notícias usando searchTerms
      const query = encodeURIComponent(this.searchTerms.join(' OR '));
      const response = await fetch(
        `https://newsapi.org/v2/everything?` +
        `q=${query}&` +
        `language=pt&` +
        `sortBy=publishedAt&` +
        `pageSize=20&` +
        `apiKey=${API_KEY}`
      );

      if (!response.ok) {
        console.error('Erro na API:', response.status);
        return [];
      }

      const data = await response.json();
      
      if (data.status === 'ok' && data.articles) {
        // Transformar dados da API para nosso formato
        return data.articles.map(article => {
          const newsItem = {
            title: article.title,
            source: article.source.name,
            date: article.publishedAt.split('T')[0],
            summary: article.description || article.content?.substring(0, 200),
            url: article.url,
            imageUrl: article.urlToImage
          };
          // Adicionar categoria
          newsItem.category = this.categorizeNews(newsItem);
          newsItem.readTime = this.estimateReadTime(newsItem.summary || '');
          return newsItem;
        });
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      return [];
    }
  }

  // Buscar de fontes de notícias locais
  async fetchFromLocalNews() {
    // Integração com APIs de jornais locais
    // - A Tribuna
    // - Diário do Litoral
    // - G1 Santos
    return [];
  }

  // Buscar de fontes governamentais
  async fetchFromGovernmentSources() {
    // Integração com sites governamentais
    // - Secretaria de Parcerias em Investimentos SP
    // - Governo do Estado de SP
    // - Prefeitura de Santos
    // - Prefeitura de Guarujá
    return [];
  }

  // Buscar de RSS feeds
  async fetchFromRSSFeeds() {
    // Lista de RSS feeds relevantes
    const rssFeeds = [
      'https://www.saopaulo.sp.gov.br/feed/',
      // Adicionar mais feeds aqui
    ];

    // Parse RSS feeds
    // Em produção, você usaria uma biblioteca como rss-parser
    return [];
  }

  // Processar e filtrar notícias
  processNews(news) {
    // Remover duplicatas
    const uniqueNews = this.removeDuplicates(news);
    
    // Filtrar por relevância
    const relevantNews = this.filterByRelevance(uniqueNews);
    
    // Ordenar por data
    const sortedNews = this.sortByDate(relevantNews);
    
    // Adicionar metadados
    const enrichedNews = this.enrichNews(sortedNews);
    
    return enrichedNews;
  }

  // Remover notícias duplicadas
  removeDuplicates(news) {
    const seen = new Set();
    return news.filter(item => {
      const key = item.title.toLowerCase().replace(/\s+/g, '');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Filtrar por relevância - mais flexível mas ainda relevante
  filterByRelevance(news) {
    return news.filter(item => {
      const text = (item.title + ' ' + item.summary).toLowerCase();
      
      // PALAVRAS BLOQUEADAS - conteúdo político irrelevante (reduzidas)
      const blockedWords = ['lula', 'stf', 'trump', 'bolsonaro', 'eleição', 'eleições',
                           'futebol', 'flamengo', 'corinthians', 'palmeiras',
                           'bbb', 'reality', 'fofoca', 'celebridade'];
      
      // Verificar se contém palavras bloqueadas
      const hasBlockedWords = blockedWords.some(word => text.includes(word));
      if (hasBlockedWords) {
        console.log('Notícia bloqueada por conteúdo irrelevante:', item.title);
        return false;
      }
      
      // Palavras relacionadas ao túnel e infraestrutura
      const tunnelWords = ['túnel', 'tunel', 'submerso', 'imerso', 'travessia', 'ligação'];
      const locationWords = ['santos', 'guarujá', 'guaruja', 'baixada santista', 'porto'];
      const infrastructureWords = ['obra', 'construção', 'infraestrutura', 'projeto', 
                                   'investimento', 'mobilidade', 'transporte', 'ppp', 
                                   'concessão', 'licitação', 'desenvolvimento', 'urbano'];
      
      const hasTunnel = tunnelWords.some(word => text.includes(word));
      const hasLocation = locationWords.some(word => text.includes(word));
      const hasInfrastructure = infrastructureWords.some(word => text.includes(word));
      
      // Aceita se:
      // 1. Tem túnel + localização
      // 2. Tem localização + infraestrutura (pode ser sobre o projeto mesmo sem mencionar túnel)
      const isRelevant = (hasTunnel && hasLocation) || (hasLocation && hasInfrastructure);
      
      if (!isRelevant) {
        console.log('Notícia não relevante:', item.title);
      }
      
      return isRelevant;
    });
  }

  // Ordenar por data
  sortByDate(news) {
    return news.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
  }

  // Enriquecer notícias com metadados
  enrichNews(news) {
    return news.map(item => ({
      ...item,
      id: this.generateId(item),
      category: this.categorizeNews(item),
      readTime: this.estimateReadTime(item.summary),
      relevanceScore: this.calculateRelevance(item)
    }));
  }

  // Categorizar notícia
  categorizeNews(item) {
    const text = (item.title + ' ' + item.summary).toLowerCase();
    
    if (text.includes('licitação') || text.includes('leilão') || text.includes('edital') || text.includes('concorrência') || text.includes('contrato')) {
      return 'licitacao';
    }
    if (text.includes('obra') || text.includes('construção') || text.includes('engenharia') || text.includes('imerso') || text.includes('canteiro') || text.includes('escavação')) {
      return 'obra';
    }
    if (text.includes('governo') || text.includes('secretaria') || text.includes('ministério') || text.includes('estado') || text.includes('prefeitura') || text.includes('federal')) {
      return 'governo';
    }
    if (text.includes('impacto') || text.includes('benefício') || text.includes('emprego') || text.includes('economia') || text.includes('mobilidade') || text.includes('trânsito') || text.includes('tráfego')) {
      return 'impacto';
    }
    
    return 'geral';
  }

  // Estimar tempo de leitura
  estimateReadTime(text) {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min`;
  }

  // Calcular relevância
  calculateRelevance(item) {
    let score = 0;
    const text = (item.title + ' ' + item.summary).toLowerCase();
    
    this.searchTerms.forEach(term => {
      if (text.includes(term.toLowerCase())) {
        score += 10;
      }
    });
    
    // Bonus para notícias recentes
    const daysSincePublished = Math.floor(
      (new Date() - new Date(item.date)) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSincePublished === 0) score += 20;
    else if (daysSincePublished <= 3) score += 10;
    else if (daysSincePublished <= 7) score += 5;
    
    return score;
  }

  // Gerar ID único
  generateId(item) {
    return btoa(item.title + item.date).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
  }



  // Forçar atualização manual (para testes ou emergências)
  async forceUpdate() {
    console.log('Forçando atualização de notícias...');
    return await this.performDailyUpdate();
  }

  // Limpar banco e buscar notícias novas
  async clearAndRefresh() {
    try {
      console.log('Limpando banco de dados...');
      await newsDB.clearAllNews();
      
      console.log('Buscando notícias com novos critérios...');
      const result = await this.performDailyUpdate();
      
      return result;
    } catch (error) {
      console.error('Erro ao limpar e atualizar:', error);
      return { success: false, error: error.message };
    }
  }

  // Obter estatísticas do banco
  async getStats() {
    return await newsDB.getStats();
  }

}

// Exportar instância única
const newsService = new NewsService();
export default newsService;