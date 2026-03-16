import React, { useState, useEffect } from 'react';
import { 
  Store, Clock, ArrowDownToLine, AlertCircle, 
  CheckCircle, RefreshCw, Wallet, Bell, ChevronRight,
  Landmark, Activity, X
} from 'lucide-react';

// --- MOCK CONSTANTS ---
const MERCHANT_INFO = {
  name: "Staff Canteen",
  university: "University of Moratuwa",
  merchantId: "MID-992-UOM-SC"
};

const TX_COLORS = [
  { bg: 'bg-emerald-50', border: 'border-emerald-500', text: 'text-emerald-700', icon: 'text-emerald-500' },
  { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700', icon: 'text-blue-500' },
  { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-700', icon: 'text-purple-500' },
  { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-700', icon: 'text-orange-500' },
  { bg: 'bg-pink-50', border: 'border-pink-500', text: 'text-pink-700', icon: 'text-pink-500' }
];

const INITIAL_TRANSACTIONS = [
  { id: 'tx-104', amount: 350.00, studentId: 'STU-***-891', time: new Date(Date.now() - 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), colorTheme: TX_COLORS[0] },
  { id: 'tx-103', amount: 1200.00, studentId: 'STU-***-234', time: new Date(Date.now() - 300000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), colorTheme: TX_COLORS[1] },
  { id: 'tx-102', amount: 150.00, studentId: 'STU-***-552', time: new Date(Date.now() - 900000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), colorTheme: TX_COLORS[2] },
  { id: 'tx-101', amount: 850.00, studentId: 'STU-***-119', time: new Date(Date.now() - 1800000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), colorTheme: TX_COLORS[3] },
  { id: 'tx-100', amount: 400.00, studentId: 'STU-***-773', time: new Date(Date.now() - 3600000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), colorTheme: TX_COLORS[4] },
];

export default function MerchantApp() {
  const [pendingBalance, setPendingBalance] = useState(2950.00);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [isFlashing, setIsFlashing] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [toastAlert, setToastAlert] = useState(null);

  // --- LIVE INCOME SIMULATION ---
  useEffect(() => {
    const interval = setInterval(() => {
      // 40% chance of a new transaction happening every 5 seconds
      if (Math.random() > 0.6) {
        const newAmount = Math.floor(Math.random() * (1500 - 100 + 1) + 100); // Random amount between 100 and 1500
        const randomColor = TX_COLORS[Math.floor(Math.random() * TX_COLORS.length)];
        
        const newTx = {
          id: `tx-${Math.floor(Math.random() * 10000)}`,
          amount: newAmount,
          studentId: `STU-***-${Math.floor(Math.random() * 900 + 100)}`,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
          colorTheme: randomColor
        };

        setTransactions(prev => [newTx, ...prev].slice(0, 5)); // Keep only latest 5
        setPendingBalance(prev => prev + newAmount);
        
        // Trigger flash animation
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 1000);

        // Show toast alert
        setToastAlert(newTx);
        setTimeout(() => setToastAlert(null), 4000); // Hide after 4 seconds
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS ---
  const handleManualRedemption = () => {
    if (pendingBalance <= 30) {
      alert("Balance too low to cover the inter-bank transfer fee.");
      return;
    }
    setPendingBalance(0);
    setShowRedeemModal(false);
    alert("Settlement initiated successfully! Funds will reflect in your bank account shortly.");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col relative overflow-x-hidden">
      
      {/* HEADER */}
      <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg text-emerald-800">
              <Store size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight">UniPay Merchant</h1>
              <p className="text-emerald-200 text-xs font-medium">{MERCHANT_INFO.name} • {MERCHANT_INFO.university}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-emerald-200">Merchant ID</p>
              <p className="text-sm font-mono">{MERCHANT_INFO.merchantId}</p>
            </div>
            <button className="bg-emerald-700 hover:bg-emerald-600 p-2 rounded-full relative transition">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-emerald-700"></span>
            </button>
          </div>
        </div>
      </header>

      {/* TOAST ALERT */}
      {toastAlert && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 animate-in slide-in-from-right fade-in duration-300">
          <div className="bg-white border-l-4 border-emerald-500 shadow-2xl rounded-2xl p-4 flex items-center gap-4 max-w-sm w-full">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
              <CheckCircle size={24} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-0.5">Payment Received!</p>
              <div className="flex justify-between items-baseline">
                <p className="font-black text-gray-900 text-xl">+LKR {toastAlert.amount.toFixed(2)}</p>
                <p className="text-xs text-gray-400 font-mono">{toastAlert.studentId}</p>
              </div>
            </div>
            <button onClick={() => setToastAlert(null)} className="text-gray-400 hover:text-gray-600 absolute top-2 right-2">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* MAIN DASHBOARD */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Main Real-time Flows */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Income Display Card */}
            <div className={`bg-white rounded-3xl p-8 shadow-sm border-2 transition-colors duration-500 ${isFlashing ? 'border-emerald-400 bg-emerald-50' : 'border-transparent'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-gray-500 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
                    <Activity size={16} className="text-emerald-500" />
                    Live Pending Settlement
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Updates automatically as students pay</p>
                </div>
                {isFlashing && (
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full animate-pulse flex items-center gap-1">
                    <RefreshCw size={12} className="animate-spin" /> New Payment!
                  </span>
                )}
              </div>
              
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-400">LKR</span>
                <span className={`text-6xl font-black tracking-tight transition-transform duration-300 ${isFlashing ? 'text-emerald-600 scale-105' : 'text-gray-900'}`}>
                  {pendingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Live Payment Receiver (Moved below Income Display) */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Wallet className="text-emerald-600" size={20}/> 
                    Live Payment Receiver
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Latest 5 transactions</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  Receiving
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col gap-4">
                {transactions.map((tx) => {
                  const colorTheme = tx.colorTheme;
                  return (
                    <div 
                      key={tx.id} 
                      className={`p-5 rounded-2xl border-l-4 ${colorTheme.bg} ${colorTheme.border} flex justify-between items-center transition-all animate-in slide-in-from-top-4 fade-in duration-500`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`hidden sm:flex w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm ${colorTheme.text}`}>
                          <CheckCircle size={20} />
                        </div>
                        <div>
                          <p className={`font-bold text-xl ${colorTheme.text}`}>+LKR {tx.amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-500 mt-1 font-mono tracking-wide">{tx.studentId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800 mb-0.5">Today</p>
                        <p className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">{tx.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                <button className="text-sm font-semibold text-emerald-600 flex items-center justify-center gap-1 hover:text-emerald-800 mx-auto transition-colors">
                  View Full History <ChevronRight size={16} />
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Static Management Cards */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Automated Settlement Status */}
            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Clock size={20} />
                </div>
                <h3 className="font-bold text-blue-900 text-lg mb-1">Automated Settlement</h3>
                <p className="text-blue-700 text-sm">Your pending balance is automatically transferred to your registered bank account daily.</p>
              </div>
              <div className="mt-6 bg-white/80 p-3 rounded-xl border border-blue-200 flex items-center gap-3 shadow-sm">
                <CheckCircle size={18} className="text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Scheduled for 1:00 AM</span>
              </div>
            </div>

            {/* Manual Redemption Portal */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Landmark size={20} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Manual Redemption</h3>
                <p className="text-gray-500 text-sm">Need funds immediately? Withdraw your pending balance manually right now.</p>
              </div>
              
              <div className="mt-6">
                {/* Fee Transparency Warning */}
                <div className="flex items-start gap-3 bg-orange-50 p-4 rounded-xl border border-orange-100 mb-4">
                  <AlertCircle size={18} className="text-orange-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-orange-800 font-medium leading-relaxed">
                    <strong className="block mb-1 text-sm">Fee Transparency Warning</strong>
                    A standard LKR 30.00 inter-bank transfer fee will be deducted from your settlement.
                  </p>
                </div>
                <button 
                  onClick={() => setShowRedeemModal(true)}
                  disabled={pendingBalance <= 0}
                  className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md"
                >
                  <ArrowDownToLine size={18} /> Withdraw Now
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* MANUAL REDEMPTION MODAL */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Withdrawal</h2>
            <p className="text-gray-500 mb-6">You are about to settle your pending balance to your registered Bank of Ceylon account.</p>
            
            <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Pending Balance</span>
                <span className="font-semibold text-gray-900">LKR {pendingBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-orange-600">
                <span>Inter-bank Fee</span>
                <span className="font-semibold">- LKR 30.00</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Final Settlement Amount</span>
                <span className="font-bold text-emerald-600 text-lg">LKR {(pendingBalance - 30).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowRedeemModal(false)}
                className="flex-1 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleManualRedemption}
                className="flex-1 py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-md"
              >
                Confirm Settlement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}