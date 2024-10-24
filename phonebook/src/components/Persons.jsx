const Persons = ({ persons, deletePersonHandler }) =>
  persons.map(person => (
    <div key={person.id}>
      {person.name} {person.number}
      <span>
        <button onClick={() => deletePersonHandler(person.id)}>delete</button>
      </span>
    </div>
  ));

export default Persons;
