import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { 
  Car, Clock, Calendar, Percent, 
  Building, Waves, Shield, TrendingUp,
  Package, Grid3x3, Ruler, ArrowUpDown,
  Route, Bike, Users, Train,
  Zap, DollarSign, Clock3, UserCheck
} from 'lucide-react';

const ProjectOverview = () => {
  const { ref, inView } = useInView({ triggerOnce: true });

  const stats = [
    {
      icon: <Car className="w-8 h-8 text-blue-600" />,
      value: 6,
      suffix: ' faixas',
      label: 'Capacidade viária',
      description: 'Mais ciclovia e pedestres'
    },
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      value: 3,
      suffix: ' min',
      label: 'Travessia',
      description: 'Santos-Guarujá'
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      value: 30,
      suffix: ' anos',
      label: 'Concessão',
      description: 'Período de operação'
    },
    {
      icon: <Percent className="w-8 h-8 text-orange-600" />,
      value: 870,
      suffix: 'm',
      label: 'Túnel imerso',
      description: 'Trecho subaquático'
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
                        decimals={0}
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
            <div className="text-sm space-y-2 text-blue-100">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 flex-shrink-0" />
                <span>6 módulos de concreto</span>
              </div>
              <div className="flex items-center gap-2">
                <Grid3x3 className="w-4 h-4 flex-shrink-0" />
                <span>3 células por módulo</span>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 flex-shrink-0" />
                <span>41 metros de largura</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 flex-shrink-0" />
                <span>5,5 metros de altura livre</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Capacidade</h4>
            <div className="text-sm space-y-2 text-blue-100">
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4 flex-shrink-0" />
                <span>6 faixas de rolamento</span>
              </div>
              <div className="flex items-center gap-2">
                <Bike className="w-4 h-4 flex-shrink-0" />
                <span>Ciclovia dedicada</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>Passagem de pedestres</span>
              </div>
              <div className="flex items-center gap-2">
                <Train className="w-4 h-4 flex-shrink-0" />
                <span>Preparado para VLT</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Operação</h4>
            <div className="text-sm space-y-2 text-blue-100">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 flex-shrink-0" />
                <span>Sistema Free Flow</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 flex-shrink-0" />
                <span>Tarifa: R$ 6,05</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="w-4 h-4 flex-shrink-0" />
                <span>Operação 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 flex-shrink-0" />
                <span>Isenção para pedestres/ciclistas</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectOverview;