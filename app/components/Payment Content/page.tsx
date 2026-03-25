'use client';

import { useEffect, useState } from 'react';
import { Calendar, Download, Send, Eye, X, CreditCard, Clock, AlertCircle } from 'lucide-react';


interface Payment {
  id: number;
  user: string;
  email: string;
  package: 'Bronze' | 'Silver' | 'Gold';
  amount: number;
  date: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Pending';
  daysLeft: number;
  paymentMethod: 'M-Pesa' | 'Tigo Pesa' | 'Airtel Money' | 'Bank';
  transactionId?: string;
}

export default function PaymentsContent() {
  const [payments, setPayments] = useState<Payment[]>([]);

 

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const activePayments = payments.filter(p => p.status === 'Active');
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const goldCount = payments.filter(p => p.package === 'Gold').length;
  const expiringSoon = payments.filter(p => p.daysLeft > 0 && p.daysLeft <= 30);

  const exportPayments = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,User,Email,Package,Amount,Date,Expiry,Days Left,Status,Method,Transaction ID\n"
      + payments.map(p => 
          `${p.id},"${p.user}",${p.email},${p.package},${p.amount},${p.date},${p.expiryDate},${p.daysLeft},${p.status},${p.paymentMethod},${p.transactionId || ''}`
        ).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `forex_payments_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("✅ Payment report exported successfully!");
  };

  const sendReminder = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowReminderModal(true);
  };

   const getpaymentRecords=()=>{
     fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payments`)
     .then(res=>res.json())
     .then(json=>setPayments(json)) 
  }
  useEffect(()=>{
    getpaymentRecords()
  },[])
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-white">Payments & Subscriptions</h1>
        <p className="text-gray-400 mt-2">Manage all package payments, active accounts and expirations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Active Subscriptions</p>
          <p className="text-5xl font-bold mt-4 text-white">{activePayments.length}</p>
          <p className="text-green-500 text-sm mt-2">↑ 7 this month</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Total Revenue (TZS)</p>
          <p className="text-5xl font-bold mt-4 text-white">{(totalRevenue / 1000000).toFixed(1)}M</p>
          <p className="text-green-500 text-sm mt-2">↑ 22% this month</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Gold Members</p>
          <p className="text-5xl font-bold mt-4 text-white">{goldCount}</p>
          <p className="text-violet-400 text-sm mt-2">Highest tier</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Expiring Soon</p>
          <p className="text-5xl font-bold mt-4 text-white">{expiringSoon.length}</p>
          <p className="text-orange-500 text-sm mt-2">Within 30 days</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <button 
          onClick={exportPayments}
          className="bg-linear-to-r from-yellow-500 to-orange-600 text-black font-semibold px-8 py-4 rounded-2xl flex items-center gap-3 hover:scale-105 transition"
        >
          <Download className="w-5 h-5" />
          Export Payment Report (CSV)
        </button>

        <button 
          onClick={() => setShowCalendar(true)}
          className="bg-gray-800 hover:bg-gray-700 border border-gray-700 font-semibold px-8 py-4 rounded-2xl flex items-center gap-3 transition"
        >
          <Calendar className="w-5 h-5" />
          View Renewal Calendar
        </button>
      </div>

      {/* Expiring Soon */}
      {expiringSoon.length > 0 && (
        <div className="bg-orange-950/50 border border-orange-500/30 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-orange-500" />
            <h3 className="text-xl font-semibold text-orange-400">Expiring Soon ({expiringSoon.length})</h3>
          </div>
          <p className="text-orange-300">These accounts will lose access soon. Send reminders immediately.</p>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">All Transactions</h2>
          <span className="text-sm text-gray-400">{payments.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-950">
              <tr>
                <th className="text-left p-6">User</th>
                <th className="text-left p-6">Package</th>
                <th className="text-left p-6">Amount</th>
                <th className="text-left p-6">Method</th>
                <th className="text-left p-6">Expiry</th>
                <th className="text-left p-6">Days Left</th>
                <th className="text-left p-6">Status</th>
                <th className="text-left p-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {payments.map((payment) => {
                const isExpiring = payment.daysLeft > 0 && payment.daysLeft <= 30;
                return (
                  <tr key={payment.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-6">
                      <div className="font-medium">{payment.user}</div>
                      <div className="text-xs text-gray-500">{payment.email}</div>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex px-4 py-1 rounded-full text-xs font-medium ${
                        payment.package === 'Gold' ? 'bg-violet-500/20 text-violet-400' :
                        payment.package === 'Silver' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {payment.package}
                      </span>
                    </td>
                    <td className="p-6 font-semibold">{payment.amount.toLocaleString()} TZS</td>
                    <td className="p-6 text-gray-400">{payment.paymentMethod}</td>
                    <td className="p-6 text-gray-400">{payment.expiryDate}</td>
                    <td className={`p-6 font-medium ${isExpiring ? 'text-orange-400' : payment.daysLeft === 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {payment.daysLeft > 0 ? `${payment.daysLeft} days` : 'Expired'}
                    </td>
                    <td className="p-6">
                      <span className={`px-5 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'Active' ? 'bg-green-500/20 text-green-400' : 
                        payment.status === 'Expired' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-6 flex gap-4">
                      <button 
                        onClick={() => setSelectedPayment(payment)}
                        className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <button 
                        onClick={() => sendReminder(payment)}
                        className="flex items-center gap-1 text-yellow-500 hover:text-yellow-400 text-sm font-medium"
                      >
                        <Send className="w-4 h-4" /> Reminder
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== PAYMENT DETAIL MODAL ==================== */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl max-w-2xl w-full overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-800 p-8">
              <div>
                <h3 className="text-2xl font-bold">Payment Details</h3>
                <p className="text-gray-400 text-sm mt-1">Transaction #{selectedPayment.id}</p>
              </div>
              <button 
                onClick={() => setSelectedPayment(null)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-400 text-sm">Customer Name</p>
                  <p className="text-2xl font-semibold mt-1">{selectedPayment.user}</p>
                  <p className="text-gray-500 text-sm mt-1">{selectedPayment.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Package Purchased</p>
                  <span className={`inline-block mt-2 px-6 py-2 rounded-2xl text-lg font-bold ${
                    selectedPayment.package === 'Gold' ? 'bg-violet-500/20 text-violet-400' :
                    selectedPayment.package === 'Silver' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {selectedPayment.package} Package
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-2xl p-6">
                  <p className="text-gray-400 text-sm">Amount Paid</p>
                  <p className="text-3xl font-bold mt-2">{selectedPayment.amount.toLocaleString()} TZS</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-6">
                  <p className="text-gray-400 text-sm">Payment Method</p>
                  <p className="text-xl font-medium mt-2">{selectedPayment.paymentMethod}</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-6">
                  <p className="text-gray-400 text-sm">Transaction ID</p>
                  <p className="font-mono text-sm mt-2 break-all">{selectedPayment.transactionId}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm">Purchase Date</p>
                  <p className="text-lg font-medium mt-1">{selectedPayment.date}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Expiry Date</p>
                  <p className="text-lg font-medium mt-1">{selectedPayment.expiryDate}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Days Remaining</p>
                <div className={`text-6xl font-bold ${selectedPayment.daysLeft <= 30 && selectedPayment.daysLeft > 0 ? 'text-orange-400' : selectedPayment.daysLeft === 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {selectedPayment.daysLeft > 0 ? selectedPayment.daysLeft : 'Expired'}
                  <span className="text-2xl font-normal ml-2">days</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-800 p-8 flex gap-4">
              <button 
                onClick={() => sendReminder(selectedPayment)}
                className="flex-1 flex items-center justify-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-2xl transition"
              >
                <Send className="w-5 h-5" />
                Send Renewal Reminder
              </button>
              <button 
                onClick={() => setSelectedPayment(null)}
                className="flex-1 border border-gray-700 hover:bg-gray-800 font-bold py-4 rounded-2xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal (same as before) */}
      {showReminderModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl p-10 max-w-md w-full text-center">
            <h3 className="text-2xl font-bold mb-6">Send Renewal Reminder</h3>
            <p className="text-gray-300 mb-10">
              To: <strong>{selectedPayment.user}</strong><br />
              Email: <strong>{selectedPayment.email}</strong>
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowReminderModal(false)}
                className="flex-1 py-4 border border-gray-700 rounded-2xl hover:bg-gray-800"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert(`✅ Renewal reminder sent to ${selectedPayment.email}`);
                  setShowReminderModal(false);
                }}
                className="flex-1 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-2xl"
              >
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Renewal Calendar Modal (same as before) */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl p-10 max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Calendar className="text-yellow-500" /> Renewal Calendar
            </h3>
            <div className="space-y-4 max-h-96 overflow-auto pr-2">
              {payments
                .filter(p => p.daysLeft > 0 && p.daysLeft <= 60)
                .map(p => (
                  <div key={p.id} className="flex justify-between bg-gray-800 p-5 rounded-2xl">
                    <div>
                      <p className="font-medium">{p.user}</p>
                      <p className="text-sm text-gray-500">{p.package} • Expires {p.expiryDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-400 font-medium">{p.daysLeft} days left</p>
                    </div>
                  </div>
                ))}
            </div>
            <button 
              onClick={() => setShowCalendar(false)}
              className="mt-8 w-full py-4 bg-gray-800 hover:bg-gray-700 rounded-2xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}