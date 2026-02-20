# GameHub

Plataforma web para gestão de campeonatos, partidas, times e jogadores (gamers), com autenticação, notificações em tempo real e armazenamento de mídia em nuvem.

---

## Funcionalidades

- **Autenticação** — Login e registro com JWT; perfis de usuário com foto (upload via AWS S3)
- **Campeonatos** — Criar, editar e listar campeonatos; vincular premiações e partidas
- **Partidas** — Cadastro de partidas, placares e datas; listagem e detalhes
- **Times** — CRUD de times com logo (upload S3)
- **Gamers** — Cadastro de jogadores; ranking (top gamers) e listagem
- **Premiações** — Gestão de prêmios e associação a campeonatos
- **Notificações** — Notificações em tempo real (Socket.io) e histórico
- **Métricas** — Coleta e consulta de métricas do sistema
- **Upload de arquivos** — Fotos de perfil e logos via AWS S3 (URLs assinadas)

---

## Stack

| Camada    | Tecnologias |
|-----------|-------------|
| **Frontend** | React 19, TypeScript, Vite 7, React Router 7, Tailwind CSS 4, Radix UI, Chart.js, Socket.io Client, Axios |
| **Backend**  | Node.js, Express, TypeScript, TypeORM, MySQL, JWT (jsonwebtoken), Argon2, Multer, Socket.io, AWS SDK (S3) |
| **Ferramentas** | ESLint 9, Prettier, EditorConfig |

---

## Estrutura do projeto

```
GameHub/
├── backend/                 # API REST (Node.js + Express + TypeORM)
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/
│   │   │   ├── entities/
│   │   │   ├── handlers/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   ├── validations/
│   │   │   └── dtos/
│   │   ├── database/
│   │   ├── middlewares/
│   │   ├── data-source.ts
│   │   ├── routes.ts
│   │   └── server.ts
│   ├── database/            # Migrations e scripts SQL
│   └── S3_SETUP.md          # Guia de configuração AWS S3
├── frontend/                # SPA (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── routes/
│   │   └── style/
│   └── components.json      # shadcn/ui
├── .editorconfig
├── DEVELOPMENT.md            # Lint, formatação e scripts de desenvolvimento
├── package.json             # Scripts raiz (lint, format, dev)
└── render.yaml              # Configuração de deploy (Render)
```

---

## Pré-requisitos

- **Node.js** 18+ (recomendado LTS)
- **MySQL** 8+
- **Conta AWS** (opcional, para S3 — fotos e logos)

---

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/<seu-usuario>/GameHub.git
cd GameHub
```

2. Instale as dependências do projeto raiz, backend e frontend:

```bash
npm run install:all
```

3. Configure as variáveis de ambiente (veja [Variáveis de ambiente](#variáveis-de-ambiente)).

4. Crie o banco MySQL (a partir da pasta `backend`):

  Dentro da pasta `backend` -> `database`, teremos o arquivo `gameHub.sql` para criação do banco em sua maquina 

5. Inicie backend e frontend (em terminais separados):

```bash
# Terminal 1 – API
npm run dev:backend

# Terminal 2 – Interface
npm run dev:frontend
```

O frontend estará em `http://localhost:5173` e a API no endereço configurado no backend (ex.: `http://localhost:3000`).

---

## Variáveis de ambiente

### Backend

Crie um arquivo `.env` na pasta `backend/` com:

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `DB_HOST` | Host do MySQL | Sim |
| `DB_PORT` | Porta do MySQL (ex.: 3306) | Sim |
| `DB_USER` | Usuário do banco | Sim |
| `DB_PASSWORD` | Senha do banco | Sim |
| `DB_NAME` | Nome do banco (ex.: gameHubDB) | Sim |
| `JWT_SECRET` | Chave secreta para tokens JWT | Sim |
| `AWS_REGION` | Região do bucket S3 | Para S3 |
| `AWS_ACCESS_KEY_ID` | Access Key AWS | Para S3 |
| `AWS_SECRET_ACCESS_KEY` | Secret Key AWS | Para S3 |
| `S3_BUCKET` | Nome do bucket S3 | Para S3 |
| `S3_PUBLIC_PREFIX_TEAM` | Prefixo para logos de times | Para S3 |
| `S3_PUBLIC_PREFIX_USER` | Prefixo para fotos de usuário | Para S3 |
| `SIGNED_URL_EXPIRES` | Tempo de expiração das URLs assinadas (segundos) | Para S3 |

O arquivo `render.yaml` na raiz do projeto referencia essas variáveis para deploy na Render; em produção, defina-as no painel do serviço.

---

## Scripts disponíveis

Na **raiz** do projeto:

| Script | Descrição |
|--------|-----------|
| `npm run install:all` | Instala dependências (raiz + backend + frontend) |
| `npm run dev:backend` | Sobe o backend em modo desenvolvimento |
| `npm run dev:frontend` | Sobe o frontend em modo desenvolvimento |
| `npm run lint` | Executa ESLint em todo o projeto |
| `npm run lint:fix` | ESLint com correção automática |
| `npm run format` | Formata o código com Prettier |
| `npm run format:check` | Verifica formatação sem alterar arquivos |
| `npm run lint:backend` | Lint apenas no backend |
| `npm run lint:frontend` | Lint apenas no frontend |
| `npm run format:backend` | Formata apenas o backend |
| `npm run format:frontend` | Formata apenas o frontend |

Detalhes de lint, Prettier e EditorConfig estão em [DEVELOPMENT.md](./DEVELOPMENT.md).

---

## Deploy

O projeto inclui `render.yaml` para deploy do **backend** na [Render](https://render.com). As variáveis de ambiente (banco, JWT, AWS/S3) devem ser configuradas no dashboard do serviço. O frontend pode ser hospedado em qualquer serviço estático (Vercel, Netlify, etc.) apontando a API para a URL do backend em produção.

---

## Documentação adicional

- [DEVELOPMENT.md](./DEVELOPMENT.md) — Configuração do editor, ESLint, Prettier e scripts de desenvolvimento
- [backend/S3_SETUP.md](./backend/S3_SETUP.md) — Configuração do bucket AWS S3 para upload de imagens

---

## Licença

ISC
