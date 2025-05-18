import { useState } from "react";
import { Save, User, Mail, Lock, AlertTriangle } from "lucide-react";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../contexts/AuthContext";

const AccountSettings = () => {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setMessage({
        type: "success",
        text: "Profile information updated successfully!",
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }, 1000);
  };

  // Handle password update
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: "error",
        text: "New passwords do not match.",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters long.",
      });
      return;
    }

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setMessage({
        type: "success",
        text: "Password updated successfully!",
      });

      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }, 1000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Account Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information and security settings
          </p>
        </div>

        {/* Notification message */}
        {message.text && (
          <div
            className={`p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300"
                : "bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                {message.type === "success" ? (
                  <Save className="h-5 w-5 text-green-400 dark:text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-400 dark:text-red-500" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <Card
            title="Profile Information"
            description="Update your personal details"
          >
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <Input
                id="name"
                name="name"
                label="Full Name"
                value={profileData.name}
                onChange={handleProfileChange}
                leftIcon={<User className="h-5 w-5 text-gray-400" />}
              />

              <Input
                id="email"
                name="email"
                label="Email Address"
                type="email"
                value={profileData.email}
                onChange={handleProfileChange}
                leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  isLoading={isSaving}
                  leftIcon={<Save className="h-4 w-4" />}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Security Settings */}
          <Card title="Security Settings" description="Update your password">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                id="currentPassword"
                name="currentPassword"
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
              />

              <Input
                id="newPassword"
                name="newPassword"
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                helperText="Password must be at least 8 characters long"
                leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
              />

              <Input
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  isLoading={isSaving}
                  leftIcon={<Save className="h-4 w-4" />}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AccountSettings;
