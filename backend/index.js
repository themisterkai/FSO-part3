const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config();
const Person = require('./models/person');

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(express.json());
morgan.token('body', request => JSON.stringify(request.body));
app.use(express.static('dist'));

const getFormattedDate = () => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', options);

  // Calculate timezone offset in hours
  const timezoneOffset = -date.getTimezoneOffset() / 60;
  const timezoneString = `GMT${
    timezoneOffset >= 0 ? '+' : ''
  }${timezoneOffset} (European Standard Time)`;

  return `${formattedDate}, ${timezoneString}`;
};

app.get('/', (req, res, next) => {
  res.send('<h1>Hello!</h1>');
});

app.get('/info', (req, res, next) => {
  res.send(
    `Phone book has info for ${'phonebook.length'} people <br><br>${getFormattedDate()}`
  );
});

app.get('/api/persons', (req, res, next) => {
  // res.json(phonebook);
  Person.find({})
    .then(notes => {
      res.json(notes);
    })
    .catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person != null) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;
  const { name, number } = body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name and number required',
    });
  }

  const person = new Person({
    name,
    number,
  });

  person
    .save()
    .then(savedPerson => res.send(savedPerson))
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => res.status(204).end())
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => res.json(updatedPerson))
    .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
