import axios from "axios";

// API URL
const API_URL = "https://smart-data-dashboard-ml-supported.onrender.com/api/user";

// Kullanıcı profili
export const getProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`, // Token ile yetkilendirme
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
