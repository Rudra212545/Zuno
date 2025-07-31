import axios from 'axios';

export const sendMessage = async (channelId, content, token) => {
  const response = await axios.post(
    `http://localhost:3000/api/v1/messages/${channelId}`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
