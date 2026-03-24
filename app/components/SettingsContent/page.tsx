'use client';

import { useState } from 'react';
import { Save, Shield, Bell, Palette, Globe, CreditCard, Lock, UserCog, Eye, EyeOff } from 'lucide-react';

export default function SettingsContent() {
  const [settings, setSettings] = useState({
    siteName: "GFX Academy",
    tagline: "Master Forex Trading with Professional Signals & Education",
    contactEmail: "meshackaidai3@gmail.com",
    whatsappNumber: "+255 123 456 789",
    defaultCurrency: "TZS",
    signalValidityHours: "24",
    freeSignalsPerWeek: "3",
    bronzePrice: "25000",
    silverPrice: "100000",
    goldPrice: "130000",
    enableNotifications: true,
    maintenanceMode: false,
    themeColor: "yellow",
  });

  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminPassword, setAdminPassword] = useState("forexadmin2026"); // For demo only

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked; 
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    // In production: Send to /api/settings
    console.log("✅ All Settings Saved:", settings);
    alert("✅ Settings updated successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">
      <div>
        <h1 className="text-4xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-2">Manage your website, security, and business settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - General & Pricing */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* General Information */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold">General Information</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Website Name</label>
                <input
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 focus:border-yellow-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Tagline / Slogan</label>
                <textarea
                  name="tagline"
                  value={settings.tagline}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 focus:border-yellow-500 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={settings.contactEmail}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 focus:border-yellow-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">WhatsApp Number</label>
                  <input
                    type="text"
                    name="whatsappNumber"
                    value={settings.whatsappNumber}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 focus:border-yellow-500 outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold">Package Pricing (TZS)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Bronze", name: "bronzePrice", value: settings.bronzePrice },
                { label: "Silver", name: "silverPrice", value: settings.silverPrice },
                { label: "Gold", name: "goldPrice", value: settings.goldPrice },
              ].map((pkg) => (
                <div key={pkg.name}>
                  <label className="block text-sm text-gray-400 mb-2">{pkg.label} Package</label>
                  <div className="relative">
                    <span className="absolute left-5 top-4 text-gray-500">TZS</span>
                    <input
                      type="number"
                      name={pkg.name}
                      value={pkg.value}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-2xl pl-14 pr-5 py-4 focus:border-yellow-500 outline-none transition"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Security, Access & Notifications */}
        <div className="lg:col-span-5 space-y-8">

          {/* Security Settings - New Section */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold">Security Settings</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Admin Panel Password</label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? "text" : "password"}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 pr-12 focus:border-yellow-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white"
                  >
                    {showAdminPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Change this password regularly for better security</p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Signal Validity (Hours)</label>
                <input
                  type="number"
                  name="signalValidityHours"
                  value={settings.signalValidityHours}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 focus:border-yellow-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Access & Signals */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold">Access & Signals</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Free Signals per Week (Non-members)</label>
                <input
                  type="number"
                  name="freeSignalsPerWeek"
                  value={settings.freeSignalsPerWeek}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 focus:border-yellow-500 outline-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Enable 1 Month Free Signals for Gold Members</span>
                  <div className="relative">
                    <input type="checkbox" checked={true} className="sr-only peer" readOnly />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-green-500"></div>
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Notifications & System */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold">Notifications & System</h2>
            </div>

            <div className="space-y-5">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Email Notifications for New Contacts</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    name="enableNotifications"
                    checked={settings.enableNotifications}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-green-500"></div>
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Maintenance Mode (Hide website for users)</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-red-500"></div>
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                </div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-linear-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-bold py-5 rounded-3xl flex items-center justify-center gap-3 text-lg transition-all active:scale-95 shadow-lg"
          >
            <Save className="w-6 h-6" />
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}