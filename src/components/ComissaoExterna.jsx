import React from 'react';
import { Building, Info, Calendar, ExternalLink } from 'lucide-react';

const ComissaoExterna = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Card Principal */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8 border border-blue-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-600 rounded-lg">
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
      
      {/* Call to Action - movido para fora do grid */}
      <div className="col-span-1 lg:col-span-2 mt-8 text-center">
        <a
          href="https://www2.camara.leg.br/atividade-legislativa/comissoes/comissoes-temporarias/externas/57a-legislatura/monitorar-obras-do-tunel-santos-guaruja"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
        >
          <ExternalLink className="w-5 h-5" />
          Acessar Página Oficial da Comissão
        </a>
      </div>
    </div>
  );
};

export default ComissaoExterna;