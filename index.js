const express = require('express');
const app = express();

app.use(express.json());

const projects = [];
let count = 0;

// Middlewares
app.use((request, reponse, next) => {
  count++;
  
  if (count > 1) {
    console.log(`Já foram realizadas ${count} requisições`);
  } else {
    console.log(`Já foi realizada ${count} requisição`);
  }

  next();
});

function checkProjectExists(request, response, next) {
  const { id } = request.params;
  const projectExists = projects.some((project) => {
    return project.id == id;
  });
  
  if (!projectExists) {
    return response.status(400).json({"message": "Projeto não encontrado."});
  }

  return next();
}

// Helper function
function getIndexByProject(id) {
  let index;

  projects.forEach((project, i) => {
    if (project.id == id) {
      index = i;
    }
  });

  return index;
}

app.post('/projects', (request, response) => {
  const { id, title } = request.body;

  projects.push({id: id, title: title, tasks: []});

  return response.json(projects);
});

app.get('/projects', (request, response) => {
  return response.json(projects);
});

app.put('/projects/:id', checkProjectExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;
  const index = getIndexByProject(id); 
  
  projects[index].title = title;

  return response.json(projects);
});

app.delete('/projects/:id', checkProjectExists, (request, response) => {
  const { id } = request.params;
  const index = getIndexByProject(id);

  projects.splice(index, 1);

  return response.json(projects);
});

app.post('/projects/:id/tasks', checkProjectExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;
  const index = getIndexByProject(id);

  projects[index].tasks.push(title);

  return response.json(projects);
});

app.listen(3000);