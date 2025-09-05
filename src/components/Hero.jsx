import React from 'react';
import { ArrowDown, Waves, Ruler, DollarSign, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-600">
      {/* Background Image with Blend Mode */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: `url('/background-tunel-santos-guaruja.png')`,
          mixBlendMode: 'multiply',
          filter: 'brightness(1.2) contrast(1.1) saturate(0.8)'
        }}
      ></div>
      
      {/* Additional Color Overlay for Better Integration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-blue-700/40 to-cyan-600/50"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='white' stroke-width='1' stroke-opacity='0.2'%3E%3Cpath d='M36 34v-4l-2-2-4-4-4 4-2 2v4l2 2 4 4 4-4 2-2z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
          Túnel Imerso
          <span className="block text-cyan-300 mt-2">Santos-Guarujá</span>
        </h1>
        <p className="text-xl sm:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
          Conectando cidades, transformando vidas. A maior obra de infraestrutura 
          em mobilidade urbana da Baixada Santista.
        </p>
        
        <div className="flex gap-3 md:gap-4 justify-center mb-12 max-w-2xl mx-auto">
          <button 
            onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-4 md:px-8 py-3 md:py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm md:text-base"
          >
            Explorar o Projeto
          </button>
          <button 
            onClick={() => document.getElementById('documents')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-4 md:px-8 py-3 md:py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-sm md:text-base"
          >
            Documentação
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-3 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
            <Ruler className="text-cyan-300" size={20} />
            <div className="text-center sm:text-left sm:flex-1">
              <h3 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">1,255 km</h3>
              <p className="text-xs sm:text-base text-blue-100">Extensão total</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-3 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
            <DollarSign className="text-cyan-300" size={20} />
            <div className="text-center sm:text-left sm:flex-1">
              <h3 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">R$ 5,78 bi</h3>
              <p className="text-xs sm:text-base text-blue-100">Investimento</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-3 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 col-span-2 sm:col-span-1">
            <Users className="text-cyan-300" size={20} />
            <div className="text-center sm:text-left sm:flex-1">
              <h3 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">8.690</h3>
              <p className="text-xs sm:text-base text-blue-100">Empregos gerados</p>
            </div>
          </div>
        </div>

        {/* IBI Observatório Sponsorship */}
        <div className="mt-12 text-xs sm:text-lg text-blue-100">
          <div className="flex flex-col sm:flex-row items-center justify-center text-center">
            <span className="block sm:inline">Um produto do</span>
            <a 
              href="https://ibi-observatorio.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-white hover:text-cyan-300 transition-colors sm:ml-1"
            >
              <img 
                src="/logo-ibi-observatorio.png" 
                alt="IBI Observatório" 
                className="h-4 sm:h-6 w-auto brightness-0 invert mt-1 sm:mt-0 sm:ml-2"
              />
              <span className="text-xs sm:text-lg mt-1 sm:mt-0">Observatório de Dados do Instituto Brasileiro de Infraestrutura</span>
            </a>
          </div>
        </div>
      </div>

      {/* Seta posicionada fora da área de conteúdo */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <ArrowDown size={32} className="text-white opacity-60 animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;