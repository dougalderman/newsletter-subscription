import axios from 'axios';

export const getAnalytics = async () => {
  const data = await axios.get('/api/analytics');
  return data;
}

