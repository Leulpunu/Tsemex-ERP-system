const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Company = require('./models/Company');
const Account = require('./models/Account');
const Transaction = require('./models/Transaction');
const User = require('./models/User');
const Invoice = require('./models/Invoice');

// Connect DB
connectDB();

async function seedGLData() {
  try {
    console.log('🌐 Connected to MongoDB');
    console.log('🏢 Seeding Tsemex Global Companies & GL Data...');

    // Create Tsemex Global parent
    const tsemexGlobal = await Company.findOne({ name: 'Tsemex Global Business Group' });
    if (!tsemexGlobal) {
      const globalCompany = await Company.create({
        name: 'Tsemex Global Business Group',
        type: 'holding',
        description: 'Parent holding company for all subsidiaries',
        status: 'active'
      });
      console.log(`✅ Created Tsemex Global: ${globalCompany._id}`);
    }

    // Create subsidiaries
    const companies = [
      { name: 'Raycon Construction', type: 'construction', description: 'Construction division' },
      { name: 'Tsemex Hotel Group', type: 'hospitality', description: 'Hotel operations' },
      { name: 'Tsemex Export', type: 'export', description: 'International trade' },
      { name: 'Tsemex Electro Mechanical', type: 'emech', description: 'Electro mechanical services' }
    ];

    for (const companyData of companies) {
      const company = await Company.findOne({ name: companyData.name });
      if (!company) {
        const newCompany = await Company.create(companyData);
        console.log(`✅ Created ${newCompany.name}: ${newCompany._id}`);
      }
    }

    // Create sample GL Accounts for each company
    const accountTypes = [
      { code: '1001', name: 'Cash in Bank', type: 'asset', subType: 'current_asset' },
      { code: '2001', name: 'Accounts Payable', type: 'liability', subType: 'current_liability' },
      { code: '4001', name: 'Revenue - Services', type: 'income', subType: 'revenue' },
      { code: '5001', name: 'Cost of Goods Sold', type: 'expense', subType: 'cost_of_goods_sold' },
      { code: '5101', name: 'Operating Expenses', type: 'expense', subType: 'operating_expense' }
    ];

    const allCompanies = await Company.find({});
    for (const company of allCompanies) {
      for (const acc of accountTypes) {
        const exists = await Account.findOne({ companyId: company._id, code: acc.code });
        if (!exists) {
          await Account.create({ ...acc, companyId: company._id });
        }
      }
      console.log(`✅ GL Accounts seeded for ${company.name}`);
    }

    // Create sample transactions
    const sampleTxns = [
      { description: 'Construction Revenue', amount: 150000, type: 'credit', accountCode: '4001' },
      { description: 'Materials Purchase', amount: 85000, type: 'debit', accountCode: '5001' },
      { description: 'Salary Expense', amount: 25000, type: 'debit', accountCode: '5101' }
    ];

    for (const txn of sampleTxns) {
      const account = await Account.findOne({ code: txn.accountCode });
      if (account) {
        await Transaction.create({
          companyId: account.companyId,
          accountId: account._id,
          type: txn.type,
          amount: txn.amount,
          description: txn.description,
          createdBy: '64f0a1b2c3d4e5f6g7h8i9j0'
        });
      }
    }

    console.log('🎉 GL Data Seeding Complete!');
    console.log('Run: node backend/seed-gl-data.js');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedGLData();

