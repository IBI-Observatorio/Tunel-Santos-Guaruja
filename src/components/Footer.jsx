import React from 'react';
import { Phone, Mail, MessageCircle, Instagram, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logos Section */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-12">
          <div className="p-4 rounded-lg">
            <img src="/logo-fppa.png" alt="Frente Parlamentar de Portos e Aeroportos" className="h-16 object-contain" />
          </div>
          <div className="p-4 rounded-lg">
            <img src="/logo-ibi.png" alt="Instituto Brasileiro de Infraestrutura" className="h-16 object-contain" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Sobre esta Página</h3>
            <p className="text-gray-400 text-sm mb-4">
              Esta página é oferecida pelo Instituto Brasileiro de Infraestrutura (IBI) 
              e pela Frente Parlamentar Mista de Portos e Aeroportos (FPPA).
            </p>
            <p className="text-gray-400 text-sm">
              Informações sobre o projeto Túnel Imerso Santos-Guarujá, uma das mais 
              importantes obras de infraestrutura do Brasil.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato FPPA</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <p className="text-sm text-gray-400">(61) 3543-4283</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a
                  href="mailto:secretaria@portoseaeroportosfppa.com.br"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  secretaria@portoseaeroportosfppa.com.br
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <a
                  href="http://wa.me/5561992167863"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  WhatsApp: (61) 99216-7863
                </a>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              <a
                href="http://wa.me/5561992167863"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/portoseaeroportos/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://youtube.com/@fppaportoseaeroportos?si=qyB1I_pVQcshTClh"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/paulo-alexandre-barbosa-38537a23/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Siga-nos para atualizações sobre infraestrutura portuária e aeroportuária
            </p>
          </div>
        </div>

        {/* Links Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <a href="#overview" className="text-gray-400 hover:text-white transition-colors">
              Visão Geral
            </a>
            <a href="#timeline" className="text-gray-400 hover:text-white transition-colors">
              Cronograma
            </a>
            <a href="#documents" className="text-gray-400 hover:text-white transition-colors">
              Documentação
            </a>
            <a href="#chatbot" className="text-gray-400 hover:text-white transition-colors">
              Assistente Virtual
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black bg-opacity-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>©2025 FPPA – Frente Parlamentar de Portos e Aeroportos</p>
            <p className="mt-2 sm:mt-0">Instituto Brasileiro de Infraestrutura (IBI)</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;