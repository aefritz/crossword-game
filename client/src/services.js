import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/'
});

export const createUser = async (token) => {
   const resp = await api.post('user', {}, {headers: {Authorization: `Bearer ${token}`}});
   return resp;
}

export const getUser = async (token) => {
   const resp = await api.get('user', {headers: {Authorization: `Bearer ${token}`}});
   return resp;
}
