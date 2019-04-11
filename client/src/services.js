import axios from 'axios';
import dotenv from'dotenv';
import {Facebook, FacebookApiException} from 'fb';
let config = dotenv.config();
let appid = process.env.REACT_APP_APP_ID;
let appsecret = process.env.REACT_APP_APP_SECRET;

const fb = new Facebook();
const options = fb.options({
  appId: appid,
  appSecret: appsecret,
  redirectUri: 'http://localhost:3000/'
});


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

export const updateUser =  async (token) => {
   const resp = await api.put('user', {headers: {Authorization: `Bearer ${token}`}});
   return resp;
}

export const getSavedGames = async (token) => {
  const resp = await api.get('savedgames', {headers: {Authorization: `Bearer ${token}`}});
  return resp;
}

export const saveGame = async (data, token) => {
  const resp = await api.post('savedgames', data, {headers: {Authorization: `Bearer ${token}`}});
  return resp;
}

export const reSaveGame = async (id, data, token) => {
  const resp = await api.put(`savedgames/${id}`, data, {headers: {Authorization: `Bearer ${token}`}});
  return resp;
}

export const getUserProPic = async (token) => {
  const resp = await api.get(`userspro`, {headers: {Authorization: `Bearer ${token}`}});
  return resp;
}
