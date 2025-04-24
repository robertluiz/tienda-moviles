# Tienda Móviles

Aplicação web para compra de dispositivos móveis, desenvolvida com React.

## 🚀 Tecnologias

- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Zustand](https://github.com/pmndrs/zustand) - Gerenciamento de estado
- [React Query](https://react-query.tanstack.com/) - Gerenciamento de requisições e cache

## ✨ Características

- Listagem de produtos com filtro em tempo real
- Página de detalhes do produto
- Adição de produtos ao carrinho
- Cache de dados com expiração de 1 hora
- Layout responsivo
- Navegação sem recarregar página (SPA)

## 🛠️ Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/tienda-moviles.git
cd tienda-moviles
```

Instale as dependências:

```bash
npm install
```

## 📋 Scripts

- **Desenvolvimento**
  ```bash
  npm start
  ```
  Inicia o servidor de desenvolvimento em [http://localhost:3000](http://localhost:3000)

- **Build**
  ```bash
  npm run build
  ```
  Gera uma versão otimizada para produção

- **Testes**
  ```bash
  npm test
  ```
  Executa os testes automatizados

- **Lint**
  ```bash
  npm run lint
  ```
  Verifica problemas de código e estilo

## 📱 Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
├── hooks/           # Hooks personalizados
├── pages/           # Páginas da aplicação
├── services/        # Serviços de API
├── store/           # Gerenciamento de estado (Zustand)
├── styles/          # Estilos globais
└── utils/           # Funções utilitárias
```

## 🔍 API

A aplicação consome dados da API:

- Listagem de produtos: `GET /api/product`
- Detalhes do produto: `GET /api/product/:id`
- Adicionar ao carrinho: `POST /api/cart`

Base URL: `https://itx-frontend-test.onrender.com/`

## 📝 Implementação

### Gerenciamento de Estado
- Utilizamos Zustand para gerenciar o estado global da aplicação de forma simples e eficiente
- React Query para gerenciar requisições à API, incluindo cache e invalidação

### Cache
- Implementamos um sistema de cache com expiração de 1 hora para melhorar a performance
- Dados são armazenados localmente para reduzir requisições à API

### Requisitos Atendidos
- SPA com navegação do lado do cliente
- Scripts para desenvolvimento, build, testes e lint
- Layout responsivo adaptado para diferentes tamanhos de tela
- Filtro de produtos em tempo real 