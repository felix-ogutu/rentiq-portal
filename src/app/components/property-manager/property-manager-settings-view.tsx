import { useState } from 'react';
import { User, Lock, Bell, Briefcase, Save, Award } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function PropertyManagerSettingsView() {
  const [profileData, setProfileData] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@rentiq.com',
    phone: '+254 722 555 999',
    licenseNumber: 'RE-2023-456789',
    agency: 'Rentiq Property Solutions',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newListingAlerts: true,
    viewingReminders: true,
    commissionNotifications: true,
    leadAlerts: true,
  });

  const [preferences, setPreferences] = useState({
    autoAssignLeads: true,
    showContactInfo: true,
    allowDirectBookings: true,
    shareListings: true,
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', profileData);
    alert('Profile updated successfully!');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    console.log('Password updated');
    alert('Password updated successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleNotificationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Notification settings updated:', notificationSettings);
    alert('Notification settings updated successfully!');
  };

  const handlePreferencesUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Preferences updated:', preferences);
    alert('Preferences updated successfully!');
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Real Estate License Number
                  </label>
                  <Input
                    type="text"
                    value={profileData.licenseNumber}
                    onChange={(e) => setProfileData({...profileData, licenseNumber: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agency
                  </label>
                  <Input
                    type="text"
                    value={profileData.agency}
                    onChange={(e) => setProfileData({...profileData, agency: e.target.value})}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Contact your administrator to change agency
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Profile Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock size={20} className="text-blue-600" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    required
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    required
                    placeholder="Enter new password"
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    required
                    placeholder="Confirm new password"
                    minLength={8}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Lock size={18} />
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase size={20} className="text-blue-600" />
                Property Manager Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePreferencesUpdate} className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Auto-assign Leads</span>
                      <p className="text-xs text-gray-500">Automatically receive new leads</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.autoAssignLeads}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        autoAssignLeads: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Show Contact Info</span>
                      <p className="text-xs text-gray-500">Display phone on listings</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.showContactInfo}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        showContactInfo: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Allow Direct Bookings</span>
                      <p className="text-xs text-gray-500">Clients can book viewings directly</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.allowDirectBookings}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        allowDirectBookings: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Share Listings</span>
                      <p className="text-xs text-gray-500">Allow social media sharing</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.shareListings}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        shareListings: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Preferences
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings & Performance */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} className="text-blue-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationUpdate} className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">Email Notifications</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">New Listing Alerts</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.newListingAlerts}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        newListingAlerts: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">Viewing Reminders</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.viewingReminders}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        viewingReminders: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">Commission Notifications</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.commissionNotifications}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        commissionNotifications: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">Lead Alerts</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.leadAlerts}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        leadAlerts: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Preferences
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award size={20} className="text-blue-600" />
                Performance Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Manager ID</p>
                  <p className="font-semibold text-gray-900">PM-2024-001</p>
                </div>
                <div>
                  <p className="text-gray-600">Member Since</p>
                  <p className="font-semibold text-gray-900">March 2024</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Leases</p>
                  <p className="font-semibold text-gray-900">47 leases</p>
                </div>
                <div>
                  <p className="text-gray-600">Success Rate</p>
                  <p className="font-semibold text-gray-900">78%</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Commission Earned</p>
                  <p className="font-semibold text-gray-900">KES 1,250,000</p>
                </div>
                <div>
                  <p className="text-gray-600">Average Response Time</p>
                  <p className="font-semibold text-gray-900">2.5 hours</p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button
                  variant="outline"
                  className="w-full text-sm"
                >
                  View Detailed Reports
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-sm"
                >
                  Download Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
