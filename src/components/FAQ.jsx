import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Info, Plus, Eye } from 'lucide-react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(8);

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'general', label: 'Geral' },
    { id: 'technical', label: 'Técnico' },
    { id: 'financial', label: 'Financeiro' },
    { id: 'environmental', label: 'Ambiental' },
    { id: 'social', label: 'Social' }
  ];

  const faqs = [
    {
      category: 'general',
      question: 'O que é o Túnel Imerso Santos-Guarujá?',
      answer: 'É um projeto inovador de Parceria Público-Privada (PPP) para construção de um túnel submerso de 1,255 km que conectará Santos e Guarujá sob o canal do Porto de Santos. Será o primeiro túnel imerso do Brasil, utilizando tecnologia de módulos pré-moldados de concreto.'
    },
    {
      category: 'general',
      question: 'Por que este projeto é importante?',
      answer: 'O túnel resolverá um problema histórico de mobilidade na Baixada Santista, eliminando a dependência de balsas e reduzindo drasticamente o tempo de travessia entre as duas cidades de até 1 hora para apenas 3 minutos. Além disso, não interferirá nas operações portuárias.'
    },
    {
      category: 'technical',
      question: 'Qual a diferença entre um túnel imerso e outros tipos?',
      answer: 'O túnel imerso é construído em módulos pré-fabricados em canteiro seco, que são posteriormente transportados flutuando e afundados em uma vala previamente dragada no fundo do canal. Esta técnica é mais rápida, causa menor impacto ambiental durante a construção e permite melhor controle de qualidade.'
    },
    {
      category: 'technical',
      question: 'Quais são as dimensões do túnel?',
      answer: 'Extensão total de 1,255 km (870m de túnel imerso + acessos), largura de 41 metros, altura livre interna de 5,5 metros, profundidade mínima de 21 metros abaixo do nível d\'água, composto por 6 módulos de concreto com 3 células cada.'
    },
    {
      category: 'financial',
      question: 'Qual o valor total do investimento?',
      answer: 'CAPEX (construção): R$ 5,78 bilhões, OPEX (30 anos de operação): R$ 1,3 bilhão, totalizando aproximadamente R$ 7 bilhões de investimento.'
    },
    {
      category: 'financial',
      question: 'Como será financiado o projeto?',
      answer: 'PPP com contraprestação pública máxima de R$ 7,5 bilhões em 30 anos (50% recursos federais, 50% estaduais), com pagamentos mensais vinculados ao progresso das obras. Receitas de pedágio complementam o modelo.'
    },
    {
      category: 'financial',
      question: 'Qual será o valor do pedágio?',
      answer: 'Tarifa básica estimada de R$ 6,05 por direção (valor referencial que será definido no leilão). O sistema será Free Flow (cobrança automática sem cancelas). Pedestres, ciclistas e veículos oficiais terão isenção.'
    },
    {
      category: 'general',
      question: 'Quando será o leilão?',
      answer: 'Entrega de propostas em 5 de setembro de 2025, abertura das propostas em 10 de setembro de 2025, e assinatura do contrato prevista para o 4º trimestre de 2025.'
    },
    {
      category: 'technical',
      question: 'Qual o prazo de construção?',
      answer: '48 meses (4 anos) após obtenção da Licença de Instalação, prevista para o primeiro ano do contrato.'
    },
    {
      category: 'general',
      question: 'Quando o túnel começará a operar?',
      answer: 'Previsão de início da operação no 6º ano do contrato (aproximadamente 2031), quando começará a cobrança de pedágio.'
    },
    {
      category: 'environmental',
      question: 'Quais os principais impactos ambientais?',
      answer: 'Supressão de 2,54 ha de vegetação (compensada com plantio de 2,75 ha), dragagem do canal para instalação dos módulos, interferência temporária na qualidade da água durante obras, ruído e vibração durante construção (com monitoramento contínuo).'
    },
    {
      category: 'social',
      question: 'Haverá desapropriações?',
      answer: 'Sim. Em Santos: 48.792 m² e 61 edificações (164 famílias). No Guarujá: 6.002 m² e 21 edificações (32 famílias). Todas as famílias receberão compensação justa e acompanhamento social.'
    },
    {
      category: 'environmental',
      question: 'Quais os benefícios ambientais do projeto?',
      answer: 'Redução de 18.500 toneladas de CO₂ por ano, redução de 72 toneladas de CO por ano, Programa Carbono Neutro durante operação, incentivo ao uso de transporte público e não motorizado, redução da poluição sonora das balsas.'
    },
    {
      category: 'social',
      question: 'Quantos empregos serão gerados?',
      answer: '5.905 empregos diretos e 2.785 empregos indiretos durante a construção, totalizando 8.690 postos de trabalho, além de empregos permanentes durante os 30 anos de operação.'
    },
    {
      category: 'technical',
      question: 'Como funcionará a segurança do túnel?',
      answer: 'Centro de Controle Operacional 24h, portas de emergência a cada 150 metros, sistema de ventilação longitudinal, brigada de incêndio especializada, ambulâncias para atendimento pré-hospitalar, caminhões guincho permanentes, monitoramento por sensores e câmeras.'
    },
    {
      category: 'technical',
      question: 'Qual será a capacidade de tráfego?',
      answer: 'O túnel terá 6 faixas de rolamento (3 em cada sentido), com capacidade para veículos de passeio, ônibus e caminhões. Incluirá também uma galeria central exclusiva para pedestres e ciclistas (5m x 3,5m) e infraestrutura preparada para futura instalação de VLT.'
    },
    {
      category: 'general',
      question: 'O projeto já possui licença ambiental?',
      answer: 'Sim, o projeto executivo já possui licença ambiental prévia.'
    },
    {
      category: 'financial',
      question: 'Quais os principais requisitos para participar da licitação?',
      answer: 'Receita operacional mínima de R$ 49 milhões, experiência comprovada em túneis imersos (mínimo 500m), experiência em transporte e imersão de módulos de concreto, certificações de gestão de ativos de infraestrutura e capacidade técnica e financeira comprovada.'
    },
    {
      category: 'technical',
      question: 'Como será o acesso ao túnel?',
      answer: 'Em Santos: Acesso pela região do Valongo/Centro. No Guarujá: Acesso pela região da Vicente de Carvalho. Haverá integração com sistema viário existente e sinalização adequada.'
    },
    {
      category: 'technical',
      question: 'Haverá restrições para algum tipo de veículo?',
      answer: 'O túnel permitirá tráfego de veículos de passeio, motocicletas, ônibus e vans, caminhões (com altura máxima de 5,5m), bicicletas (na ciclovia dedicada) e pedestres (na galeria exclusiva).'
    },
    {
      category: 'technical',
      question: 'Como funcionará durante manutenções?',
      answer: 'Manutenções programadas em horários de menor movimento, sistema redundante permite operação parcial, comunicação prévia aos usuários e rotas alternativas sinalizadas.'
    },
    {
      category: 'technical',
      question: 'E se houver emergências?',
      answer: 'Protocolos específicos para cada tipo de emergência, equipes treinadas disponíveis 24h, saídas de emergência a cada 150m, sistema de comunicação direta com usuários e coordenação com bombeiros e defesa civil.'
    },
    {
      category: 'technical',
      question: 'Haverá interferência no Porto de Santos?',
      answer: 'Durante a construção, haverá fechamentos programados do canal (máximo 288 horas totais), coordenados com a Autoridade Portuária. Após conclusão, o túnel não interferirá nas operações portuárias, mantendo o calado atual de 15 metros.'
    },
    {
      category: 'general',
      question: 'Como será a coordenação com outros projetos?',
      answer: 'O projeto está integrado ao planejamento metropolitano, considerando futura instalação do VLT, projeto do aeroporto metropolitano, expansão do sistema viário regional e desenvolvimento urbano de Santos e Guarujá.'
    },
    {
      category: 'social',
      question: 'Quais os principais benefícios para a população?',
      answer: 'Redução drástica do tempo de travessia (de até 1h para 3 minutos), disponibilidade 24h sem interrupções, integração urbana entre as duas cidades, valorização imobiliária nas regiões próximas, melhoria na qualidade de vida e acesso facilitado a serviços e empregos.'
    },
    {
      category: 'social',
      question: 'Como beneficiará o turismo?',
      answer: 'Facilitará acesso às praias de ambas as cidades, integração de roteiros turísticos, redução de filas e tempo de espera, melhoria da experiência do visitante e potencial aumento do fluxo turístico regional.'
    },
    {
      category: 'financial',
      question: 'Qual o impacto econômico esperado?',
      answer: 'Dinamização da economia regional, facilitação do comércio entre as cidades, redução de custos logísticos, atração de novos investimentos e desenvolvimento de novos polos comerciais.'
    },
    {
      category: 'technical',
      question: 'Por que é considerado um projeto inovador?',
      answer: 'Primeiro túnel imerso do Brasil, tecnologia de ponta em engenharia subaquática, sistema Free Flow pioneiro na região, integração multimodal (veículos, pedestres, ciclistas, VLT) e modelo de PPP com proteções inovadoras.'
    },
    {
      category: 'technical',
      question: 'Quais tecnologias serão utilizadas?',
      answer: 'BIM (Building Information Modeling) para projeto e construção, sensores IoT para monitoramento em tempo real, inteligência artificial para gestão de tráfego, sistema de cobrança automática por reconhecimento e iluminação LED inteligente.'
    },
    {
      category: 'general',
      question: 'Onde encontrar mais informações?',
      answer: 'Todos os documentos estão disponíveis no site da Secretaria de Parcerias em Investimentos de SP, Data Room virtual para interessados, audiências públicas (já realizadas) e canal de atendimento ao cidadão.'
    },
    {
      category: 'general',
      question: 'Como posso acompanhar o progresso?',
      answer: 'Relatórios trimestrais de avanço, site oficial do projeto (a ser lançado), boletins informativos, reuniões públicas de prestação de contas e canais de comunicação da concessionária.'
    },
    {
      category: 'general',
      question: 'Existe canal para dúvidas e sugestões?',
      answer: 'Sim, através de e-mail: gabineteparcerias@sp.gov.br, telefone: (11) 3702-8219, atendimento presencial mediante agendamento e Ouvidoria do Estado de São Paulo.'
    },
    {
      category: 'general',
      question: 'Qual o prazo da concessão?',
      answer: 'O prazo da concessão será de 30 anos, a partir da assinatura do Termo de Transferência Inicial.'
    },
    {
      category: 'general',
      question: 'Onde posso encontrar os documentos e anexos do projeto?',
      answer: 'Os documentos estão disponíveis no site da Secretaria de Parcerias em Investimentos de São Paulo, na seção "Documentos e anexos", e também no CONCESSION DATA ROOM.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Perguntas visíveis com base no limite
  const visibleFaqs = filteredFaqs.slice(0, visibleCount);
  const hasMoreFaqs = filteredFaqs.length > visibleCount;

  // Função para mostrar mais perguntas
  const showMoreFaqs = () => {
    setVisibleCount(prev => Math.min(prev + 8, filteredFaqs.length));
  };

  // Função para mostrar todas as perguntas
  const showAllFaqs = () => {
    setVisibleCount(filteredFaqs.length);
  };

  // Reset visible count quando categoria ou busca mudam
  useEffect(() => {
    setVisibleCount(8);
    setActiveIndex(null);
  }, [activeCategory, searchTerm]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar perguntas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma pergunta encontrada com os filtros selecionados.</p>
          </div>
        ) : (
          <>
            {visibleFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-4 text-gray-600 border-t border-gray-100">
                        <p className="pt-4">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            
            {/* Botões para carregar mais */}
            {hasMoreFaqs && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-3 pt-6"
              >
                <div className="text-sm text-gray-500">
                  Mostrando {visibleCount} de {filteredFaqs.length} perguntas
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={showMoreFaqs}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Ver mais {Math.min(8, filteredFaqs.length - visibleCount)} perguntas
                  </button>
                  {filteredFaqs.length - visibleCount > 8 && (
                    <button
                      onClick={showAllFaqs}
                      className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                      Ver todas ({filteredFaqs.length - visibleCount} restantes)
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200"
      >
        <h3 className="font-semibold text-gray-900 mb-2">Não encontrou sua pergunta?</h3>
        <p className="text-gray-600 mb-4">
          Use nosso assistente virtual para obter respostas personalizadas ou consulte a documentação completa do projeto.
        </p>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              const chatbotSection = document.getElementById('chatbot');
              if (chatbotSection) {
                chatbotSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            Falar com Assistente
          </button>
          <button 
            onClick={() => {
              const documentsSection = document.getElementById('documents');
              if (documentsSection) {
                documentsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Ver Documentação
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FAQ;