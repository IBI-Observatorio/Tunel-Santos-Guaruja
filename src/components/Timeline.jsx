import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const Timeline = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      setTimeout(() => {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
      }, 300);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
    
    const { scrollLeft: currentScrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(currentScrollLeft > 0);
    setCanScrollRight(currentScrollLeft + clientWidth < scrollWidth);
  };

  const milestones = [
    {
      phase: 'Qualificação no PPI',
      period: '1º Trimestre 2023',
      status: 'completed',
      description: 'Inclusão no Programa de Parcerias de Investimentos'
    },
    {
      phase: 'Estudos Técnicos',
      period: '4º Trimestre 2023',
      status: 'completed',
      description: 'Elaboração de estudos de viabilidade e impacto ambiental'
    },
    {
      phase: 'Audiência Pública',
      period: '2º Trimestre 2024',
      status: 'completed',
      description: 'Consulta pública e recebimento de contribuições'
    },
    {
      phase: 'Publicação do Edital',
      period: '1º Trimestre 2025',
      status: 'completed',
      description: 'Lançamento oficial do edital de licitação'
    },
    {
      phase: 'Leilão',
      period: '5 de Setembro de 2025',
      status: 'in-progress',
      description: 'Sessão pública para recebimento de propostas'
    },
    {
      phase: 'Assinatura do Contrato',
      period: '4º Trimestre 2025',
      status: 'pending',
      description: 'Formalização da concessão com o vencedor'
    },
    {
      phase: 'Licença de Instalação',
      period: 'Ano 1 da Concessão',
      status: 'pending',
      description: 'Obtenção das licenças ambientais necessárias'
    },
    {
      phase: 'Início das Obras',
      period: 'Ano 2 da Concessão',
      status: 'pending',
      description: 'Mobilização e início da construção'
    },
    {
      phase: 'Conclusão das Obras',
      period: 'Ano 5 da Concessão',
      status: 'pending',
      description: 'Finalização da construção do túnel'
    },
    {
      phase: 'Início da Operação',
      period: 'Ano 6 da Concessão',
      status: 'pending',
      description: 'Abertura ao tráfego e início da cobrança'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-6 h-6 text-blue-500 animate-pulse" />;
      default:
        return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-500';
      case 'in-progress':
        return 'bg-blue-100 border-blue-500';
      default:
        return 'bg-gray-100 border-gray-400';
    }
  };

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Horizontal Timeline Container */}
      <div 
        ref={scrollRef}
        className="overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onScroll={(e) => {
          const { scrollLeft, scrollWidth, clientWidth } = e.target;
          setCanScrollLeft(scrollLeft > 0);
          setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
        }}
      >
        <div className={`inline-flex ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
          {/* Milestones */}
          <div className="relative flex gap-8 px-8">
            {/* Timeline Line - spans from first to last milestone center */}
            {milestones.length > 1 && (
              <div className="absolute top-6 h-0.5 bg-gray-300" 
                   style={{ 
                     left: 'calc(2rem + 6rem)',  // px-8 + half of w-48
                     right: 'calc(2rem + 6rem)'  // same on the right
                   }}></div>
            )}
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center w-48"
              >
                {/* Icon */}
                <div className="p-3 bg-white rounded-full shadow-lg z-10 mb-4">
                  {getStatusIcon(milestone.status)}
                </div>
                
                {/* Content */}
                <div className={`w-full p-4 rounded-lg border-2 ${getStatusColor(milestone.status)} transition-all hover:shadow-lg`}>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {milestone.phase}
                  </h3>
                  <span className="text-xs font-medium text-gray-600 block mb-2">
                    {milestone.period}
                  </span>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {milestone.description}
                  </p>
                  {milestone.status === 'in-progress' && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                        Em andamento
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
        className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Resumo do Progresso</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">4</div>
            <div className="text-sm text-gray-600">Etapas Concluídas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">1</div>
            <div className="text-sm text-gray-600">Em Andamento</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">5</div>
            <div className="text-sm text-gray-600">Etapas Futuras</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">45% do cronograma pré-obras concluído</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Timeline;