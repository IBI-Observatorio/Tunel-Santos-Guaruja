import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, DollarSign, Calendar, PieChart as PieIcon } from 'lucide-react';

const FinancialChart = () => {
  const [activeView, setActiveView] = useState('investment');

  // Dados de investimento ao longo dos anos
  const investmentData = [
    { year: 'Ano 1', value: 50, phase: 'Licenciamento' },
    { year: 'Ano 2', value: 800, phase: 'Mobilização' },
    { year: 'Ano 3', value: 1800, phase: 'Construção' },
    { year: 'Ano 4', value: 2200, phase: 'Construção' },
    { year: 'Ano 5', value: 928, phase: 'Finalização' },
    { year: 'Ano 6-10', value: 200, phase: 'Operação Inicial' },
    { year: 'Ano 11-20', value: 150, phase: 'Operação' },
    { year: 'Ano 21-30', value: 100, phase: 'Manutenção' },
  ];

  // Distribuição de custos
  const costDistribution = [
    { name: 'Obras Civis', value: 3500, color: '#3B82F6' },
    { name: 'Equipamentos', value: 1200, color: '#10B981' },
    { name: 'Desapropriações', value: 400, color: '#F59E0B' },
    { name: 'Gestão Ambiental', value: 280, color: '#8B5CF6' },
    { name: 'Administração', value: 400, color: '#EF4444' },
  ];

  // Fluxo de receitas
  const revenueFlow = [
    { year: 1, contraprestacao: 0, pedagio: 0, total: 0 },
    { year: 2, contraprestacao: 100, pedagio: 0, total: 100 },
    { year: 3, contraprestacao: 150, pedagio: 0, total: 150 },
    { year: 4, contraprestacao: 200, pedagio: 0, total: 200 },
    { year: 5, contraprestacao: 250, pedagio: 0, total: 250 },
    { year: 6, contraprestacao: 250, pedagio: 78, total: 328 },
    { year: 10, contraprestacao: 250, pedagio: 120, total: 370 },
    { year: 15, contraprestacao: 250, pedagio: 150, total: 400 },
    { year: 20, contraprestacao: 250, pedagio: 180, total: 430 },
    { year: 25, contraprestacao: 250, pedagio: 200, total: 450 },
    { year: 30, contraprestacao: 250, pedagio: 220, total: 470 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm mt-1">
              {entry.name}: R$ {entry.value} mi
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* View Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { id: 'investment', label: 'Cronograma de Investimento', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'distribution', label: 'Distribuição de Custos', icon: <PieIcon className="w-4 h-4" /> },
          { id: 'revenue', label: 'Fluxo de Receitas', icon: <DollarSign className="w-4 h-4" /> },
        ].map((view) => (
          <motion.button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeView === view.id
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {view.icon}
            {view.label}
          </motion.button>
        ))}
      </div>

      {/* Charts */}
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        {activeView === 'investment' && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Cronograma de Investimento (R$ milhões)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={investmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity={1} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">R$ 5,78 bi</p>
                <p className="text-sm text-gray-600">CAPEX Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">48 meses</p>
                <p className="text-sm text-gray-600">Prazo de Obra</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">R$ 1,3 bi</p>
                <p className="text-sm text-gray-600">OPEX (30 anos)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">R$ 7,5 bi</p>
                <p className="text-sm text-gray-600">Contraprestação</p>
              </div>
            </div>
          </div>
        )}

        {activeView === 'distribution' && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Distribuição de Custos do Projeto
            </h3>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {costDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {costDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded`} style={{ backgroundColor: item.color }}></div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">R$ {item.value} milhões</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'revenue' && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Fluxo de Receitas ao Longo da Concessão (R$ milhões/ano)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={revenueFlow}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" label={{ value: 'Ano', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'R$ milhões', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="contraprestacao" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                  name="Contraprestação Pública"
                />
                <Area 
                  type="monotone" 
                  dataKey="pedagio" 
                  stackId="1"
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                  name="Receita de Pedágio"
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  name="Receita Total"
                  dot={{ fill: '#F59E0B', r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Modelo de Receitas:</strong> O projeto combina contraprestação pública (fixa) 
                com receitas de pedágio (variável), garantindo sustentabilidade financeira e 
                compartilhamento de riscos entre poder público e concessionária.
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6"
        >
          <DollarSign className="w-8 h-8 mb-2 opacity-80" />
          <h4 className="text-lg font-semibold mb-1">TIR do Projeto</h4>
          <p className="text-2xl font-bold">12,5% a.a.</p>
          <p className="text-sm opacity-90 mt-2">Taxa Interna de Retorno esperada</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6"
        >
          <Calendar className="w-8 h-8 mb-2 opacity-80" />
          <h4 className="text-lg font-semibold mb-1">Payback</h4>
          <p className="text-2xl font-bold">15 anos</p>
          <p className="text-sm opacity-90 mt-2">Período de retorno do investimento</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6"
        >
          <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
          <h4 className="text-lg font-semibold mb-1">VPL</h4>
          <p className="text-2xl font-bold">R$ 850 mi</p>
          <p className="text-sm opacity-90 mt-2">Valor Presente Líquido positivo</p>
        </motion.div>
      </div>
    </div>
  );
};

export default FinancialChart;