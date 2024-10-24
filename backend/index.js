const express = require('express');
const app = express();
const morgan = require('morgan');

let phonebook = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

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

// generate IDs of length 4
const generateShortID = () => {
  const idLength = 4;
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < idLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

app.get('/', (req, res) => {
  res.send('<h1>Hello!</h1>');
});

app.get('/info', (req, res) => {
  res.send(
    `Phone book has info for ${
      phonebook.length
    } people <br><br>${getFormattedDate()}`
  );
});

app.get('/api/persons', (req, res) => {
  res.json(phonebook);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = phonebook.find(person => person.id === id);
  if (person != null) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  phonebook = phonebook.filter(person => person.id !== id);
  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name and number required',
    });
  }

  const existingPerson = phonebook.find(
    person => person.name.toLowerCase() === body.name.toLowerCase()
  );

  if (existingPerson) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }
  const person = {
    id: generateShortID(),
    name: body.name,
    number: body.number,
  };
  phonebook = phonebook.concat(person);
  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
