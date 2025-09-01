import React from 'react';
import { ArrowDown, Waves } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-600">
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
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button 
            onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Explorar o Projeto
          </button>
          <button 
            onClick={() => document.getElementById('documents')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Documentação
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-6">
            <h3 className="text-3xl font-bold mb-2">1,255 km</h3>
            <p className="text-blue-100">Extensão total</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-6">
            <h3 className="text-3xl font-bold mb-2">R$ 5,78 bi</h3>
            <p className="text-blue-100">Investimento</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-6">
            <h3 className="text-3xl font-bold mb-2">8.690</h3>
            <p className="text-blue-100">Empregos gerados</p>
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