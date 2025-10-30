# GameHub

Sistema de gerenciamento de campeonatos e jogadores desenvolvido com React, Node.js, Express, TypeScript e TypeORM.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **MySQL** (versão 8.0 ou superior) - [Download](https://dev.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/GameHub.git
cd GameHub
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados MySQL

#### 3.1. Crie o banco de dados com o arquivo: database/gameHubDB.sql utilizando a IDE que preferir

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
touch .env
```

Adicione as seguintes configurações ao arquivo `.env`:

```env
# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=gameHubDB

# Configurações do Servidor
PORT=3333
```

### 5. Execute o projeto

```bash
npm run dev
```

## 🎯 Testando a aplicação

### 1. Verifique se o servidor está rodando

Acesse: http://localhost:3333

Você deve ver:

```json
{ "hello": "world" }
```

### 2. Verifique se o banco conectou

No terminal, você deve ver:

```
Database connected
Server is running on http://localhost:3333
```

## 📊 Estrutura do Banco de Dados

O projeto cria automaticamente as seguintes tabelas:

- **users** - Usuários do sistema
- **teams** - Times/Equipes
- **gamers** - Jogadores (relaciona users com teams)
- **championship** - Campeonatos
- **matches** - Partidas
- **awards** - Premiações
- **awards_championship** - Relacionamento entre premiações e campeonatos
- **logs** - Logs do sistema

## 🛠️ Scripts Disponíveis

```bash
# Executar em modo desenvolvimento (com auto-reload)
npm run dev
```

## 📁 Estrutura do Projeto

```
GameHub/
├── src/
│   ├── entities/          # Entidades TypeORM
│   │   ├── User.ts
│   │   ├── Team.ts
│   │   ├── Gamer.ts
│   │   ├── Championship.ts
│   │   ├── Match.ts
│   │   ├── Award.ts
│   │   ├── AwardsChampionship.ts
│   │   └── Log.ts
│   └── data-source.ts     # Configuração do TypeORM
├── routes.ts              # Rotas da API
├── server.ts              # Servidor Express
├── package.json
├── tsconfig.json
└── README.md
```

---

**Desenvolvido com ❤️ usando Node.js, Express, TypeScript e TypeORM**
