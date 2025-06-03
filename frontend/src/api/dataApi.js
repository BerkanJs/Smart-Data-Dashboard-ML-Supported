import axios from "axios";

// API URL
const API_URL = "https://smart-data-dashboard-ml-supported.onrender.com/api/data";

// Veri yükleme
export const uploadData = async (data, token) => {
  try {
    const response = await axios.post(`${API_URL}/upload`, data, {
      headers: {
        Authorization: `Bearer ${token}`, // Token ile yetkilendirme
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
