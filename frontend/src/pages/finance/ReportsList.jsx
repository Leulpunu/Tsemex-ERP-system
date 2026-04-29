import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSummary } from '../../store/slices/reportSlice';
import { 
  BarChart3, FileText, Calendar, Filter, Download, 
  TrendingUp, Activity, DollarSign 
} from 'lucide-react';

const ReportsList = () => {
  const dispatch = useDispatch();
  const { summary, loading } = useSelector((state) => state.reports);
  const { user } = useSelector((state) => state.auth);

  const [period, setPeriod] = useState('month');
  const [basis, setBasis] = useState('accrual');

  useEffect(() => {
    dispatch(fetchSummary());
  }, [dispatch]);

  const reports = [
    { name: 'Trial Balance', path: '/reports/trial-balance', icon: BarChart3 },
    { name: 'Balance Sheet', path: '/reports/balance-sheet', icon: TrendingUp },
    { name: 'Income Statement', path: '/reports/income-statement', icon: Activity },
    { name: 'AR Aging', path: '/reports/ar-aging', icon: DollarSign },
    { name: 'AP Aging', path: '/reports/ap-aging', icon: DollarSign },
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600 mt-1">Generate cash and accrual basis accounting reports</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select 
            value={basis} 
            onChange={(e) => setBasis(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="accrual">Accrual Basis</option>
            <option value="cash">Cash Basis</option>
          </select>
          <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${summary.totalRevenue?.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <Activity className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Expenses</p>
                <p className="text-2xl font-bold text-gray-900">${summary.totalExpenses?.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Net Profit</p>
                <p className="text-2xl font-bold text-gray-900 ${summary.netProfit > 0 ? 'text-green-600' : 'text-red-600'}">${summary.netProfit?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report.name} className="group bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl group-hover:scale-110 transition-transform">
                  <report.icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{report.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">Cash & Accrual basis available</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} />
                    <span>Custom period</span>
                    <Filter size={14} />
                    <span>{basis} basis</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsList;
