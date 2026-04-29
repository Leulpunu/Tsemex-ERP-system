import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Repeat, Calendar, DollarSign, Clock, AlertCircle, CheckCircle, 
  PauseCircle, CreditCard, Filter, Search, Download 
} from 'lucide-react';

const RecurringList = () => {
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/recurring?status=' + filter)
      .then(res => res.json())
      .then(data => {
        setRecurring(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter]);

  const filtered = recurring.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const statusIcon = (status) => {
    const icons = {
      active: CheckCircle,
      paused: PauseCircle,
      cancelled: AlertCircle
    };
    const Icon = icons[status] || CheckCircle;
    const colors = {
      active: 'text-green-600',
      paused: 'text-yellow-600',
      cancelled: 'text-red-600'
    };
    return <Icon size={18} className={colors[status] || 'text-gray-400'} />;
  };

  const daysToNext = (date) => {
    const now = new Date();
    const next = new Date(date);
    const diff = Math.ceil((next - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recurring Billing</h1>
          <p className="text-gray-600">Automated subscription management & invoice generation</p>
        </div>
        <div className="flex gap-2">
          <Link to="/recurring/new" className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm">
            <Repeat size={18} />
            New Recurring
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search recurring billings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Upcoming Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Due Soon</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filtered.filter(item => daysToNext(item.nextBillingDate) <= 7).slice(0, 5).map(item => (
              <div key={item._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.customerId?.name}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {item.number}
                      </span>
                      <span>${item.total.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {daysToNext(item.nextBillingDate)}d
                    </div>
                    <div className="text-xs text-gray-500">Next bill</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Active (12)</h2>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {filtered.filter(item => item.status === 'active').slice(0, 5).map(item => (
              <Link key={item._id} to={`/recurring/${item._id}`} className="block p-6 hover:bg-gray-50 border-b last:border-b-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{item.customerId?.name}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{item.billingCycle}</span>
                      <span>{new Date(item.nextBillingDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <DollarSign className="w-5 h-5 text-gray-400 ml-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Full Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cycle</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Bill</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-900">
                    {item.number}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{item.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-sm text-gray-900">{item.customerId?.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sm text-gray-900">${item.total.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {item.billingCycle}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(item.nextBillingDate).toLocaleDateString()}
                    {daysToNext(item.nextBillingDate) <= 3 && (
                      <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Soon</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusIcon(item.status).props.className}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      Generate
                    </button>
                    <Link to={`/recurring/${item._id}`} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecurringList;
