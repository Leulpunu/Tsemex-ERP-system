import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createContract, updateContract } from '../../store/slices/contractSlice';
import { 
  FileText, Calendar, DollarSign, User, Check, Save, ArrowLeft, 
  Trash2, Clock, Plus, X, CreditCard 
} from 'lucide-react';

const ContractForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const customers = useSelector(state => state.customers.customers || []);
  
  const [formData, setFormData] = useState({
    title: '',
    customerId: '',
    number: '',
    value: 0,
    startDate: '',
    endDate: '',
    status: 'draft',
    renewal: false,
    billingCycle: 'monthly',
    items: [],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      // Fetch contract
      fetch(`/api/contracts/${id}`)
        .then(res => res.json())
        .then(data => setFormData(data.data));
    }
  }, [id]);

  const addItem = () => {
    const newItem = { description: '', quantity: 1, unitPrice: 0, total: 0 };
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  const updateItem = (index, field, value) => {
    const items = [...formData.items];
    items[index][field] = value;
    items[index].total = items[index].quantity * items[index].unitPrice;
    setFormData({ ...formData, items });
  };

  const removeItem = (index) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
  };

  const calculateTotal = () => formData.items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await dispatch(updateContract({ id, data: formData })).unwrap();
      } else {
        await dispatch(createContract(formData)).unwrap();
      }
      navigate('/contracts');
    } catch (error) {
      console.error('Contract save error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/contracts')} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{isEdit ? 'Edit Contract' : 'New Contract'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contract Number</label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="CON-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
            <select
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select customer</option>
              {customers.map(customer => (
                <option key={customer._id} value={customer._id}>{customer.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Annual SaaS Agreement"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.renewal}
                onChange={(e) => setFormData({ ...formData, renewal: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Auto-renewal</span>
            </label>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <select
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                className="px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Line Items</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg group">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 text-sm"
                    />
                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-20 px-3 py-2 border border-gray-200 rounded-md focus:ring-1 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="$ Unit Price"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-1 text-sm"
                      />
                      <div className="font-medium text-sm text-gray-900 min-w-[80px]">
                        ${item.total?.toLocaleString() || '0'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-1.5 text-gray-400 hover:text-red-500 -mt-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {formData.items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="mx-auto h-12 w-12 mb-4 opacity-40" />
                  <p>No line items - click Add Item to start</p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={addItem}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-sm font-medium text-gray-700"
            >
              <Plus size={18} />
              Add Line Item
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-vertical"
              placeholder="Additional contract notes..."
            />
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Contract Total</h3>
              <div className="text-3xl font-bold text-gray-900">
                ${calculateTotal().toLocaleString()}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Total line items value</p>
            <div className="flex gap-3 pt-4 border-t border-blue-100">
              <button
                type="button"
                disabled={loading}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                onClick={() => navigate('/contracts')}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {loading ? 'Saving...' : isEdit ? 'Update Contract' : 'Create Contract'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContractForm;
