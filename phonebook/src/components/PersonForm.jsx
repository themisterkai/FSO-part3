const PersonForm = ({
  addNameHandler,
  newName,
  newPhone,
  nameOnChange,
  phoneOnChange,
}) => (
  <form onSubmit={addNameHandler}>
    <div>
      name: <input value={newName} onChange={nameOnChange} />
    </div>
    <div>
      phone: <input value={newPhone} onChange={phoneOnChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

export default PersonForm;
