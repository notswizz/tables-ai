const tools = [
  {
    "type": "function",
    "function": {
      "name": "sendPostRequest",
      "description": "Send a POST request to a specified URL with given data",
      "parameters": {
        "type": "object",
        "properties": {
          "url": { "type": "string", "description": "The URL to send the POST request to" },
          "data": { "type": "object", "description": "The data to send in the POST request" },
        },
        "required": ["url", "data"],
      },
    },
  },
  {
    "type": "function",
    "function": {
      "name": "sendPutRequest",
      "description": "Send a PUT request to a specified URL with given data",
      "parameters": {
        "type": "object",
        "properties": {
          "url": { "type": "string", "description": "The URL to send the PUT request to" },
          "data": { "type": "object", "description": "The data to send in the PUT request" },
        },
        "required": ["url", "data"],
      },
    },
  },
  {
    "type": "function",
    "function": {
      "name": "sendGetRequest",
      "description": "Send a GET request to a specified URL",
      "parameters": {
        "type": "object",
        "properties": {
          "url": { "type": "string", "description": "The URL to send the GET request to" },
        },
        "required": ["url"],
      },
    },
  },
];
