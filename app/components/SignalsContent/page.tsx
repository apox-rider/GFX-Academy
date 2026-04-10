'use client';

import { useEffect, useState } from 'react';

interface Signal {
  id: string;
  pair: string;
  action: 'BUY' | 'SELL'|'SELL STOP'|'BUY STOP'| 'SELL LIMIT '|'BUY LIMIT';
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  status: 'active' | 'closed' | 'cancelled';
  validity_hours: number;
  min_tier: string;
  created_at: string;
}

export default function SignalsContent() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);
  const [formData, setFormData] = useState({
    pair: '',
    action: 'BUY',
    entry_price: '',
    stop_loss: '',
    take_profit: '',
    validity_hours: '24',
    min_tier: 'bronze',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSignals = async () => {
    try {
      const res = await fetch('/api/signals?status=active');
      const json = await res.json();
      if (json.success) {
        setSignals(json.signals || []);
      }
    } catch (error) {
      console.error("Failed to fetch signals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setCurrentSignal(null);
    setFormData({
      pair: '',
      action: 'BUY',
      entry_price: '',
      stop_loss: '',
      take_profit: '',
      validity_hours: '24',
      min_tier: 'bronze',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (signal: Signal) => {
    setModalMode('edit');
    setCurrentSignal(signal);
    setFormData({
      pair: signal.pair,
      action: signal.action,
      entry_price: signal.entry_price.toString(),
      stop_loss: signal.stop_loss.toString(),
      take_profit: signal.take_profit.toString(),
      validity_hours: signal.validity_hours.toString(),
      min_tier: signal.min_tier,
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
      pair: formData.pair,
      action: formData.action,
      entry_price: parseFloat(formData.entry_price),
      stop_loss: parseFloat(formData.stop_loss),
      take_profit: parseFloat(formData.take_profit),
      validity_hours: parseInt(formData.validity_hours),
      min_tier: formData.min_tier,
    };

    try {
      const res = await fetch('/api/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchSignals();
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

  const handleClose = async (signalId: string) => {
    if (!confirm('Mark this signal as closed?')) return;

    try {
      const res = await fetch('/api/signals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signal_id: signalId, status: 'closed' }),
      });

      if (res.ok) {
        fetchSignals();
      } else {
        alert('Failed to close signal.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading signals...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Trading Signals</h1>
        <button 
          onClick={openAddModal}
          className="bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-semibold px-6 py-3 rounded-xl hover:scale-105 transition"
        >
          + New Signal
        </button>
      </div>

      {signals.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center">
          <p className="text-gray-400 text-lg">No active signals. Create one to get started.</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-950">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Pair</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Type</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Entry</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Stop Loss</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Take Profit</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Min Tier</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Created</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {signals.map((signal) => (
                <tr key={signal.id} className="hover:bg-gray-800/50">
                  <td className="p-4 font-mono font-medium">{signal.pair}</td>
                  <td className={`p-4 font-bold ${signal.action === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                    {signal.action}
                  </td>
                  <td className="p-4 font-mono">{signal.entry_price}</td>
                  <td className="p-4 font-mono text-red-400">{signal.stop_loss}</td>
                  <td className="p-4 font-mono text-green-400">{signal.take_profit}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-800 rounded text-xs capitalize">
                      {signal.min_tier}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">{formatDate(signal.created_at)}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => openEditModal(signal)}
                      className="text-yellow-500 hover:text-yellow-400 text-sm mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleClose(signal.id)}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Close
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h3 className="text-2xl font-semibold">
                Add New Signal
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Currency Pair (e.g. EUR/USD)</label>
                <input
                  type="text"
                  name="pair"
                  value={formData.pair}
                  onChange={handleInputChange}
                  required
                  placeholder="EUR/USD"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Action</label>
                  <select
                    name="action"
                    value={formData.action}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                    <option value="SELLSTOP">SELL STOP</option>
                    <option value="BUYSTOP">BUY STOP</option>
                    <option value="SELL LIMIT">SELL LIMIT</option>
                    <option value="BUYLIMIT">BUY LIMIT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Min Tier</label>
                  <select
                    name="min_tier"
                    value={formData.min_tier}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="bronze">Bronze</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Entry Price</label>
                  <input
                    type="number"
                    name="entry_price"
                    value={formData.entry_price}
                    onChange={handleInputChange}
                    required
                    step="0.00001"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Stop Loss</label>
                  <input
                    type="number"
                    name="stop_loss"
                    value={formData.stop_loss}
                    onChange={handleInputChange}
                    required
                    step="0.00001"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Take Profit</label>
                  <input
                    type="number"
                    name="take_profit"
                    value={formData.take_profit}
                    onChange={handleInputChange}
                    required
                    step="0.00001"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-semibold rounded-xl transition disabled:opacity-70"
                >
                  {isSubmitting ? 'Adding...' : 'Add Signal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
