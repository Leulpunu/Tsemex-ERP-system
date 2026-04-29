import React from 'react';
import { DollarSign, Banknote, TrendingUp, CreditCard, ArrowLeftRight } from 'lucide-react';

const CashManagement = () => {
  const cashAccounts = [
    { name: 'Primary Checking', balance: 45230.45, type: 'checking', lastReconciled: '2026-04-01' },
    { name: 'Savings Account', balance: 125000.00, type: 'savings', lastReconciled: '2026-03-28' },
    { name: 'Petty Cash', balance: 850.25, type: 'petty_cash', lastReconciled: '2026-04-03' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cash Management</h1>
          <p className="text-gray-600">Track cash balances, transfers, and reconciliations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Cash Balance</h3>
          <div className="text-4xl font-bold text-green-600">$173,080.70</div>
          <p className="text-sm text-gray-500 mt-1">Across 3 accounts</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 rounded-xl text-white shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Banknote className="w-6 h-6" />
            <h3 className="font-semibold">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all flex flex-col items-center">
              <ArrowLeftRight className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Transfer</span>
            </button>
            <button className="p-4 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all flex flex-col items-center">
              <CreditCard className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Reconcile</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Cash Accounts</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {cashAccounts.map((account, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{account.name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{account.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${account.balance.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Reconciled {account.lastReconciled}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1">
                  Reconcile
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 flex items-center gap-1">
                  View History
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CashManagement;

