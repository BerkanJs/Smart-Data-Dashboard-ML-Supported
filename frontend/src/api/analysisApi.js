import axios from "axios";

// API URL
const API_URL = "https://smart-data-dashboard-ml-supported-2.onrender.com/api/analysis";

// Segmentasyon analizi
export const getSegmentAnalysis = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/segment`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Anomali tespiti
export const getAnomalyDetection = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/anomaly`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
