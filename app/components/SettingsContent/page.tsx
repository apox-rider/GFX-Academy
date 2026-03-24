'use client';

import { useState } from 'react';
import { Save, Shield, Bell, Palette, Globe, Users, CreditCard } from 'lucide-react';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    alert("✅ Settings saved successfully!");
    // In real app, send to API: fetch('/api/settings', { method: 'POST', body: JSON.stringify(settings) })
    console.log("Saved Settings:", settings);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-2">Configure your Forex website globally</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* General Settings */}
        <div className="lg:col-span-7 space-y-8">
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
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 focus:border-yellow-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Tagline / Slogan</label>
                <textarea
                  name="tagline"
                  value={settings.tagline}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 focus:border-yellow-500 outline-none"
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
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 focus:border-yellow-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">WhatsApp Number</label>
                  <input
                    type="text"
                    name="whatsappNumber"
                    value={settings.whatsappNumber}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 focus:border-yellow-500 outline-none"
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
              <div>
                <label className="block text-sm text-gray-400 mb-2">Bronze Package</label>
                <div className="relative">
                  <span className="absolute left-5 top-4 text-gray-500">TZS</span>
                  <input
                    type="number"
                    name="bronzePrice"
                    value={settings.bronzePrice}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl pl-14 pr-5 py-4 focus:border-yellow-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Silver Package</label>
                <div className="relative">
                  <span className="absolute left-5 top-4 text-gray-500">TZS</span>
                  <input
                    type="number"
                    name="silverPrice"
                    value={settings.silverPrice}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl pl-14 pr-5 py-4 focus:border-yellow-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Gold Package</label>
                <div className="relative">
                  <span className="absolute left-5 top-4 text-gray-500">TZS</span>
                  <input
                    type="number"
                    name="goldPrice"
                    value={settings.goldPrice}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl pl-14 pr-5 py-4 focus:border-yellow-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Access & Signals */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold">Access & Signals</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Free Signals per Week (for non-members)</label>
                <input
                  type="number"
                  name="freeSignalsPerWeek"
                  value={settings.freeSignalsPerWeek}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 focus:border-yellow-500 outline-none"
                />
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

              <div className="pt-4 border-t border-gray-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Enable 1 Month Free Signals for Gold Members</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={true}
                      className="sr-only peer"
                      readOnly
                    />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-green-500"></div>
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Notifications & Security */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold">Notifications & Security</h2>
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
                <span>Maintenance Mode (Hide site for users)</span>
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
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-bold py-5 rounded-3xl flex items-center justify-center gap-3 text-lg transition-all active:scale-95"
          >
            <Save className="w-6 h-6" />
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
}