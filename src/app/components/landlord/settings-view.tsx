import { useEffect, useState } from "react";
import {
  Bell,
  Building2,
  Loader2,
  Lock,
  Save,
  User,
} from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import {
  useSetNewPassword,
  useUpdateProfile,
} from "../../hooks/useSettings";

import { useAuth } from "../../context/AuthContext";

export function SettingsView() {
  const { user } = useAuth();

  const updateProfileMutation = useUpdateProfile();
  const setPasswordMutation = useSetNewPassword();

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    paymentReminders: true,
    maintenanceAlerts: true,
    reportSummaries: true,
  });

  // Populate form with logged in user details
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async (
      e: React.FormEvent,
  ) => {
    e.preventDefault();

    try {
      await updateProfileMutation.mutateAsync({
        fullName: profileData.fullName,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber,
      });

      alert("Profile updated successfully!");
    } catch (error: any) {
      alert(
          error?.response?.data?.message ||
          "Failed to update profile",
      );
    }
  };

  const handlePasswordUpdate = async (
      e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (
        passwordData.newPassword !==
        passwordData.confirmPassword
    ) {
      alert("New passwords do not match!");
      return;
    }

    try {
      await setPasswordMutation.mutateAsync({
        currentPassword:
        passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      alert("Password updated successfully!");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      alert(
          error?.response?.data?.message ||
          "Failed to update password",
      );
    }
  };

  const handleNotificationUpdate = (
      e: React.FormEvent,
  ) => {
    e.preventDefault();

    console.log(
        "Notification settings updated:",
        notificationSettings,
    );

    alert(
        "Notification settings updated successfully!",
    );
  };

  return (
      <div className="space-y-6 p-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Settings
          </h1>

          <p className="mt-1 text-gray-600">
            Manage your account settings and
            preferences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Settings */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User
                      size={20}
                      className="text-blue-600"
                  />
                  Profile Information
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form
                    onSubmit={
                      handleProfileUpdate
                    }
                    className="space-y-4"
                >
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Full Name
                    </label>

                    <Input
                        type="text"
                        value={
                          profileData.fullName
                        }
                        onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              fullName:
                              e.target
                                  .value,
                            })
                        }
                        required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Email Address
                    </label>

                    <Input
                        type="email"
                        value={
                          profileData.email
                        }
                        onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email:
                              e.target
                                  .value,
                            })
                        }
                        required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>

                    <Input
                        type="tel"
                        value={
                          profileData.phoneNumber
                        }
                        onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phoneNumber:
                              e.target
                                  .value,
                            })
                        }
                        required
                    />
                  </div>

                  <Button
                      type="submit"
                      disabled={
                        updateProfileMutation.isPending
                      }
                      className="flex w-full items-center justify-center gap-2"
                  >
                    {updateProfileMutation.isPending ? (
                        <Loader2
                            size={18}
                            className="animate-spin"
                        />
                    ) : (
                        <Save size={18} />
                    )}

                    Save Profile Changes
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Password Card remains unchanged */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock
                      size={20}
                      className="text-blue-600"
                  />

                  Change Password
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form
                    onSubmit={
                      handlePasswordUpdate
                    }
                    className="space-y-4"
                >
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Current Password
                    </label>

                    <Input
                        type="password"
                        value={
                          passwordData.currentPassword
                        }
                        onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword:
                              e.target
                                  .value,
                            })
                        }
                        required
                        placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      New Password
                    </label>

                    <Input
                        type="password"
                        value={
                          passwordData.newPassword
                        }
                        onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword:
                              e.target
                                  .value,
                            })
                        }
                        required
                        placeholder="Enter new password"
                        minLength={8}
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at
                      least 8 characters
                      long
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>

                    <Input
                        type="password"
                        value={
                          passwordData.confirmPassword
                        }
                        onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword:
                              e.target
                                  .value,
                            })
                        }
                        required
                        placeholder="Confirm new password"
                        minLength={8}
                    />
                  </div>

                  <Button
                      type="submit"
                      disabled={
                        setPasswordMutation.isPending
                      }
                      className="flex w-full items-center justify-center gap-2"
                  >
                    {setPasswordMutation.isPending ? (
                        <Loader2
                            size={18}
                            className="animate-spin"
                        />
                    ) : (
                        <Lock size={18} />
                    )}

                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Side Cards remain unchanged */}
        </div>
      </div>
  );
}