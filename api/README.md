# API Express - CRUD para Usuários e Vagas

Este projeto é uma API RESTful criada com Node.js, Express e Sequelize que implementa operações CRUD (Create, Read, Update, Delete) para as entidades "Usuários" e "Vagas". O banco de dados utilizado é o SQLite.

## Tecnologias Utilizadas
- Node.js
- Express
- Sequelize
- SQLite
- Body-parser
- UUID para geração de IDs únicos

## Estrutura do Projeto

- `server.js` - Arquivo principal da aplicação que inicia o servidor.
- `config/database.js` - Configuração do Sequelize e do banco de dados SQLite.
- `routes/usuarios.js` - Rotas para o CRUD de Usuários.
- `routes/vagas.js` - Rotas para o CRUD de Vagas.

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/JefersonQueiroga/api-express.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## Uso

### Executar o Servidor
Para iniciar o servidor em modo de desenvolvimento com o `nodemon`:
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`.

### Endpoints da API

#### Usuários

- **GET /api/usuarios** - Lista todos os usuários.
- **POST /api/usuarios** - Cria um novo usuário.
- **GET /api/usuarios/:id** - Retorna um usuário específico.
- **PUT /api/usuarios/:id** - Atualiza as informações de um usuário.
- **DELETE /api/usuarios/:id** - Deleta um usuário.

#### Vagas

- **GET /api/vagas** - Lista todas as vagas.
- **POST /api/vagas** - Cria uma nova vaga.
- **GET /api/vagas/:id** - Retorna uma vaga específica.
- **PUT /api/vagas/:id** - Atualiza as informações de uma vaga.
- **DELETE /api/vagas/:id** - Deleta uma vaga.

## Sincronização com o Banco de Dados

A sincronização do banco de dados com o Sequelize é feita automaticamente ao iniciar a aplicação:
```javascript
sequelize.sync().then(() => {
  console.log('Database synchronized');
}).catch(err => {
  console.error('Unable to synchronize the database:', err);
});
```

## Configurações do Projeto

Para alterar a porta da aplicação, ajuste a variável `PORT` no ambiente ou modifique diretamente o código:
```javascript
const PORT = process.env.PORT || 3000;
```

## Contribuição

Sinta-se à vontade para abrir issues ou pull requests para melhorias.



