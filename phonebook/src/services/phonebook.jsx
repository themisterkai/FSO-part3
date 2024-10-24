import axios from 'axios';
const baseUrl = '/api/persons';

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(resp => resp.data);
};

const addPerson = newPerson => {
  const request = axios.post(baseUrl, newPerson);
  return request.then(resp => resp.data);
};

const deletePerson = id => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then(resp => resp.data);
};

const updatePerson = (id, newPerson) => {
  const request = axios.put(`${baseUrl}/${id}`, newPerson);
  return request.then(resp => resp.data);
};

export default { getAll, addPerson, deletePerson, updatePerson };
