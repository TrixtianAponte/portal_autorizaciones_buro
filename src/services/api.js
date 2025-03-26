import axios from "axios";

const API_URL = "http://localhost:5000";

export const sendOTP = async (email) => {
  return await axios.post(`${API_URL}/send-otp`, { email });
};

