import { useState } from 'react';
import { User, Lock, Bell, Wrench, Save, Award, Briefcase } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function ServiceProviderSettingsView() {
  const [profileData, setProfileData] = useState({
    name: 'John Smith',
    email: 'john.smith@rentiq.com',
    phone: '+254 722 555 777',
    businessName: 'Smith Maintenance Services',
    licenseNumber: 'SP-2023-789012',
    specialization: 'General Maintenance',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newJobAlerts: true,
    paymentNotifications: true,
    urgentJobAlerts: true,
    ratingReminders: false,
  });

  const [servicePreferences, setServicePreferences] = useState({
    autoAcceptJobs: false,
    availableForEmergency: true,
    maxJobsPerDay: '5',
    serviceRadius: '20',
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
    console.log('Service preferences updated:', servicePreferences);
    alert('Service preferences updated successfully!');
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
                    Business Name
                  </label>
                  <Input
                    type="text"
                    value={profileData.businessName}
                    onChange={(e) => setProfileData({...profileData, businessName: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Number
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
                    Specialization
                  </label>
                  <select
                    value={profileData.specialization}
                    onChange={(e) => setProfileData({...profileData, specialization: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="General Maintenance">General Maintenance</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Painting">Painting</option>
                  </select>
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
                Service Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePreferencesUpdate} className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Auto-accept Jobs</span>
                      <p className="text-xs text-gray-500">Automatically accept new assignments</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={servicePreferences.autoAcceptJobs}
                      onChange={(e) => setServicePreferences({
                        ...servicePreferences,
                        autoAcceptJobs: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Available for Emergency</span>
                      <p className="text-xs text-gray-500">Receive urgent/emergency calls</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={servicePreferences.availableForEmergency}
                      onChange={(e) => setServicePreferences({
                        ...servicePreferences,
                        availableForEmergency: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Jobs Per Day
                  </label>
                  <Input
                    type="number"
                    value={servicePreferences.maxJobsPerDay}
                    onChange={(e) => setServicePreferences({
                      ...servicePreferences,
                      maxJobsPerDay: e.target.value
                    })}
                    min="1"
                    max="20"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum number of jobs you can handle per day
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Radius (km)
                  </label>
                  <Input
                    type="number"
                    value={servicePreferences.serviceRadius}
                    onChange={(e) => setServicePreferences({
                      ...servicePreferences,
                      serviceRadius: e.target.value
                    })}
                    min="1"
                    max="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum distance you're willing to travel
                  </p>
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
                    <span className="text-sm text-gray-700">New Job Alerts</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.newJobAlerts}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        newJobAlerts: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">Payment Notifications</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.paymentNotifications}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        paymentNotifications: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">Urgent Job Alerts</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.urgentJobAlerts}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        urgentJobAlerts: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">Rating Reminders</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.ratingReminders}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        ratingReminders: e.target.checked
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
                  <p className="text-gray-600">Provider ID</p>
                  <p className="font-semibold text-gray-900">SP-2024-003</p>
                </div>
                <div>
                  <p className="text-gray-600">Member Since</p>
                  <p className="font-semibold text-gray-900">January 2024</p>
                </div>
                <div>
                  <p className="text-gray-600">Completed Jobs</p>
                  <p className="font-semibold text-gray-900">142 jobs</p>
                </div>
                <div>
                  <p className="text-gray-600">Average Rating</p>
                  <p className="font-semibold text-gray-900">4.8 ★★★★★</p>
                </div>
                <div>
                  <p className="text-gray-600">Response Time</p>
                  <p className="font-semibold text-gray-900">2.5 hours</p>
                </div>
                <div>
                  <p className="text-gray-600">Completion Rate</p>
                  <p className="font-semibold text-gray-900">96%</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Earnings</p>
                  <p className="font-semibold text-gray-900">KES 850,000</p>
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench size={20} className="text-blue-600" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="font-semibold text-gray-900">Plumbing Certified</p>
                  <p className="text-xs text-gray-600 mt-1">Valid until Dec 2026</p>
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="font-semibold text-gray-900">Electrical Licensed</p>
                  <p className="text-xs text-gray-600 mt-1">Valid until Jun 2027</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-3">
                  <p className="font-semibold text-gray-900">HVAC Specialist</p>
                  <p className="text-xs text-gray-600 mt-1">Valid until Mar 2026</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full text-sm mt-4"
              >
                Add Certification
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
