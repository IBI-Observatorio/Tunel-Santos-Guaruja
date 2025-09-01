import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, ExternalLink, Calendar,
  Filter, Search, File, FolderOpen 
} from 'lucide-react';

const DocumentsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
        {filteredDocuments.map((doc, index) => (
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
            
            <div className="flex gap-2">
              <a
                href={doc.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
              <a
                href={doc.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Data Room Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl text-white"
      >
        <h3 className="text-xl font-bold mb-3">Data Room Virtual</h3>
        <p className="mb-4 text-blue-100">
          Acesse o Data Room completo com todos os documentos técnicos, jurídicos e financeiros do projeto.
          Disponível para investidores qualificados e interessados na licitação.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
            Solicitar Acesso
          </button>
          <button className="px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg hover:bg-white/30 transition-colors font-medium">
            Mais Informações
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DocumentsSection;