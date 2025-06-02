interface RequestConfig extends RequestInit {
  baseURL?: string;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

async function baseApi<T>(
  method: string,
  endpoint: string,
  config: RequestConfig = {},
  requestType: "json" | "formData" = "json"
): Promise<ApiResponse<T>> {
  const { baseURL = BASE_URL, headers = {}, body, ...customConfig } = config;

  // Get auth token
  const token = localStorage.getItem("authToken");

  // Prepare headers
  const headersWithAuth = {
    "Content-Type":
      requestType === "json"
        ? "application/json"
        : "application/x-www-form-urlencoded",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  // Convert body to URLSearchParams if it exists
  let formBody: string | undefined;
  if (body && requestType === "formData") {
    if (body instanceof URLSearchParams) {
      formBody = body.toString();
    } else if (typeof body === "object") {
      const formData = new URLSearchParams();
      Object.entries(body).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      formBody = formData.toString();
    }
  }

  // Prepare request config
  const requestConfig: RequestInit = {
    ...customConfig,
    headers: headersWithAuth,
    body: formBody,
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
