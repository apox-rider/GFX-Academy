'use client';

export default function AdminHeader() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-8 py-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="ml-8 text-2xl font-semibold text-white">Admin Dashboard</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="bg-gray-800 text-sm px-4 py-2 rounded-2xl flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          Live Trading Mode
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-medium">Meshack</p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
          <div className="w-10 h-10 bg-linear-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center text-black font-bold">
            M
          </div>
        </div>
      </div>
    </header>
  );
}