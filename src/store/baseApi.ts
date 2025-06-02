interface RequestConfig extends RequestInit {
  baseURL?: string;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

// todo add env variable
const BASE_URL = import.meta.env.VITE_BASE_URL;

async function baseApi<T>(
  method: string,
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const { baseURL = BASE_URL, headers = {}, ...customConfig } = config;

  // Get auth token
  const token = localStorage.getItem("authToken");

  // Prepare headers
  const headersWithAuth = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  // Prepare request config
  const requestConfig: RequestInit = {
    ...customConfig,
    headers: headersWithAuth,
  };

  const response = await fetch(`${baseURL}${endpoint}`, {
    ...requestConfig,
    method: method,
  });
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      console.error("Unauthorized: Please log in again.");
      // Optionally dispatch a logout action here if using Redux-Thunk/Saga
      // store.dispatch(logout());
    }
    throw new Error(data.message || "Something went wrong");
  }

  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };
}

export default baseApi;
