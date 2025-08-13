# GameHub

Sistema de gerenciamento de campeonatos e jogadores desenvolvido com Node.js, Express, TypeScript e TypeORM.

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

#### 3.1. Acesse o MySQL
```bash
mysql -u root -p
```

#### 3.2. Crie o banco de dados com o arquivo: database/gameHubDB.sql

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
NODE_ENV=development
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
{"hello":"world"}
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

# Executar linter
npm run lint

# Corrigir problemas do linter automaticamente
npm run lint:fix

# Executar testes (quando implementados)
npm test
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

## 🐛 Solução de Problemas

### Erro: "Database connection failed"

1. Verifique se o MySQL está rodando:
   ```bash
   # No Windows
   net start mysql80
   
   # No macOS (usando Homebrew)
   brew services start mysql
   
   # No Linux
   sudo systemctl start mysql
   ```

2. Verifique as credenciais no arquivo `.env`
3. Teste a conexão manual:
   ```bash
   mysql -h localhost -u root -p gameHubDB
   ```

### Erro: "Cannot find module"

1. Reinstale as dependências:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Erro: "Port 3333 already in use"

1. Mate o processo que está usando a porta:
   ```bash
   # Encontre o processo
   lsof -i :3333
   
   # Mate o processo (substitua PID pelo número encontrado)
   kill -9 PID
   ```

2. Ou altere a porta no arquivo `.env`:
   ```env
   PORT=3334
   ```

### Erro de TypeScript

1. Verifique se todas as dependências estão instaladas:
   ```bash
   npm install
   ```

2. Limpe o cache do TypeScript:
   ```bash
   npx tsc --build --clean
   ```

## 🔧 Configurações Avançadas

### Desabilitar sincronização automática (Produção)

No arquivo `src/data-source.ts`, altere:
```typescript
synchronize: false,  // Era true
```

### Habilitar logs do banco

No arquivo `src/data-source.ts`, altere:
```typescript
logging: true,  // Era false
```

## 📝 Próximos Passos

1. **Implementar autenticação** - JWT/Sessions
2. **Criar endpoints da API** - CRUD para todas as entidades
3. **Adicionar validações** - Usar bibliotecas como Joi ou Yup
4. **Implementar testes** - Jest/Mocha
5. **Adicionar documentação da API** - Swagger
6. **Deploy** - Docker/Heroku/AWS

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Se encontrar problemas:

1. Verifique a seção [Solução de Problemas](#-solução-de-problemas)
2. Abra uma [issue](https://github.com/seu-usuario/GameHub/issues)
3. Entre em contato: seu-email@email.com

---

**Desenvolvido com ❤️ usando Node.js, Express, TypeScript e TypeORM**
