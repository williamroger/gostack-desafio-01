const express = require('express');
const app = express();

app.use(express.json());

const projects = [];
let count = 0;

/**
 * Middleware que exibe um log do número de requisições
 */
app.use((request, reponse, next) => {
  count++;

  if (count > 1) {
    console.log(`Já foram realizadas ${count} requisições`);
  } else {
    console.log(`Já foi realizada ${count} requisição`);
  }

  next();
});

/**
 * Middleware que checa se o projeto existe
 */
function checkProjectExists(request, response, next) {
  const { id } = request.params;
  const projectExists = projects.some((project) => {
    return project.id == id;
  });
  
  if (!projectExists) {
    return response.status(400).json({message: "Projeto não encontrado."});
  }

  return next();
}

/**
 * Função que retorna o index de um projeto no array projects
 */
function getIndexByProject(id) {
  let index;

  projects.forEach((project, i) => {
    if (project.id == id) {
      index = i;
    }
  });

  return index;
}

/**
 * Request body: id, title
 * Cadastra um novo projeto
 */
app.post('/projects', (request, response) => {
  const { id, title } = request.body;

  projects.push({id: id, title: title, tasks: []});

  return response.json(projects);
});

/**
 * Retorna todos os projetos cadastrados
 */
app.get('/projects', (request, response) => {
  return response.json(projects);
});

/**
 * Route params: id
 * Request body: title
 * Altera o título do projeto com o id informado no parâmetro da rota
 */
app.put('/projects/:id', checkProjectExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;
  const index = getIndexByProject(id); 
  
  projects[index].title = title;

  return response.json(projects);
});

/**
 * Route params: id
 * Deleta um projeto com o id informado no parâmetro da rota
 */
app.delete('/projects/:id', checkProjectExists, (request, response) => {
  const { id } = request.params;
  const index = getIndexByProject(id);

  projects.splice(index, 1);

  return response.json(projects);
});

/**
 * Route params: id
 * Request body: title
 * Adiciona uma nova tarefa no projeto com o id informado no parâmetro da rota
 */
app.post('/projects/:id/tasks', checkProjectExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;
  const index = getIndexByProject(id);

  projects[index].tasks.push(title);

  return response.json(projects);
});

app.listen(3000);