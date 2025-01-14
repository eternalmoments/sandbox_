import axios from 'axios';

const API_ID = import.meta.env.VITE_ASTRONOMY_API_ID;
const API_SECRET = import.meta.env.VITE_ASTRONOMY_API_SECRET;
const BASE_URL = 'https://api.astronomyapi.com/api/v2';

const authString = btoa(`${API_ID}:${API_SECRET}`);

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Basic ${authString}`
  }
});

interface StarChartParams {
  date: string;
  latitude: number;
  longitude: number;
}

export const getStarChart = async ({ date, latitude, longitude }: StarChartParams) => {
  try {
    const response = await api.post('/studio/star-chart', {
      style: 'navy',
      observer: {
        latitude,
        longitude,
        date
      },
      view: {
        type: 'area',
        parameters: {
          position: {
            equatorial: {
              rightAscension: 0,
              declination: 0
            }
          },
          zoom: 2
        }
      }
    });

    // Safely extract the image URL from the response
    const imageUrl = response.data?.data?.imageUrl;
    if (!imageUrl) {
      throw new Error('No image URL in response');
    }

    return { data: { imageUrl } };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch star chart');
    }
    throw new Error('Failed to fetch star chart');
  }
};

export const getCelestialBodies = async (date: string) => {
  try {
    const response = await api.get('/bodies/positions', {
      params: {
        longitude: 0,
        latitude: 0,
        elevation: 0,
        from_date: date,
        to_date: date,
        time: '00:00:00'
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch celestial bodies');
    }
    throw new Error('Failed to fetch celestial bodies');
  }
};