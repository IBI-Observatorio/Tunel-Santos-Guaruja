import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { 
  Leaf, Users, TrendingDown, Building2, 
  Car, Trees, Briefcase, Heart 
} from 'lucide-react';

const ImpactCards = () => {
  const { ref, inView } = useInView({ triggerOnce: true });

  const impacts = [
    {
      category: 'Ambiental',
      icon: <Leaf className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-600',
      items: [
        { label: 'Redução de CO₂', value: 18500, suffix: ' ton/ano', icon: <TrendingDown /> },
        { label: 'Redução de CO', value: 72, suffix: ' ton/ano', icon: <TrendingDown /> },
        { label: 'Área compensada', value: 2.75, suffix: ' hectares', icon: <Trees /> },
        { label: 'Programa Carbono Neutro', value: 'Ativo', icon: <Leaf /> }
      ]
    },
    {
      category: 'Social',
      icon: <Users className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-600',
      items: [
        { label: 'Empregos diretos', value: 5905, icon: <Briefcase /> },
        { label: 'Empregos indiretos', value: 2785, icon: <Briefcase /> },
        { label: 'Famílias beneficiadas', value: 28000, suffix: '+', icon: <Heart /> },
        { label: 'Integração urbana', value: '2 cidades', icon: <Building2 /> }
      ]
    },
    {
      category: 'Mobilidade',
      icon: <Car className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-600',
      items: [
        { label: 'Redução tempo travessia', value: 95, suffix: '%', icon: <TrendingDown /> },
        { label: 'Operação', value: '24h/dia', icon: <Car /> },
        { label: 'Capacidade diária', value: 50000, suffix: ' veículos', icon: <Car /> },
        { label: 'Ciclovia/Pedestre', value: 'Incluída', icon: <Users /> }
      ]
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {impacts.map((impact, index) => (
        <motion.div
          key={impact.category}
          variants={cardVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ delay: index * 0.2, duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
        >
          <div className={`bg-gradient-to-r ${impact.color} p-6 text-white`}>
            <div className="flex items-center justify-between mb-2">
              {impact.icon}
              <h3 className="text-xl font-bold">{impact.category}</h3>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {impact.items.map((item, itemIndex) => (
              <motion.div
                key={itemIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.2 + itemIndex * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-400">
                    {React.cloneElement(item.icon, { className: 'w-5 h-5' })}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
                <div className="text-right">
                  {typeof item.value === 'number' ? (
                    <span className="text-lg font-bold text-gray-900">
                      {inView && (
                        <>
                          <CountUp end={item.value} duration={2} separator="." />
                          {item.suffix}
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">{item.value}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ImpactCards;