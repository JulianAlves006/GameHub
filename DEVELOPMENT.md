# Configurações de Desenvolvimento - GameHub

## EditorConfig

O projeto está configurado com EditorConfig para manter consistência de formatação entre diferentes editores. As configurações incluem:

- Indentação: 2 espaços
- Fim de linha: LF
- Charset: UTF-8
- Remove espaços em branco no final das linhas
- Adiciona nova linha no final dos arquivos

## ESLint + Prettier

O projeto usa ESLint v9 com Prettier para formatação automática e correção de código.

### Formatação Automática

**O projeto está configurado para formatar automaticamente no save!**

- ✅ Aspas simples em vez de duplas
- ✅ Ponto e vírgula automático
- ✅ Indentação consistente (2 espaços)
- ✅ Quebras de linha automáticas
- ✅ Remoção de espaços em branco

### Scripts Disponíveis

```bash
# Lint em todo o projeto
npm run lint

# Lint e corrigir automaticamente
npm run lint:fix

# Formatar todo o projeto com Prettier
npm run format

# Verificar formatação sem alterar arquivos
npm run format:check

# Lint apenas no backend
npm run lint:backend

# Lint apenas no frontend
npm run lint:frontend

# Formatar apenas o backend
npm run format:backend

# Formatar apenas o frontend
npm run format:frontend

# Instalar todas as dependências
npm run install:all

# Executar backend em modo desenvolvimento
npm run dev:backend

# Executar frontend em modo desenvolvimento
npm run dev:frontend
```

### Configurações

- **Backend**: `backend/eslint.config.js` - Configurado para Node.js/TypeScript
- **Frontend**: `frontend/eslint.config.js` - Configurado para React/TypeScript
- **Projeto raiz**: `eslint.config.js` - Configuração geral

### Regras Principais

- Avisos para variáveis não utilizadas
- Avisos para uso de `any` (TypeScript)
- Avisos para `console.log` (apenas warnings)
- Erro para uso de `var` (preferir `const`/`let`)
- Erro para `prefer-const`

### Como Corrigir Problemas

1. Execute `npm run lint:fix` para correções automáticas
2. Para problemas que não podem ser corrigidos automaticamente, edite o código manualmente
3. Para desabilitar uma regra específica, use comentários ESLint:
   ```typescript
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const data: any = response;
   ```

## Estrutura do Projeto

```
GameHub/
├── backend/          # API Node.js + TypeScript
├── frontend/         # React + TypeScript + Vite
├── .editorconfig     # Configurações do EditorConfig
├── eslint.config.js  # Configuração ESLint do projeto raiz
└── package.json      # Scripts e dependências do projeto raiz
```
