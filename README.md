# API RESTful de Gerenciamento de Usuários - Segurança da Informação

LUIS FELIPE FACHINI E MAX MAUL

Este projeto implementa uma API RESTful para gerenciamento de usuários, com foco em segurança da informação. O projeto inclui duas versões no mesmo repositório:

- **Versão 1.0**: Vulnerável a ataques comuns como SQL/NoSQL Injection, XSS e CSRF
- **Versão 2.0**: Versão segura com proteções implementadas contra esses ataques

## Requisitos

- Node.js (v14 ou superior)
- MongoDB (local ou MongoDB Atlas)
- NPM ou Yarn

## Instalação

1. Clone este repositório:
```bash
git clone https://github.com/seu-usuario/projeto-n2-seguranca.git
cd projeto-n2-seguranca
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
MONGODB_URI=mongodb://localhost:27017/seguranca-api
PORT=3000
JWT_SECRET=sua_chave_secreta_jwt_aqui_mude_para_producao
NODE_ENV=development
```

## Executando a Aplicação

```bash
# Iniciar o servidor
npm start
# ou 
npm run dev  # com nodemon para desenvolvimento
```

O servidor estará rodando em `http://localhost:3000` e as APIs estarão disponíveis nos seguintes endpoints:

- API Vulnerável: `http://localhost:3000/api/v1`
- API Segura: `http://localhost:3000/api/v2`

## Estrutura do Projeto

```
projeto-n2/
├── src/
│   ├── v1-vulneravel/               # Versão 1.0 (Vulnerável)
│   │   ├── controllers/
│   │   │   └── userController.js
│   │   ├── routes/
│   │   │   └── users.js
│   │   └── app.js
│   │
│   ├── v2-segura/                   # Versão 2.0 (Segura)
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── validation.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── users.js
│   │   └── app.js
│   │
│   ├── config/                     # Configurações compartilhadas
│   │   └── database.js
│   │
│   └── models/                     # Modelos compartilhados
│       └── User.js
│
├── tests/                          # Testes de penetração
│   ├── pentest-injection.js
│   ├── pentest-xss.js
│   └── pentest-csrf.html
│
├── app.js                          # Ponto de entrada principal
├── package.json
├── .env
└── .gitignore
```

## Endpoints da API

### Versão 1.0 (Vulnerável)

#### Usuários
- `GET /api/v1/users` - Listar todos os usuários
- `GET /api/v1/users/:id` - Obter um usuário por ID
- `POST /api/v1/users` - Criar um novo usuário
- `PUT /api/v1/users/:id` - Atualizar um usuário
- `DELETE /api/v1/users/:id` - Excluir um usuário
- `POST /api/v1/login` - Login de usuário (vulnerável)

### Versão 2.0 (Segura)

#### Autenticação
- `POST /api/v2/auth/register` - Registrar um novo usuário
- `POST /api/v2/auth/login` - Login de usuário (seguro, retorna JWT)

#### Usuários
- `GET /api/v2/users` - Listar todos os usuários
- `GET /api/v2/users/:id` - Obter um usuário por ID
- `PUT /api/v2/users/:id` - Atualizar um usuário (requer autenticação)
- `DELETE /api/v2/users/:id` - Excluir um usuário (requer autenticação)

## Exemplos de Requisições (Postman)

### Versão 1.0 (Vulnerável)

#### Criar Usuário
```
POST /api/v1/users
Content-Type: application/json

{
  "username": "usuario_teste",
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

#### Login (Vulnerável)
```
POST /api/v1/login
Content-Type: application/json

{
  "username": "usuario_teste",
  "password": "senha123"
}
```

#### Login com NoSQL Injection (Bypass de Autenticação)
```
POST /api/v1/login
Content-Type: application/json

{
  "username": {"$gt": ""},
  "password": {"$gt": ""}
}
```

### Versão 2.0 (Segura)

#### Registrar Usuário
```
POST /api/v2/auth/register
Content-Type: application/json

{
  "username": "usuario_seguro",
  "email": "seguro@exemplo.com",
  "password": "Senha@123"
}
```

#### Login (Seguro)
```
POST /api/v2/auth/login
Content-Type: application/json

{
  "username": "usuario_seguro",
  "password": "Senha@123"
}
```

#### Atualizar Usuário (Com Autenticação)
```
PUT /api/v2/users/:id
Content-Type: application/json
Authorization: Bearer seu_token_jwt_aqui
X-CSRF-Token: seu_token_csrf_aqui

{
  "email": "novo_email@exemplo.com"
}
```

## Testes de Penetração

O projeto inclui scripts para testar as vulnerabilidades da versão 1.0:

### SQL/NoSQL Injection
```bash
node tests/pentest-injection.js
```

### Cross-Site Scripting (XSS)
```bash
node tests/pentest-xss.js
```

### Cross-Site Request Forgery (CSRF)
Abra o arquivo `tests/pentest-csrf.html` em um navegador enquanto estiver logado na aplicação.

## Vulnerabilidades e Correções

### SQL/NoSQL Injection
- **Vulnerabilidade**: Consultas diretas ao banco de dados sem sanitização
- **Correção**: Uso de consultas parametrizadas e validação de entrada

### Cross-Site Scripting (XSS)
- **Vulnerabilidade**: Dados de entrada não sanitizados são renderizados no cliente
- **Correção**: Sanitização de entrada, uso do middleware `xss-clean`, cabeçalhos CSP

### Cross-Site Request Forgery (CSRF)
- **Vulnerabilidade**: Ausência de tokens CSRF para validar requisições
- **Correção**: Implementação de tokens CSRF e validação em rotas sensíveis

## Segurança Adicional na Versão 2.0

1. **Autenticação JWT**: Implementação de JSON Web Tokens para autenticação segura
2. **Proteção de Rotas**: Middleware de autenticação para proteger rotas sensíveis
3. **Criptografia de Senhas**: Uso de bcrypt para hash e salt de senhas
4. **Validação de Entrada**: Validação e sanitização de todos os dados de entrada
5. **Cabeçalhos de Segurança**: Uso do Helmet para configurar cabeçalhos HTTP de segurança
6. **Limitação de Taxa**: Proteção contra ataques de força bruta
7. **Tokens CSRF**: Proteção contra ataques CSRF em rotas sensíveis

---

Projeto desenvolvido para a disciplina de Segurança da Informação (N2) - Prof. Claudinei Dias (Ney).