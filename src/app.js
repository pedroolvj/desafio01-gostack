const express = require("express");
const cors = require("cors");
const { v4: uuid_v4, validate: isUuid, validate } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter(repository => repository.title.includes(title))
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid_v4(),
    title,
    url,
    techs,
    likes: 0,
    usersliked: [],
  }

  repositories.push(repository)

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs, } =  request.body;


  const reposityIndex = repositories.findIndex(repository => repository.id === id);

  if(reposityIndex < 0) {
    return response.status(400).json({error: "Project not found!"})
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[reposityIndex].likes,
    usersliked: repositories[reposityIndex].usersliked,
  }

  repositories[reposityIndex] = repository;

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const reposityIndex = repositories.findIndex(repository => repository.id === id);

  if(reposityIndex < 0) {
    return response.status(400).json({error: "Project not found!"})
  }

  repositories.splice(reposityIndex, 1);

  return response.status(200).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const { url } = request.body;

  const reposityIndex = repositories.findIndex(repository => repository.id === id);

  if(reposityIndex < 0) {
    return response.status(400).json({error: "Project not found!"})
  }

  const userAlredyLiked = repositories[reposityIndex].usersliked.findIndex(liked => liked === url);

  if(userAlredyLiked >= 0) {
    return response.status(400).json({error: "User alredy liked this repo!"})
  }

  repositories[reposityIndex].likes++;
  repositories[reposityIndex].usersliked.push(url);

  return response.status(200).json(repositories[reposityIndex]);
});

module.exports = app;
