import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, ExternalLink, Clock, TrendingUp, 
  Newspaper, RefreshCw, AlertCircle, Filter
} from 'lucide-react';
import newsService from '../services/newsService';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [filteredCount, setFilteredCount] = useState(0);
  
  // Verificar se está em modo admin
  const [isAdmin, setIsAdmin] = useState(false);

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'geral', label: 'Geral' },
    { id: 'obra', label: 'Obras' },
    { id: 'licitacao', label: 'Licitação' },
    { id: 'governo', label: 'Governo' },
    { id: 'impacto', label: 'Impactos' }
  ];

  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Verificar parâmetros da URL para modo admin
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    const hashAdmin = window.location.hash.includes('admin');
    
    // Aceita ?admin=true ou #admin na URL
    if (adminParam === 'true' || hashAdmin) {
      setIsAdmin(true);
      console.log('Modo admin ativado');
    }
    
    fetchNews();
    fetchStats();
  }, []);

  useEffect(() => {
    // Recarregar notícias quando filtro mudar
    if (filter) {
      fetchNews();
    }
  }, [filter]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Buscar notícias do banco de dados local
      let fetchedNews;
      if (filter === 'all') {
        fetchedNews = await newsService.fetchNews();
      } else {
        fetchedNews = await newsService.fetchNewsByCategory(filter);
      }
      
      setNews(fetchedNews || []);
      setLastUpdate(new Date());
      
      if (!fetchedNews || fetchedNews.length === 0) {
        setError('Nenhuma notícia encontrada. Execute a atualização para buscar novas notícias.');
      }
      
    } catch (err) {
      setError('Erro ao carregar notícias do banco de dados.');
      console.error('Erro ao buscar notícias:', err);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statistics = await newsService.getStats();
      setStats(statistics);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const forceUpdate = async () => {
    setLoading(true);
    try {
      const result = await newsService.forceUpdate();
      if (result.success) {
        alert(`Atualização concluída! ${result.added} novas notícias adicionadas.`);
        await fetchNews();
        await fetchStats();
      } else {
        alert('Erro na atualização. Tente novamente mais tarde.');
      }
    } catch (error) {
      console.error('Erro ao forçar atualização:', error);
      alert('Erro na atualização.');
    } finally {
      setLoading(false);
    }
  };

  const clearAndRefresh = async () => {
    if (!confirm('Isso irá limpar TODAS as notícias e buscar novamente. Continuar?')) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await newsService.clearAndRefresh();
      if (result.success) {
        alert(`Banco limpo e atualizado! ${result.added} notícias adicionadas.`);
        await fetchNews();
        await fetchStats();
      } else {
        alert('Erro ao limpar e atualizar. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao limpar e atualizar:', error);
      alert('Erro ao limpar e atualizar.');
    } finally {
      setLoading(false);
    }
  };

  // Notícias já vêm filtradas do banco
  const filteredNews = news;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    
    return date.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatUpdateTime = () => {
    if (!lastUpdate) return '';
    return lastUpdate.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading && news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Carregando notícias...</p>
      </div>
    );
  }

  if (error && news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Newspaper className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-700 font-medium mb-2">Nenhuma notícia encontrada</p>
        <p className="text-gray-600 text-sm mb-4">Tente buscar novas notícias ou limpar os filtros</p>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              setFilter('all');
              fetchNews();
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Limpar Filtros
          </button>
          <button 
            onClick={forceUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Buscar Novas Notícias
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header com filtros */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Botões de admin - só aparecem em modo admin */}
          {isAdmin ? (
            <div className="flex gap-2">
              <button
                onClick={fetchNews}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Recarregar
              </button>
              <button
                onClick={forceUpdate}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                title="Buscar novas notícias da API"
              >
                <TrendingUp className="w-4 h-4" />
                Buscar Novas
              </button>
              <button
                onClick={clearAndRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                title="Limpar banco e buscar com novos critérios"
              >
                <RefreshCw className="w-4 h-4" />
                Limpar e Atualizar
              </button>
            </div>
          ) : null}
        </div>

        {/* Filtros por categoria */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista horizontal de notícias */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
        {filteredNews.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group flex-shrink-0"
            style={{ width: '350px' }}
          >
            {/* Imagem */}
            <div className="relative h-48 bg-gradient-to-br from-blue-100 to-cyan-100 overflow-hidden">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`absolute inset-0 flex items-center justify-center ${item.imageUrl ? 'hidden' : ''}`}
                style={{ display: item.imageUrl ? 'none' : 'flex' }}
              >
                <Newspaper className="w-16 h-16 text-blue-300" />
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-medium text-gray-700 rounded-full">
                  {categories.find(c => c.id === item.category)?.label || 'Notícia'}
                </span>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(item.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.readTime}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {item.summary}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  {item.source}
                </span>
                {item.url && item.url !== '#' ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Ler mais
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">Link indisponível</span>
                )}
              </div>
            </div>
          </motion.article>
        ))}
        </div>
      </div>

      {/* Rodapé com estatísticas */}
      {stats && (
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            {stats.totalNews} notícias • Última atualização: {stats.lastUpdate}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Atualização automática diária às 22h
          </p>
        </div>
      )}

      {/* Mensagem quando não há notícias */}
      {filteredNews.length === 0 && !loading && (
        <div className="text-center py-12">
          <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Nenhuma notícia encontrada para esta categoria.</p>
          <button 
            onClick={() => {
              setFilter('all');
              fetchNews();
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Ver Todas as Notícias
          </button>
        </div>
      )}
    </div>
  );
};

export default News;