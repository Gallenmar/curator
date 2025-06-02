import baseApi from "../../baseApi";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "owner" | "manager";
}

interface LoginResponse {
  user: User;
  token: string;
  token_type: string;
}

const authApi = {
  login: async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await baseApi<LoginResponse>(
      "POST",
      "/auth/token",
      {
        body: formData,
      },
      "formData"
    );
    return response.data;
  },
};

export default authApi;
