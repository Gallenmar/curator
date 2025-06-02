import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Droplet, User, Lock } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../contexts/AuthContext";
import RelativeSwitcher from "../components/languageSwitcher/RelativeSwitcher.tsx";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const loggedInUser = await login(username, password);
      if (loggedInUser) {
        if (loggedInUser.role === "user") {
          navigate("/user");
        } else if (loggedInUser.role === "manager") {
          navigate("/manager");
        } else {
          navigate("/");
        }
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 bg-blue-600 dark:bg-blue-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-white rounded-full">
                  <Droplet className="h-7 w-7 text-blue-600" />
                </div>
              </div>
              <RelativeSwitcher collapsed={false} />
            </div>
            <h1 className="text-2xl font-bold text-center text-white">
              WaterMeter Manager
            </h1>
            <p className="mt-2 text-center text-blue-200">
              Track and manage your water consumption
            </p>
          </div>

          {/* Login Form */}
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Enter your credentials to access your dashboard
            </p>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <Input
                id="username"
                type="text"
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                leftIcon={<User className="h-5 w-5 text-gray-400" />}
                autoComplete="username"
              />

              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>

                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Forgot password?
                </a>
              </div>

              <Button type="submit" fullWidth isLoading={isLoading}>
                Sign in
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Demo credentials:
              </p>
              <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-500">
                <p>User: user / user123</p>
                <p>Manager: manager / manager123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
