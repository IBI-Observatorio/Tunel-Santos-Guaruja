import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock } from 'lucide-react';

const Timeline = () => {
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
      period: '28 de Julho de 2025',
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
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

      {/* Milestones */}
      <div className="space-y-8">
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative flex items-start"
          >
            {/* Icon */}
            <div className="absolute left-0 p-3 bg-white rounded-full shadow-lg z-10">
              {getStatusIcon(milestone.status)}
            </div>

            {/* Content */}
            <div className={`ml-20 p-6 rounded-lg border-2 ${getStatusColor(milestone.status)} transition-all hover:shadow-lg`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {milestone.phase}
                </h3>
                <span className="text-sm font-medium text-gray-600 mt-1 sm:mt-0">
                  {milestone.period}
                </span>
              </div>
              <p className="text-gray-600">
                {milestone.description}
              </p>
              {milestone.status === 'in-progress' && (
                <div className="mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                    Em andamento
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
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