import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, X, Search, FileText, Loader } from 'lucide-react';
import axios from 'axios';

const Chatbot = ({ onClose }) => {
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
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const searchDocuments = async (query) => {
    try {
      const response = await axios.post('/api/search', { query });
      return response.data.results;
    } catch (error) {
      console.error('Erro na busca:', error);
      return [];
    }
  };

  const generateResponse = async (query, context) => {
    try {
      const response = await axios.post('/api/chat', {
        messages: [
          {
            role: 'system',
            content: `Você é um assistente especializado no projeto do Túnel Imerso Santos-Guarujá. 
            Use as seguintes informações dos documentos para responder às perguntas:
            ${context}
            
            Seja preciso, objetivo e amigável. Se não souber a resposta, indique onde o usuário pode encontrar mais informações.`
          },
          {
            role: 'user',
            content: query
          }
        ]
      });
      return response.data.content;
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      return 'Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

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
      // Busca nos documentos
      const searchResults = await searchDocuments(inputMessage);
      setIsSearching(false);

      // Gera resposta com contexto
      const context = searchResults.map(result => result.content).join('\n\n');
      const response = await generateResponse(inputMessage, context);

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        documents: searchResults.slice(0, 3), // Mostra até 3 documentos relevantes
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
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
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
      style={{ height: '600px', maxHeight: '80vh' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">Assistente Virtual</h3>
            <p className="text-xs text-blue-100">Túnel Santos-Guarujá</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100% - 200px)' }}>
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
                {message.documents && message.documents.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">Fontes consultadas:</p>
                    {message.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                        <FileText className="w-3 h-3" />
                        <span className="truncate">{doc.title}</span>
                      </div>
                    ))}
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
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder="Digite sua pergunta..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <motion.button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="p-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Chatbot;