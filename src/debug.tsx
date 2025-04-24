import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';

const DebugComponent = () => {
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Página de Depuração</h1>
            <p>Se você está vendo esta página, o React está funcionando corretamente.</p>
            <div style={{
                padding: '20px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginTop: '20px'
            }}>
                <h2>Informações de Depuração</h2>
                <ul>
                    <li>React versão: {React.version}</li>
                    <li>Modo de produção: {process.env.NODE_ENV}</li>
                    <li>Timestamp: {new Date().toISOString()}</li>
                </ul>
            </div>
        </div>
    );
};

// Tenta renderizar o componente de depuração
try {
    const rootElement = document.getElementById('root');

    if (rootElement) {
        console.log('Elemento root encontrado, tentando renderizar componente de depuração');
        const root = ReactDOM.createRoot(rootElement);
        root.render(
            <React.StrictMode>
                <DebugComponent />
            </React.StrictMode>
        );
        console.log('Componente de depuração renderizado com sucesso');
    } else {
        console.error('Elemento root não encontrado no DOM');
    }
} catch (error) {
    console.error('Erro ao renderizar componente de depuração:', error);
} 