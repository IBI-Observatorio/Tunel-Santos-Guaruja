import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, X, Search, FileText, Loader, AlertCircle, RefreshCw, Info, ExternalLink } from 'lucide-react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Olá! Sou o assistente virtual do Túnel Santos-Guarujá. Como posso ajudá-lo a entender melhor este projeto?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [assistantStatus, setAssistantStatus] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    // Faz scroll apenas dentro do container de mensagens do chat
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Verifica status do assistente ao carregar
  useEffect(() => {
    checkAssistantStatus();
  }, []);

  useEffect(() => {
    // Só faz scroll quando adicionar novas mensagens (não no carregamento inicial)
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const checkAssistantStatus = async () => {
    try {
      const response = await axios.get('/api/assistant/status');
      setAssistantStatus(response.data);
      
      if (!response.data.configured) {
        setMessages([{
          id: 1,
          type: 'bot',
          content: '⚠️ O assistente ainda não foi configurado. Por favor, execute o script de configuração primeiro.',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
  };

  const clearSession = async () => {
    try {
      await axios.post('/api/assistant/clear-session', { sessionId });
      setMessages([{
        id: Date.now(),
        type: 'bot',
        content: 'Conversa reiniciada. Como posso ajudá-lo?',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Erro ao limpar sessão:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Verifica se o assistente está configurado
    if (assistantStatus && !assistantStatus.configured) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: '⚠️ O assistente não está configurado. Por favor, configure o assistente primeiro.',
        timestamp: new Date()
      }]);
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsSearching(true);

    try {
      // Envia mensagem para o assistente OpenAI
      const response = await axios.post('/api/assistant/chat', {
        message: inputMessage,
        sessionId: sessionId
      });

      setIsSearching(false);

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.response,
        citations: response.data.citations,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      let errorContent = 'Desculpe, ocorreu um erro ao processar sua pergunta.';
      
      if (error.response?.data?.error) {
        errorContent = error.response.data.error;
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: errorContent,
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const quickQuestions = [
    'Qual o valor total do investimento?',
    'Quando será o leilão?',
    'Quantos empregos serão gerados?',
    'Qual será o valor do pedágio?',
    'Quais os impactos ambientais?'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Assistente do Túnel Santos-Guarujá</h3>
              <p className="text-blue-100">Tire suas dúvidas sobre o projeto</p>
            </div>
          </div>
          <button
            onClick={clearSession}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            title="Reiniciar conversa"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="h-96 overflow-y-auto p-6 bg-gray-50 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' ? 'bg-blue-600' : 'bg-gray-200'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {message.content}
                </div>
                {message.citations && message.citations.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">Fontes consultadas:</p>
                    {message.citations.map((citation, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs text-blue-600">
                        <FileText className="w-3 h-3" />
                        <span className="truncate">{citation.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                {message.isError && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>Erro ao processar mensagem</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Bot className="w-5 h-5 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  {isSearching ? (
                    <>
                      <Search className="w-4 h-4 text-gray-500 animate-pulse" />
                      <span className="text-sm text-gray-500">Pesquisando nos documentos...</span>
                    </>
                  ) : (
                    <>
                      <Loader className="w-4 h-4 text-gray-500 animate-spin" />
                      <span className="text-sm text-gray-500">Gerando resposta...</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Perguntas frequentes:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(question)}
                className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder="Digite sua pergunta..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            disabled={isLoading}
          />
          <motion.button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Send className="w-5 h-5" />
            <span>Enviar</span>
          </motion.button>
        </div>
      </div>

      {/* Footer com informações */}
      <div className="bg-gray-50 border-t px-4 py-3">
        <div className="flex items-start gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-gray-600">
            <p className="font-semibold text-amber-700 mb-1">Aviso Importante:</p>
            <p>
              Este assistente fornece informações baseadas em documentos públicos do projeto. 
              Para informações oficiais e vinculantes, sempre consulte os{' '}
              <a 
                href="#documents" 
                className="text-blue-600 hover:text-blue-700 underline font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('documents')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                documentos oficiais da licitação
              </a>
              {' '}e o site da Secretaria de Parcerias em Investimentos de SP.
            </p>
          </div>
        </div>
        
        <div className="border-t pt-2 mt-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5" />
              <span>Powered by OpenAI</span>
            </div>
            <div className="flex items-center gap-3">
              <span>© 2025 IBI - Observatório de Dados</span>
              <span>•</span>
              <a 
                href="https://platform.openai.com/docs/assistants" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                <span>Assistant API</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;