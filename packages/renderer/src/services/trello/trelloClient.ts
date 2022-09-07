import axios from 'axios';
import { TRELLO_API_URL, TRELLO_KEY } from './constants';

const trelloClient = axios.create({
  baseURL: TRELLO_API_URL,
  params: {
    key: TRELLO_KEY,
  },
});

export default trelloClient;
