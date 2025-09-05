import { useState, useEffect } from 'react';
import { Calendar, Clock, ExternalLink, FileText, Trophy, CheckCircle } from 'lucide-react';

const AcompanhamentoLeilao = () => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [daysPassed, setDaysPassed] = useState(0);

  // Data do leilão: 5 de setembro de 2025 às 16h (horário de Brasília)
  const auctionDate = new Date('2025-09-05T16:00:00-03:00');

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const difference = auctionDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setIsExpired(true);
        const daysDiff = Math.floor(Math.abs(difference) / (1000 * 60 * 60 * 24));
        setDaysPassed(daysDiff);
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  // Extrair o ID do vídeo do YouTube
  const videoUrl = 'https://www.youtube.com/watch?v=vAnJsRSz54M';
  const videoId = 'vAnJsRSz54M';
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <section id="acompanhamento-leilao" className="py-16 pt-24 sm:pt-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título da Seção */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Acompanhamento do Leilão
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Acompanhe em tempo real o processo de licitação do Túnel Submerso Santos-Guarujá
          </p>
        </div>

        {/* Container Principal */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Vídeo do YouTube */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="mr-2 text-blue-600" />
                Transmissão do Leilão
              </h3>
              <a 
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative group"
              >
                <img 
                  src={thumbnailUrl}
                  alt="Transmissão do Leilão"
                  className="w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg group-hover:bg-opacity-40 transition-all duration-300">
                  <div className="bg-red-600 rounded-full p-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
              </a>
              <p className="mt-4 text-gray-600">
                Assista à transmissão oficial do leilão pela B3
              </p>
            </div>
          </div>

          {/* Informações do Leilão */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="mr-2 text-blue-600" />
                Informações do Leilão
              </h3>
              
              {/* Cronômetro ou Tempo Decorrido */}
              {!isExpired && timeLeft ? (
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <p className="text-sm text-blue-600 font-semibold mb-3 text-center">
                    TEMPO ATÉ O LEILÃO
                  </p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">{timeLeft.days}</div>
                      <div className="text-xs text-gray-500 uppercase">Dias</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <div className="text-xs text-gray-500 uppercase">Horas</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <div className="text-xs text-gray-500 uppercase">Min</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <div className="text-xs text-gray-500 uppercase">Seg</div>
                    </div>
                  </div>
                </div>
              ) : isExpired ? (
                <div className="bg-green-50 rounded-lg p-6 mb-6 text-center">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-green-700 font-semibold">
                    Leilão realizado há {daysPassed} {daysPassed === 1 ? 'dia' : 'dias'}
                  </p>
                </div>
              ) : null}

              {/* Detalhes do Leilão */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="font-medium">Data:</span>
                  <span className="ml-2">5 de setembro de 2025</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="font-medium">Horário:</span>
                  <span className="ml-2">16:00 (Horário de Brasília)</span>
                </div>
              </div>

              {/* Botão B3 */}
              <a
                href="https://bvmf.bmfbovespa.com.br/consulta-leiloes/ResumoLeiloesEspeciaisDetalhe.aspx?IdLeilao=10849&TituloLeilao=S%c3%83O+PAULO+-+01%2f2025+-+PPP+T%c3%9aNEL+IMERSO+SANTOS-GUARUJ%c3%81&idioma=pt-br"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <ExternalLink className="mr-2" size={20} />
                Visualizar na B3
              </a>
            </div>
          </div>
        </div>

        {/* Card de Resultado */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                  <Trophy className="mr-3" size={32} />
                  Resultado do Leilão
                </h3>
                <p className="text-green-100 text-lg">
                  Leilão realizado com sucesso! Confira os detalhes da empresa vencedora
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            
            {/* Informações da empresa vencedora */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-green-100 text-sm mb-2">Empresa Vencedora</p>
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/6/6b/LogoME.jpg" 
                      alt="Mota-Engil" 
                      className="h-8 w-auto bg-white rounded p-1"
                    />
                    <a 
                      href="https://www.mota-engil.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white font-semibold hover:text-green-200 transition-colors flex items-center gap-1"
                    >
                      Mota-Engil
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-green-100 text-sm mb-1">Valor da Proposta</p>
                  <p className="text-white font-semibold text-lg">R$ 438,3 milhões/ano</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-green-100 text-sm mb-1">Deságio</p>
                  <p className="text-white font-semibold text-lg">0,5%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcompanhamentoLeilao;