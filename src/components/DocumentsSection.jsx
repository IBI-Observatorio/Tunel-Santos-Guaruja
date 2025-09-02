import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, ExternalLink, Calendar,
  Filter, Search, File, FolderOpen, Plus, Minus, Eye, X, Mail
} from 'lucide-react';

const DocumentsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);
  const [showModal, setShowModal] = useState(false);

  const categories = [
    { id: 'all', label: 'Todos', icon: <FolderOpen /> },
    { id: 'legal', label: 'Edital e Contrato', icon: <FileText /> },
    { id: 'technical', label: 'Estudos Técnicos', icon: <File /> },
    { id: 'environmental', label: 'Ambiental', icon: <FileText /> },
    { id: 'presentations', label: 'Apresentações', icon: <FileText /> }
  ];

  const documents = [
    {
      category: 'legal',
      title: 'Edital de Licitação',
      description: 'Concorrência Internacional nº 01/2025',
      date: 'Janeiro 2025',
      link: 'https://www.parceriaseminvestimentos.sp.gov.br/wp-content/uploads/2025/06/00_EDITAL_.pdf'
    },
    {
      category: 'legal',
      title: 'Minuta de Contrato',
      description: 'Contrato de concessão do Túnel Santos-Guarujá',
      date: 'Janeiro 2025',
      link: 'https://www.parceriaseminvestimentos.sp.gov.br/wp-content/uploads/2025/06/00_CONTRATO.pdf'
    },
    {
      category: 'environmental',
      title: 'RIMA - Relatório de Impacto Ambiental',
      description: 'Estudo completo de impacto ambiental do projeto',
      date: 'Junho 2024',
      link: 'https://www.parceriaseminvestimentos.sp.gov.br/wp-content/uploads/2024/09/5867-RIMA-TUNEL-SANTOS-GUARUJA-JUN-24.pdf'
    },
    {
      category: 'technical',
      title: 'Estudo de Viabilidade - Capítulo 1',
      description: 'Introdução e contexto do projeto',
      date: 'Junho 2024',
      link: 'https://www.parceriaseminvestimentos.sp.gov.br/wp-content/uploads/2024/09/5867-PRODUTO-1.2.4-CAP.1-JUN-24.pdf'
    },
    {
      category: 'technical',
      title: 'Estudo de Viabilidade - Capítulo 2',
      description: 'Análise de demanda e tráfego',
      date: 'Junho 2024',
      link: 'https://www.parceriaseminvestimentos.sp.gov.br/wp-content/uploads/2024/09/5867-PRODUTO-1.2.4-CAP.2-JUN-24.pdf'
    },
    {
      category: 'technical',
      title: 'Estudo de Viabilidade - Capítulo 3',
      description: 'Projeto de engenharia',
      date: 'Junho 2024',
      link: 'https://www.parceriaseminvestimentos.sp.gov.br/wp-content/uploads/2024/09/5867-PRODUTO-1.2.4-CAP.3-JUN-24.pdf'
    },
    {
      category: 'technical',
      title: 'CAPEX e OPEX',
      description: 'Análise de custos de investimento e operação',
      date: 'Junho 2024',
      link: 'https://www.parceriaseminvestimentos.sp.gov.br/wp-content/uploads/2024/09/5867-PRODUTO-1.2.4-CAPEX-E-OPEX-JUN-24.pdf'
    },
    {
      category: 'presentations',
      title: 'Roadshow Internacional',
      description: 'Apresentação para investidores internacionais',
      date: 'Março 2025',
      link: 'https://www.parceriaseminvestimentos.sp.gov.br/wp-content/uploads/2025/06/2025.03.14-SPI_-Santos-Guaruja-Immersed-Tunnel-Concession_-Roadshow_final.pdf'
    },
    {
      category: 'presentations',
      title: 'Santos-Guarujá Immersed Tunnel',
      description: 'Apresentação técnica do projeto',
      date: 'Março 2025',
      link: 'https://www.parceriaseminvestimentos.sp.gov.br/wp-content/uploads/2023/07/Santos_Guaruja_Immersed_Tunnel_march_2025_vfinal.pdf'
    },
    {
      category: 'legal',
      title: 'Ata de Esclarecimentos - 1ª',
      description: 'Primeira ata de esclarecimentos do edital',
      date: 'Julho 2025',
      link: 'https://www.parceriaseminvestimentos.sp.gov.br/wp-content/uploads/2025/07/TUNEL_1a_ATA_DE_ESCLARECIMENTOS_assinado_aa_assinado_assinado_assinado-1.pdf'
    },
    {
      category: 'legal',
      title: 'Ata de Esclarecimentos - 2ª',
      description: 'Segunda ata de esclarecimentos do edital',
      date: 'Agosto 2025',
      link: 'https://www.parceriaseminvestimentos.sp.gov.br/wp-content/uploads/2025/08/TUNEL_ATA_DE_ESCLARECIMENTOS_assinado_aa_assinado_28129_assinado_assinado_assinado.pdf'
    },
    {
      category: 'legal',
      title: 'Aviso de Licitação',
      description: 'Aviso oficial da licitação',
      date: 'Fevereiro 2025',
      link: 'https://www.parceriaseminvestimentos.sp.gov.br/wp-content/uploads/2025/02/AVISO-DE-LICITACAO-Concorrencia-Internacional-n_01_2025.pdf'
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const documentsToShow = filteredDocuments.slice(0, visibleCount);
  const hasMore = visibleCount < filteredDocuments.length;

  const showMoreDocuments = () => {
    setVisibleCount(prev => Math.min(prev + 6, filteredDocuments.length));
  };

  const showAllDocuments = () => {
    setVisibleCount(filteredDocuments.length);
  };

  const showLess = () => {
    setVisibleCount(6);
  };

  return (
    <div>
      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {React.cloneElement(category.icon, { className: 'w-4 h-4' })}
              {category.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documentsToShow.map((doc, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {doc.date}
              </span>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">{doc.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
            
            <a
              href={doc.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium w-full"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          </motion.div>
        ))}
      </div>

      {/* Show More/Less Buttons */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <div className="text-sm text-gray-500">
            Mostrando {visibleCount} de {filteredDocuments.length} documentos
          </div>
          <div className="flex gap-3">
            <button
              onClick={showMoreDocuments}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              <Plus className="w-5 h-5" />
              Ver mais {Math.min(6, filteredDocuments.length - visibleCount)} documentos
            </button>
            {filteredDocuments.length - visibleCount > 6 && (
              <button
                onClick={showAllDocuments}
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Eye className="w-5 h-5" />
                Ver todos ({filteredDocuments.length - visibleCount} restantes)
              </button>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Show Less Button */}
      {!hasMore && visibleCount > 6 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex justify-center"
        >
          <button
            onClick={showLess}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            <Minus className="w-5 h-5" />
            Ver menos
          </button>
        </motion.div>
      )}

      {/* Data Room Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200"
      >
        <h3 className="font-semibold text-gray-900 mb-2">Data Room Virtual</h3>
        <p className="text-gray-600 mb-4">
          Acesse o Data Room completo com todos os documentos técnicos, jurídicos e financeiros do projeto.
          Disponível para investidores qualificados e interessados na licitação.
        </p>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
        >
          Solicitar Acesso
        </button>
      </motion.div>

      {/* Modal de Solicitação de Acesso */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">Solicitar Acesso ao Data Room</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 mb-2">
                    Para acessar o data room, envie solicitação ao e-mail:
                  </p>
                  <a 
                    href={`mailto:tunelimerso@sp.gov.br?subject=Acesso ao data room – Túnel Imerso Santos-Guarujá&body=Solicito acesso ao Data Room do Túnel Imerso Santos-Guarujá.%0D%0A%0D%0AInformações:%0D%0A%0D%0ANome completo: %0D%0AE-mail: %0D%0ACPF: %0D%0AInstituição: %0D%0ATelefone: %0D%0ACidade: %0D%0A%0D%0AAtenciosamente,`}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    tunelimerso@sp.gov.br
                  </a>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">
                  Título do e-mail:
                </p>
                <p className="text-gray-700 font-mono text-sm bg-white px-3 py-2 rounded border border-blue-200">
                  "Acesso ao data room – Túnel Imerso Santos-Guarujá"
                </p>
              </div>
              
              <div>
                <p className="font-semibold text-gray-900 mb-2">
                  Informações necessárias:
                </p>
                <ul className="space-y-1 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Nome completo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    E-mail
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    CPF
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Instituição
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Telefone
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Cidade
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <a
                href={`mailto:tunelimerso@sp.gov.br?subject=Acesso ao data room – Túnel Imerso Santos-Guarujá&body=Solicito acesso ao Data Room do Túnel Imerso Santos-Guarujá.%0D%0A%0D%0AInformações:%0D%0A%0D%0ANome completo: %0D%0AE-mail: %0D%0ACPF: %0D%0AInstituição: %0D%0ATelefone: %0D%0ACidade: %0D%0A%0D%0AAtenciosamente,`}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all font-medium text-center"
              >
                Enviar E-mail
              </a>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DocumentsSection;