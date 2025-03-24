import axios from 'axios';


interface StarChartParams {
  date: string;
  latitude: number;
  longitude: number;
}

export const getStarChart = async ({ date, latitude, longitude }: StarChartParams) => {
  const response = await axios.post('/star_chart/star-chart', { date, latitude, longitude });
  console.log(response);
  
  return response.data;
};

export const getCelestialBodies = async (date: string) => {
  const response = await axios.get(`/star_chart/celestial-bodies?date=${date}`);
  return response.data;
};
