import axios from 'axios';


interface StarChartParams {
  date: string;
  latitude: number;
  longitude: number;
}



export const getStarChart = async ({ date, latitude, longitude }: StarChartParams) => {
  console.log("LOGANDO API",import.meta.env.VITE_BASE_URL_API);
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL_API}star_chart/star-chart`,
    { date, latitude, longitude }
  );
  return response.data;
};

export const getCelestialBodies = async (date: string) => {
  const response = await axios.get(`/star_chart/celestial-bodies?date=${date}`);
  return response.data;
};
