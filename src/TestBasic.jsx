import React from 'react';

function TestBasic() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #e0f2fe, #dbeafe, #bfdbfe)',
      padding: '2rem'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        fontWeight: 'bold', 
        color: '#1e40af',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        Túnel Santos-Guarujá
      </h1>
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            📍 Extensão
          </h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>1,255 km</p>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>870m de túnel imerso</p>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            💰 Investimento
          </h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>R$ 5,78 bi</p>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Valor total do CAPEX</p>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            👥 Empregos
          </h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>8.690</p>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Diretos e indiretos</p>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            📅 Leilão
          </h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed' }}>Set/2025</p>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>5 de setembro de 2025</p>
        </div>
      </div>

      <div style={{
        maxWidth: '800px',
        margin: '3rem auto',
        background: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Sobre o Projeto
        </h2>
        <p style={{ lineHeight: '1.8', color: '#374151' }}>
          O Túnel Imerso Santos-Guarujá é um projeto inovador de Parceria Público-Privada (PPP) 
          para construção de um túnel submerso que conectará as cidades de Santos e Guarujá 
          sob o canal do Porto de Santos. Será o primeiro túnel imerso do Brasil, utilizando 
          tecnologia de módulos pré-moldados de concreto que serão afundados e posicionados 
          no fundo do canal.
        </p>
      </div>
    </div>
  );
}

export default TestBasic;