import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { 
  MapPin, DollarSign, Calendar, Users, 
  Building, Waves, Shield, TrendingUp 
} from 'lucide-react';

const ProjectOverview = () => {
  const { ref, inView } = useInView({ triggerOnce: true });

  const stats = [
    {
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      value: 1255,
      suffix: 'm',
      label: 'Extensão Total',
      description: '870m de túnel imerso'
    },
    {
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      value: 5.78,
      prefix: 'R$ ',
      suffix: ' bi',
      label: 'Investimento',
      description: 'CAPEX total do projeto'
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      value: 30,
      suffix: ' anos',
      label: 'Concessão',
      description: 'Período de operação'
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      value: 8690,
      label: 'Empregos',
      description: 'Diretos e indiretos'
    }
  ];

  const features = [
    {
      icon: <Building className="w-6 h-6" />,
      title: 'Tecnologia Inovadora',
      description: 'Primeiro túnel imerso do Brasil com módulos pré-fabricados'
    },
    {
      icon: <Waves className="w-6 h-6" />,
      title: 'Sustentabilidade',
      description: 'Redução de 18.500 ton/ano de CO₂'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Segurança',
      description: 'Centro de controle 24h e saídas de emergência a cada 150m'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Desenvolvimento',
      description: 'Integração urbana e valorização imobiliária regional'
    }
  ];

  return (
    <div ref={ref}>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              {stat.icon}
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {inView && (
                    <>
                      {stat.prefix}
                      <CountUp
                        end={stat.value}
                        duration={2}
                        decimals={stat.value < 100 ? 2 : 0}
                      />
                      {stat.suffix}
                    </>
                  )}
                </div>
                <div className="text-sm font-semibold text-gray-700">{stat.label}</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{stat.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 p-3 bg-white rounded-lg shadow-sm">
                {React.cloneElement(feature.icon, { className: 'w-6 h-6 text-blue-600' })}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Project Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.8 }}
        className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white"
      >
        <h3 className="text-2xl font-bold mb-4">Estrutura do Túnel</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Composição</h4>
            <ul className="text-sm space-y-1 text-blue-100">
              <li>• 6 módulos de concreto</li>
              <li>• 3 células por módulo</li>
              <li>• 41 metros de largura</li>
              <li>• 5,5 metros de altura livre</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Capacidade</h4>
            <ul className="text-sm space-y-1 text-blue-100">
              <li>• 6 faixas de rolamento</li>
              <li>• Ciclovia dedicada</li>
              <li>• Passagem de pedestres</li>
              <li>• Preparado para VLT</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Operação</h4>
            <ul className="text-sm space-y-1 text-blue-100">
              <li>• Sistema Free Flow</li>
              <li>• Tarifa: R$ 6,05</li>
              <li>• Operação 24h</li>
              <li>• Isenção para pedestres/ciclistas</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectOverview;