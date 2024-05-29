import OpenAI from "openai";
import axios from 'axios';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { threadId } = req.body;

      // Attempt to create a new run directly
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: process.env.ASSISTANT_ID,
      });

      console.log('Run created:', JSON.stringify(run, null, 2));

      if (run.required_action && run.required_action.submit_tool_outputs) {
        const toolOutputs = await Promise.all(
          run.required_action.submit_tool_outputs.tool_calls.map(async (toolCall) => {
            const { method, url, data } = JSON.parse(toolCall.function.arguments);
            let response;

            try {
              if (method === "POST") {
                response = await axios.post(url, data);
              } else if (method === "PUT") {
                response = await axios.put(url, data);
              } else if (method === "GET") {
                response = await axios.get(url);
              }

              console.log(`Response from ${method} request:`, response.data);

              return {
                tool_call_id: toolCall.id,
                output: JSON.stringify(response.data),
              };
            } catch (error) {
              console.error(`Error making ${method} request:`, error);
              return {
                tool_call_id: toolCall.id,
                output: JSON.stringify({ error: error.message }),
              };
            }
          })
        );

        await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
          tool_outputs: toolOutputs,
        });
      }

      const botMessage = (run.messages && run.messages.length > 0)
        ? run.messages[0].content
        : 'No response from bot';

      console.log('Bot message:', botMessage);

      res.status(200).json({ text: botMessage });
    } catch (error) {
      console.error('Error creating run:', error.response ? error.response.data : error.message);
      res.status(500).json({ message: 'Internal Server Error', error: error.response ? error.response.data : error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
