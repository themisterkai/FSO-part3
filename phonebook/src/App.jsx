import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';
import phonebook from './services/phonebook';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    phonebook.getAll().then(data => setPersons(data));
  }, [errorMessage]);

  const addNameHandler = e => {
    e.preventDefault();

    if (newName === '' || newPhone === '') {
      alert('please enter a valid name or phone number');
      return;
    }
    const newPerson = { name: newName, number: newPhone };

    const existingPerson = persons.find(
      person => person.name.toLowerCase() === newName.toLowerCase()
    );

    // Case where the person doesn't already exist in the phonebook
    // we add the person
    if (existingPerson == null) {
      phonebook
        .addPerson(newPerson)
        .then(data => setPersons([...persons, data]));
      setNewName('');
      setNewPhone('');

      setMessage(`Added ${newName}`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } else {
      // For cases where the person is already in the phonebook, we ask the user
      // for confirmation if they want to update the person's record
      const userConfirmed = confirm(
        `${newName} is already added to the phonebook, replace the old number with new one?`
      );
      // return if the user doesn't want to replace the current record
      if (!userConfirmed) {
        return;
      }
      // Update the person's record if the user confirms.
      phonebook
        .updatePerson(existingPerson.id, newPerson)
        .then(data =>
          setPersons(
            persons.map(person => (person.id === data.id ? data : person))
          )
        )
        .catch(error => {
          setErrorMessage(
            `Information of ${newName} has already been removed from the server`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
      setNewName('');
      setNewPhone('');
    }
  };

  const deletePerson = id => {
    phonebook.deletePerson(id).then(data => {
      console.log('in delete', data);
      const afterDelete = persons.filter(person => person.id !== id);
      setPersons(afterDelete);
    });
  };

  const filteredList =
    filter === ''
      ? persons
      : persons.filter(person =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Notification message={errorMessage} isError />
      <Filter value={filter} onChange={e => setFilter(e.target.value)} />
      <h2>add a new</h2>
      <PersonForm
        addNameHandler={addNameHandler}
        newName={newName}
        newPhone={newPhone}
        nameOnChange={e => setNewName(e.target.value)}
        phoneOnChange={e => setNewPhone(e.target.value)}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredList} deletePersonHandler={deletePerson} />
    </div>
  );
};

export default App;
