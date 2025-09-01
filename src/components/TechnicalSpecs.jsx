import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, Shield, Zap, Wind, 
  AlertTriangle, Gauge, Waves, Lock 
} from 'lucide-react';

const TechnicalSpecs = () => {
  const [activeTab, setActiveTab] = useState('structure');

  const specs = {
    structure: {
      title: 'Estrutura',
      icon: <Layers />,
      items: [
        { label: 'Extensão total', value: '1.255 metros' },
        { label: 'Túnel imerso', value: '870 metros' },
        { label: 'Largura total', value: '41 metros' },
        { label: 'Altura livre', value: '5,5 metros' },
        { label: 'Profundidade', value: '21 metros (mín)' },
        { label: 'Módulos', value: '6 unidades' },
        { label: 'Células por módulo', value: '3 unidades' },
        { label: 'Material', value: 'Concreto pré-moldado' }
      ]
    },
    capacity: {
      title: 'Capacidade',
      icon: <Gauge />,
      items: [
        { label: 'Faixas de rolamento', value: '6 (3 por sentido)' },
        { label: 'Largura das faixas', value: '3,5 metros' },
        { label: 'Acostamento', value: '0,6 metros' },
        { label: 'Galeria pedestres', value: '5,0 x 3,5 metros' },
        { label: 'Ciclovia', value: 'Integrada' },
        { label: 'Preparação VLT', value: 'Incluída' },
        { label: 'Capacidade diária', value: '50.000 veículos' },
        { label: 'Velocidade máxima', value: '80 km/h' }
      ]
    },
    safety: {
      title: 'Segurança',
      icon: <Shield />,
      items: [
        { label: 'Saídas emergência', value: 'A cada 150m' },
        { label: 'Sistema ventilação', value: 'Longitudinal' },
        { label: 'Detecção incêndio', value: 'Automática' },
        { label: 'Câmeras CFTV', value: 'Cobertura total' },
        { label: 'Iluminação emergência', value: 'LED redundante' },
        { label: 'Comunicação', value: 'Intercomunicadores' },
        { label: 'Brigada incêndio', value: '24h disponível' },
        { label: 'Centro controle', value: 'Operação 24/7' }
      ]
    },
    systems: {
      title: 'Sistemas',
      icon: <Zap />,
      items: [
        { label: 'Alimentação elétrica', value: 'Redundante' },
        { label: 'Gerador emergência', value: 'Backup total' },
        { label: 'Sistema drenagem', value: 'Automático' },
        { label: 'Bombeamento', value: '4 estações' },
        { label: 'Proteção catódica', value: 'Anti-corrosão' },
        { label: 'Monitoramento', value: 'Sensores IoT' },
        { label: 'SCADA', value: 'Integrado' },
        { label: 'Free Flow', value: 'Cobrança automática' }
      ]
    }
  };

  const innovations = [
    {
      icon: <Waves />,
      title: 'Túnel Imerso',
      description: 'Primeiro do Brasil com tecnologia de módulos pré-fabricados afundados'
    },
    {
      icon: <Wind />,
      title: 'Ventilação Inteligente',
      description: 'Sistema adaptativo que ajusta fluxo de ar conforme tráfego e qualidade do ar'
    },
    {
      icon: <Lock />,
      title: 'Juntas Gina',
      description: 'Vedação especial com selos ômega para impermeabilização total'
    },
    {
      icon: <AlertTriangle />,
      title: 'Resiliência Sísmica',
      description: 'Projetado para resistir a eventos sísmicos e movimentações do solo'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Tabs de Especificações */}
      <div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Object.entries(specs).map(([key, spec]) => (
            <motion.button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === key
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {React.cloneElement(spec.icon, { className: 'w-4 h-4' })}
              {spec.title}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specs[activeTab].items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm font-bold text-blue-600">{item.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cards de Inovações */}
      <div>
        <h3 className="text-2xl font-bold text-center mb-6 gradient-text">
          Inovações Tecnológicas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {innovations.map((innovation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-sm mb-4">
                {React.cloneElement(innovation.icon, { className: 'w-6 h-6 text-blue-600' })}
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{innovation.title}</h4>
              <p className="text-sm text-gray-600">{innovation.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Diagrama Visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white"
      >
        <h3 className="text-2xl font-bold mb-6 text-center">Seção Transversal do Túnel</h3>
        <div className="bg-white/10 backdrop-blur rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">3</div>
              <p className="text-sm">Células independentes</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">41m</div>
              <p className="text-sm">Largura total</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">5,5m</div>
              <p className="text-sm">Altura livre</p>
            </div>
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white/30 rounded"></div>
              <span>Faixas de rolamento (3 por sentido)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400/30 rounded"></div>
              <span>Galeria central (pedestres/ciclistas)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400/30 rounded"></div>
              <span>Infraestrutura VLT (futura)</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TechnicalSpecs;