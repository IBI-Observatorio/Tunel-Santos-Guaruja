import React, { useState, useEffect } from 'react';
import useScrollSpy from './hooks/useScrollSpy';
import './App.css';

// Importar componentes
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import FAQ from './components/FAQ';
import News from './components/News';
import ProjectOverview from './components/ProjectOverview';
import Timeline from './components/Timeline';
import ImpactCards from './components/ImpactCards';
import DocumentsSection from './components/DocumentsSection';
import Chatbot from './components/Chatbot';
import ComissaoExterna from './components/ComissaoExterna';

function App() {
  const sections = ['home', 'overview', 'timeline', 'impact', 'documents', 'comissao', 'news', 'faq', 'chatbot'];
  const activeSection = useScrollSpy(sections, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Navigation activeSection={activeSection} setActiveSection={(section) => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }} />
      
      <main>
        <section id="home">
          <Hero />
        </section>
        
        {/* Seção de Visão Geral Simplificada */}
        <section id="overview" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
              Visão Geral do Projeto
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Uma obra de engenharia inovadora que transformará a mobilidade urbana na Baixada Santista
            </p>
            
            <ProjectOverview />
          </div>
        </section>

        {/* Timeline Simplificada */}
        <section id="timeline" className="py-20 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
              Cronograma do Projeto
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Acompanhe as principais etapas e marcos do empreendimento
            </p>
            
            <Timeline />
          </div>
        </section>

        {/* Impactos e Benefícios */}
        <section id="impact" className="py-20 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
              Impactos e Benefícios
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Transformando a região com sustentabilidade e inovação
            </p>
            
            <ImpactCards />
          </div>
        </section>

        {/* Documentos */}
        <section id="documents" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
              Documentação do Projeto
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Acesse todos os documentos oficiais e estudos técnicos
            </p>
            
            <DocumentsSection />
          </div>
        </section>

        {/* Comissão Externa da Câmara dos Deputados */}
        <section id="comissao" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
              Comissão Externa da Câmara dos Deputados
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Acompanhamento e fiscalização das obras do Túnel Santos-Guarujá pelo Poder Legislativo Federal
            </p>
            
            <ComissaoExterna />
          </div>
        </section>

        {/* Seção de Notícias */}
        <section id="news" className="py-20 bg-gradient-to-r from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
              Notícias e Atualizações
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Acompanhe as últimas notícias e desenvolvimentos sobre o projeto do Túnel Santos-Guarujá
            </p>
            
            <News />
          </div>
        </section>

        {/* FAQ Completo */}
        <section id="faq" className="py-20 bg-white/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
              Perguntas Frequentes
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Tire suas dúvidas sobre o projeto
            </p>
            
            <FAQ />
          </div>
        </section>

        {/* Assistente Virtual */}
        <section id="chatbot" className="py-20 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
              Assistente Virtual
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Converse com nosso assistente inteligente sobre o projeto
            </p>
            
            <Chatbot />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;