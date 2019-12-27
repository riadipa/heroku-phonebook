const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");

app.use(bodyParser.json());

morgan.token("body", function(req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(express.static("build"));

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  console.log("person", person);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  var dateTime = new Date();
  const totalId = Math.max(...persons.map(p => p.id));
  console.log("totalId", totalId);
  return response.send(
    `Phonebook has info for ${totalId} people` + "<br/>" + dateTime
  );
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log("body name: ", body.name);
  console.log("person name: ", persons);

  if (!body.name) {
    return response.status(400).json({
      error: "name is not present"
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number is not present"
    });
  }

  const existingPerson = persons.filter(
    person => person.name.toUpperCase() === body.name.toUpperCase()
  );
  console.log("existing Persons name: ", existingPerson);

  if (existingPerson.length === 1) {
    return response.status(400).json({
      error: "name must be unique"
    });
  }

  const personObj = {
    name: body.name,
    number: body.number,
    id: generateId()
  };

  persons = persons.concat(personObj);

  response.json(personObj);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
