// pages/api/chat.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Ensure this is the correct model you intend to use
      messages: [
        {
          role: 'system',
          content: prompt,
        },
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log('OpenAI API response:', response);
    console.log('Message object:', response.choices[0].message);

    // Extracting the content from the message object
    if (response && response.choices && response.choices.length > 0) {
      const messageContent = response.choices[0].message.content;
      res.status(200).json({ text: messageContent.trim() });
    } else {
      console.error('Unexpected response format:', response);
      res.status(500).json({ message: 'Unexpected response format from OpenAI API' });
    }
  } catch (error) {
    console.error('Error with OpenAI API:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error with OpenAI API' });
  }
}
