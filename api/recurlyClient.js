// recurlyClient.js
import recurly from 'recurly';
import dotenv from 'dotenv';

dotenv.config();

const client = new recurly.Client(
  process.env.RECURLY_API_KEY
);

export default client;
