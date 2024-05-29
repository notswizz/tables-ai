import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const tools = [
  {
    type: "function",
    function: {
      name: "apiRequest",
      description: "Make an API request to manage data",
      parameters: {
        type: "object",
        properties: {
          method: {
            type: "string",
            enum: ["GET", "PUT", "POST"],
            description: "The HTTP method to use",
          },
          url: {
            type: "string",
            description: "The API endpoint",
          },
          data: {
            type: "object",
            description: "The data to send with the request (for PUT and POST)",
            properties: {
              company: {
                type: "string",
                description: "The company name",
              },
              website: {
                type: "string",
                description: "The company website",
              },
              phone: {
                type: "string",
                description: "The company phone number",
              },
              email: {
                type: "string",
                description: "The company email",
              },
              contact: {
                type: "string",
                description: "The company contact person",
              },
            },
          },
        },
        required: ["method", "url"],
      },
    },
  },
];

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { threadId, content } = req.body;
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content }],
        tools,
        tool_choice: "auto",
      });

      console.log('OpenAI API response:', JSON.stringify(response, null, 2));

      const messageContent = response.choices[0].message.content;
      const toolCalls = response.choices[0].message.tool_calls;
      res.status(200).json({ status: "Message added", messageContent, toolCalls });
    } catch (error) {
      console.error('Error adding message:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
