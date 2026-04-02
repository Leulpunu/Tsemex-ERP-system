const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Role = require('./models/Role');
const Company = require('./models/Company');

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Role.deleteMany();
    await Company.deleteMany();

    console.log('Data deleted...');

    // Create roles first
    const roles = await Role.insertMany([
      {
        name: 'super_admin',
        department: 'ADMIN',
        level: 1,
        dataScope: 'enterprise',
        approvalLimit: 999999,
        permissions: {
          dashboard: { executive: true, departmental: true, operational: true, custom: true, export: true },
          // ... full permissions for super_admin
        }
      }
    ]);

    // Create company
    const company = await Company.create({
      name: 'Tsemex Construction Ltd',
      type: 'construction',
      email: 'info@tsemex.com',
      phone: '+1234567890',
      address: {
        street: '123 Main St',
        city: 'Nairobi',
        country: 'Kenya'
      }
    });

    // Create super admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'admin@tsemex.com',
      password: hashedPassword,
      role: 'super_admin',
      roleId: roles[0]._id,
      companyId: company._id,
      isActive: true,
      sessionActive: true
    });

    console.log('✅ Seed complete!');
    console.log('Login: admin@tsemex.com / admin123');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();

