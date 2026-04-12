'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { Save, Shield, Bell, Palette, Globe, CreditCard, Lock, UserCog, Eye, EyeOff, Loader2 } from 'lucide-react';

interface Settings {
    siteName: string;
    tagline: string;
    contactEmail: string;
    whatsappNumber: string;
    defaultCurrency: string;
    signalValidityHours: number;
    freeSignalsPerWeek: number;
    bronzePrice: number;
    silverPrice: number;
    goldPrice: number;
    enableNotifications: boolean;
    weeklyPrice: number;
    monthlyPrice: number;
    annualPrice: number;
    maintenanceMode: boolean;
    themeColor: string;
}

export default function SettingsContent() {
  // 1. Initialize as a single object (or null)
  const [settings, setSettings] = useState<Settings | null>(null);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminPassword, setAdminPassword] = useState("forexadmin2026");

  const getSettings = () => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(json => {
        // If API returns an array, take the first item
        const data = Array.isArray(json) ? json[0] : json;
        setSettings(data);
      })
      .catch(err => console.error("Failed to fetch settings:", err));
  };

  useEffect(() => {
    getSettings();
  }, []);

  // 2. Handle Input Changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setSettings(prev => prev ? ({
      ...prev,
      [name]: val
    }) : null);
  };

  const handleSave = async () => {
    if (!settings) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      
      if (res.ok) {
        alert("Settings updated successfully!");
      } else {
        alert("Failed to update settings. Please try again.");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Error connecting to server.");
    }
  };

 

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">
    {
      !settings &&
      <div className="flex h-64 items-center justify-center text-white">
        <Loader2 className="animate-spin mr-2" /> Loading Settings...
      </div>
    }
      <div>
        <h1 className="text-4xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-2">Manage your website, security, and business settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                  disabled={!settings}
                  type="text"
                  name="siteName"
                  value={settings?.siteName}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 focus:border-yellow-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Tagline / Slogan</label>
                <textarea
                  disabled={!settings}
                  name="tagline"
                  value={settings?.tagline}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 focus:border-yellow-500 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Contact Email</label>
                  <input
                    disabled={!settings}
                    type="email"
                    name="contactEmail"
                    value={settings?.contactEmail}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 focus:border-yellow-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">WhatsApp Number</label>
                  <input
                    disabled={!settings}
                    type="text"
                    name="whatsappNumber"
                    value={settings?.whatsappNumber}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 focus:border-yellow-500 outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold">Package Pricing (TZS)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Bronze", name: "bronzePrice", value: settings?.bronzePrice },
                { label: "Silver", name: "silverPrice", value: settings?.silverPrice },
                { label: "Gold", name: "goldPrice", value: settings?.goldPrice },
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
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold">Signal Pricing (TZS)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Weekly", name: "weeklyPrice", value: settings?.weeklyPrice },
                { label: "Monthly", name: "monthlyPrice", value: settings?.monthlyPrice },
                { label: "Annually", name: "annualPrice", value: settings?.annualPrice },
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

        <div className="lg:col-span-5 space-y-8">
          {/* Security & System Sections (Use same pattern as above) */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
             <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-semibold">Security Settings</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Signal Validity (Hours)</label>
                  <input
                    disabled={!settings}
                    type="number"
                    name="signalValidityHours"
                    value={settings?.signalValidityHours}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 focus:border-yellow-500 outline-none"
                  />
                </div>
              </div>
          </div>

          {/* Save Button */}
          <button
            disabled={!settings}
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-bold py-5 rounded-3xl flex items-center justify-center gap-3 text-lg transition-all active:scale-95 shadow-lg"
          >
            <Save className="w-6 h-6" />
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}