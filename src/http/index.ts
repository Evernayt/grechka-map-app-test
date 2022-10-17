import axios from 'axios';
import { SERVER_API_URL } from '../constants/api';

const $host = axios.create({
  baseURL: SERVER_API_URL,
});

export { $host };
