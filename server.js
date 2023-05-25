const PORT = 8000;
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const API_KEY = process.env.API_KEY;
console.log(API_KEY);
const app = express();

app.use(express.json);
app.use(cors());

app.post('/completions', async (req, res) => {
  const options = {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'model': 'gpt-3.5-turbo',
      'messages': [{ 'role': 'user', 'content': 'how are you guys' }],
      max_tokens: 1000,
    }),
  };
  try {
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      options
    );
    const data = await response.json();
    res.send(data);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
});
app.listen(PORT, () => {
  console.log('Server is running on port :' + PORT);
});
