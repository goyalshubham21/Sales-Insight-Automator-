import axios from "axios";

const resolveApiBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/api`;
  }

  return "http://localhost:5000/api";
};

const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: 30000
});

export const uploadSalesFile = async ({ file, email }) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("email", email);

  const response = await apiClient.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
};

export const sendSummaryEmail = async ({ email, summary, uploadId }) => {
  const response = await apiClient.post("/send-email", {
    email,
    summary,
    uploadId
  });

  return response.data;
};

export default apiClient;
