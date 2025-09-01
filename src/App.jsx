import React, { useState, useEffect } from 'react';
import useScrollSpy from './hooks/useScrollSpy';
import { 
  MapPin, Calendar, DollarSign, Clock, Users, FileText, 
  Download, ExternalLink, CheckCircle, Circle, MessageSquare,
  Waves, Shield, Leaf, TrendingUp, Building,
  Info, ChevronDown, Menu, X, Send, Bot, Search
} from 'lucide-react';
import './App.css';

// Importar componentes
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import FAQ from './components/FAQ';
import News from './components/News';

function App() {
  const sections = ['home', 'overview', 'timeline', 'impact', 'faq', 'documents', 'comissao', 'news', 'chatbot'];
  const activeSection = useScrollSpy(sections, 100);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <MapPin className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-900">1,255 km</h3>
                <p className="text-sm font-semibold text-gray-700">Extensão Total</p>
                <p className="text-sm text-gray-600 mt-2">870m de túnel imerso</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <DollarSign className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-900">R$ 5,78 bi</h3>
                <p className="text-sm font-semibold text-gray-700">Investimento</p>
                <p className="text-sm text-gray-600 mt-2">CAPEX total do projeto</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <Calendar className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-900">30 anos</h3>
                <p className="text-sm font-semibold text-gray-700">Concessão</p>
                <p className="text-sm text-gray-600 mt-2">Período de operação</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <Users className="w-8 h-8 text-orange-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-900">8.690</h3>
                <p className="text-sm font-semibold text-gray-700">Empregos</p>
                <p className="text-sm text-gray-600 mt-2">Diretos e indiretos</p>
              </div>
            </div>
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
            
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {[
                  { phase: 'Qualificação no PPI', period: '1º Trimestre 2023', status: 'completed' },
                  { phase: 'Estudos Técnicos', period: '4º Trimestre 2023', status: 'completed' },
                  { phase: 'Audiência Pública', period: '2º Trimestre 2024', status: 'completed' },
                  { phase: 'Publicação do Edital', period: '1º Trimestre 2025', status: 'completed' },
                  { phase: 'Leilão', period: '28 de Julho de 2025', status: 'in-progress' },
                  { phase: 'Assinatura do Contrato', period: '4º Trimestre 2025', status: 'pending' },
                ].map((milestone, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`p-3 rounded-full ${
                      milestone.status === 'completed' ? 'bg-green-100' :
                      milestone.status === 'in-progress' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      {milestone.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : milestone.status === 'in-progress' ? (
                        <Clock className="w-6 h-6 text-blue-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-6">
                      <h3 className="text-lg font-semibold text-gray-900">{milestone.phase}</h3>
                      <p className="text-sm text-gray-600">{milestone.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-xl p-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 -m-6 mb-4 rounded-t-xl text-white">
                  <Leaf className="w-8 h-8 mb-2" />
                  <h3 className="text-xl font-bold">Ambiental</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-sm text-gray-700">Redução de CO₂</span>
                    <span className="font-bold">18.500 ton/ano</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm text-gray-700">Redução de CO</span>
                    <span className="font-bold">72 ton/ano</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm text-gray-700">Área compensada</span>
                    <span className="font-bold">2,75 hectares</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-xl p-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 -m-6 mb-4 rounded-t-xl text-white">
                  <Users className="w-8 h-8 mb-2" />
                  <h3 className="text-xl font-bold">Social</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-sm text-gray-700">Empregos diretos</span>
                    <span className="font-bold">5.905</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm text-gray-700">Empregos indiretos</span>
                    <span className="font-bold">2.785</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm text-gray-700">Famílias beneficiadas</span>
                    <span className="font-bold">28.000+</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-xl p-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 -m-6 mb-4 rounded-t-xl text-white">
                  <TrendingUp className="w-8 h-8 mb-2" />
                  <h3 className="text-xl font-bold">Mobilidade</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-sm text-gray-700">Redução tempo</span>
                    <span className="font-bold">95%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm text-gray-700">Operação</span>
                    <span className="font-bold">24h/dia</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm text-gray-700">Capacidade</span>
                    <span className="font-bold">50.000 veíc/dia</span>
                  </li>
                </ul>
              </div>
            </div>
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

        {/* Documentos */}
        <section id="documents" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
              Documentação do Projeto
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Acesse todos os documentos oficiais e estudos técnicos
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Edital de Licitação',
                  description: 'Concorrência Internacional nº 01/2025',
                  icon: <FileText className="w-8 h-8 text-blue-600" />
                },
                {
                  title: 'RIMA',
                  description: 'Relatório de Impacto Ambiental',
                  icon: <FileText className="w-8 h-8 text-green-600" />
                },
                {
                  title: 'Estudos Técnicos',
                  description: 'Viabilidade e engenharia',
                  icon: <FileText className="w-8 h-8 text-purple-600" />
                }
              ].map((doc, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="mb-4">{doc.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{doc.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              ))}
            </div>
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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Card Principal */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-green-600 rounded-lg">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Comissão Externa</h3>
                    <p className="text-sm text-gray-600">Monitorar as Obras do Túnel Santos-Guarujá</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Objetivo</h4>
                    <p className="text-gray-700">
                      Acompanhar e fiscalizar o desenvolvimento das obras do Túnel Imerso Santos-Guarujá, 
                      garantindo transparência e eficiência na execução deste importante projeto de infraestrutura.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Legislatura</h4>
                    <p className="text-gray-700">57ª Legislatura (2023-2027)</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Áreas de Atuação</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        Transporte Urbano
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        Economia
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        Administração Pública
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Cards de Informações */}
              <div className="space-y-6">
                {/* Contato */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    Informações de Contato
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Secretário-Executivo</p>
                      <p className="font-medium text-gray-900">Alessandro Alves de Miranda</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Telefone</p>
                      <p className="font-medium text-gray-900">(61) 3216-6267</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Localização</p>
                      <p className="font-medium text-gray-900">Anexo II, Piso Superior, Sala 165-B</p>
                      <p className="text-sm text-gray-600">Câmara dos Deputados - Brasília/DF</p>
                    </div>
                  </div>
                </div>
                
                {/* Atividades */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    Atividades da Comissão
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Reuniões Realizadas</span>
                      <span className="font-bold text-gray-900">1</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Convidados Ouvidos</span>
                      <span className="font-bold text-gray-900">Em andamento</span>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">Evento Realizado</p>
                      <p className="text-sm text-blue-700">
                        "Impactos e Perspectivas do Projeto do Túnel" - 30/06/2025 em São Paulo
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="mt-12 text-center">
              <a
                href="https://www2.camara.leg.br/atividade-legislativa/comissoes/comissoes-temporarias/externas/57a-legislatura/monitorar-obras-do-tunel-santos-guaruja"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <ExternalLink className="w-5 h-5" />
                Acessar Página Oficial da Comissão
              </a>
            </div>
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

        {/* Assistente Virtual */}
        <section id="chatbot" className="py-20 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
              Assistente Virtual
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Converse com nosso assistente inteligente sobre o projeto
            </p>
            
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header do Chat */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Bot className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Assistente do Túnel Santos-Guarujá</h3>
                    <p className="text-blue-100">Tire suas dúvidas sobre o projeto</p>
                  </div>
                </div>
              </div>
              
              {/* Área de Mensagens */}
              <div className="h-96 overflow-y-auto p-6 bg-gray-50">
                <div className="space-y-4">
                  {/* Mensagem de boas-vindas */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className="bg-white rounded-lg p-4 max-w-[80%] shadow-sm">
                      <p className="text-gray-700">
                        Olá! 👋 Sou o assistente virtual do projeto Túnel Santos-Guarujá. 
                        Como posso ajudá-lo hoje?
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        Você pode me perguntar sobre:
                      </p>
                      <ul className="text-sm text-gray-600 mt-1 ml-4">
                        <li>• Detalhes técnicos do projeto</li>
                        <li>• Cronograma e prazos</li>
                        <li>• Investimentos e custos</li>
                        <li>• Impactos ambientais e sociais</li>
                        <li>• Processo de licitação</li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Sugestões de perguntas */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors">
                      Como funciona o túnel imerso?
                    </button>
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors">
                      Quais os benefícios ambientais?
                    </button>
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors">
                      Qual o prazo de construção?
                    </button>
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors">
                      Como participar da licitação?
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Input de Mensagem */}
              <div className="border-t p-4 bg-white">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Digite sua pergunta aqui..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Enviar
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by OpenAI GPT-4 • Respostas baseadas em documentos oficiais do projeto
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;