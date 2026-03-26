'use client';

import { useEffect, useState } from 'react';

interface Signal {
  Id: number;
  Pair: string;
  Action: string;
  Entry: number;
  SL: number;
  TP: number;
  Time: string;
  Status: string;
}

export default function SignalsContent() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);
  const [formData, setFormData] = useState({
    Pair: '',
    Action: 'Buy',
    Entry: '',
    SL: '',
    TP: '',
    Time: '',
    Status: 'Open',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getSignal = () => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/signals`)
      .then(res => res.json())
      .then(json => setSignals(json));
  };

  useEffect(() => {
    getSignal();
  }, []);

  // Open Add Modal
  const openAddModal = () => {
    setModalMode('add');
    setCurrentSignal(null);
    setFormData({
      Pair: '',
      Action: 'Buy',
      Entry: '',
      SL: '',
      TP: '',
      Time: '',
      Status: 'Open',
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (signal: Signal) => {
    setModalMode('edit');
    setCurrentSignal(signal);
    setFormData({
      Pair: signal.Pair,
      Action: signal.Action,
      Entry: signal.Entry.toString(),
      SL: signal.SL.toString(),
      TP: signal.TP.toString(),
      Time: signal.Time,
      Status: signal.Status,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      Entry: Number(formData.Entry),
      SL: Number(formData.SL),
      TP: Number(formData.TP),
    };

    try {
      const url = modalMode === 'edit' && currentSignal
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/signals/${currentSignal.Id}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/api/signals`;

      const method = modalMode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        getSignal(); // Refresh table
      } else {
        alert('Failed to save signal. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this signal?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/signals/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        getSignal();
      } else {
        alert('Failed to delete signal.');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to server.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Trading Signals</h1>
        <button 
          onClick={openAddModal}
          className="bg-linear-to-r from-yellow-500 to-orange-600 text-black font-semibold px-8 py-3 rounded-2xl hover:scale-105 transition"
        >
          + New Signal
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-950">
            <tr>
              <th className="text-left p-6">Pair</th>
              <th className="text-left p-6">Type</th>
              <th className="text-left p-6">Entry Price</th>
              <th className="text-left p-6">Stop Loss</th>
              <th className="text-left p-6">Take Profit</th>
              <th className="text-left p-6">Status</th>
              <th className="text-left p-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {signals.map((signal) => (
              <tr key={signal.Id} className="hover:bg-gray-800/50">
                <td className="p-6 font-medium">{signal.Pair}</td>
                <td className={`p-6 font-bold ${signal.Action === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>
                  {signal.Action}
                </td>
                <td className="p-6">{signal.Entry}</td>
                <td className="p-6 text-red-400">{signal.SL}</td>
                <td className="p-6 text-green-400">{signal.TP}</td>
                <td className="p-6">
                  <span className={`px-4 py-1 rounded-full text-xs font-medium ${
                    signal.Status === 'Open' ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-300'
                  }`}>
                    {signal.Status}
                  </span>
                </td>
                <td className="p-6">
                  <button 
                    onClick={() => openEditModal(signal)}
                    className="text-yellow-500 hover:text-yellow-400 mr-4"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(signal.Id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h3 className="text-2xl font-semibold">
                {modalMode === 'add' ? 'Add New Signal' : 'Edit Signal'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Pair (e.g. EURUSD)</label>
                <input
                  type="text"
                  name="Pair"
                  value={formData.Pair}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Action</label>
                  <select
                    name="Action"
                    value={formData.Action}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="Buy">Buy</option>
                    <option value="Sell">Sell</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select
                    name="Status"
                    value={formData.Status}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Entry Price</label>
                  <input
                    type="number"
                    name="Entry"
                    value={formData.Entry}
                    onChange={handleInputChange}
                    required
                    step="0.00001"
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Stop Loss</label>
                  <input
                    type="number"
                    name="SL"
                    value={formData.SL}
                    onChange={handleInputChange}
                    required
                    step="0.00001"
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Take Profit</label>
                  <input
                    type="number"
                    name="TP"
                    value={formData.TP}
                    onChange={handleInputChange}
                    required
                    step="0.00001"
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Time</label>
                <input
                  type="text"
                  name="Time"
                  value={formData.Time}
                  onChange={handleInputChange}
                  placeholder="e.g. 2025-03-25 14:30"
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-2xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-semibold rounded-2xl transition disabled:opacity-70"
                >
                  {isSubmitting 
                    ? (modalMode === 'edit' ? 'Updating...' : 'Adding...') 
                    : (modalMode === 'edit' ? 'Update Signal' : 'Add Signal')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}