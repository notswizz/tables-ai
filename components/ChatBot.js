import { useState } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [threadId, setThreadId] = useState('');

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    if (!threadId) {
      try {
        const threadResponse = await axios.post('/api/startThread');
        console.log('Thread response:', threadResponse.data);
        setThreadId(threadResponse.data.threadId);
      } catch (error) {
        console.error('Error starting thread:', error);
        setMessages([...messages, { sender: 'bot', text: 'Error starting thread. Please try again.' }]);
        return;
      }
    }

    try {
      const messageResponse = await axios.post('/api/addMessage', {
        threadId,
        content: input,
      });

      console.log('Message response:', messageResponse.data);
      const assistantMessageContent = messageResponse.data.messageContent;
      const botMessageFromAssistant = { sender: 'bot', text: assistantMessageContent };

      // Process tool calls if needed
      const toolCalls = messageResponse.data.toolCalls;

      const runResponse = await axios.post('/api/createRun', {
        threadId,
      });

      console.log('Run response:', runResponse.data);

      if (runResponse.data.message === 'Thread already has an active run.') {
        setMessages([...messages, userMessage, botMessageFromAssistant, { sender: 'bot', text: 'The thread is already processing a request. Please wait.' }]);
      } else {
        const assistantMessageFromRun = runResponse.data.text;
        const botMessageFromRun = { sender: 'bot', text: assistantMessageFromRun };

        setMessages([...messages, userMessage, botMessageFromAssistant, botMessageFromRun]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...messages, userMessage, { sender: 'bot', text: 'Error processing request. Please try again.' }]);
    }

    setInput('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-lg bg-gray-50">
      <div className="h-96 overflow-y-auto mb-4 p-4 bg-white border rounded-lg">
        {messages.map((msg, index) => (
          <div key={index} className={`p-3 my-2 rounded-lg ${msg.sender === 'user' ? 'bg-green-200 text-right' : 'bg-gray-200'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 p-3 border rounded-l-lg focus:outline-none"
        />
        <button onClick={handleSend} className="p-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-700">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
