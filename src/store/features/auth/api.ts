import baseApi from "../../baseApi"; // Adjust path as needed

// todo dry the types
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "owner" | "manager";
}

interface LoginResponse {
  user: User;
  token: string;
  token_type: string;
}

const authApi = {
  login: async (email: string, password: string) => {
    const response = await baseApi<LoginResponse>("POST", "/auth/token", {
      // todo pass email or username
      body: JSON.stringify({ username: email, password }),
    });
    return response.data;
  },
};

export default authApi;
