//Author: Enzo HoLeung Kwan

import axios from 'axios';
// import { AZURE_KEY } from '@env';
import keyForPjt from './keyForPjt';

const apiUrl = 'https://tdp-api.azure-api.net/manual/paths/invoke';

const key = keyForPjt.azureKey();

const headers = {
  'Content-Type': 'application/json',
  'Ocp-Apim-Subscription-Key': key,
};

export function sendJsonData(jsonData) {
  return axios.post(apiUrl, jsonData, { headers });
}
