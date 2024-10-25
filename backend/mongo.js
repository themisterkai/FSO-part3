const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const name = process.argv[3];
const number = process.argv[4];

// if (name == null || number == null) {
//   console.log('name and number both required');
//   process.exit(1);
// }

const url = `mongodb+srv://kai:${password}@cluster0.lqyey.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
  name,
  number,
});

if (name == null || number == null) {
  console.log('phonebook:');

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else {
  person.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
