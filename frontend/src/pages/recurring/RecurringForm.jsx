import React from 'react';
import { Plus, Calendar, DollarSign } from 'lucide-react';

const RecurringForm = () => {
  return (
    <div className="p-12 text-center">
      <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
        <Calendar className="w-12 h-12 text-blue-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Recurring Billing Form</h1>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">Generate from contract or manual setup for subscriptions & retainers</p>
      <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 mx-auto">
        <Plus size={20} />
        Create Recurring
      </button>
    </div>
  );
};

export default RecurringForm;
