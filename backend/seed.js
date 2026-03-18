require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Company = require('./models/Company');
const Role = require('./models/Role');

connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Company.deleteMany();

    // Create 4 Tsemex companies with valid enum types
    const companies = await Company.insertMany([
      {
        name: 'Raycon First Grade Construction',
        type: 'construction',
        address: 'Nairobi, Kenya',
        phone: '+254 700 123456',
        email: 'info@raycon.co.ke'
      },
      {
        name: 'Tsemex Electro-Mechanical',
        type: 'electro_mechanical',
        address: 'Nairobi, Kenya',
        phone: '+254 700 234567',
        email: 'info@tsemex-em.co.ke'
      },
      {
        name: 'Tsemex Import Export',
        type: 'import_export',
        address: 'Mombasa, Kenya',
        phone: '+254 700 345678',
        email: 'info@tsemex-import.com'
      },
      {
        name: 'Tsemex Real Estate and Hotels',
        type: 'real_estate_hotel',
        address: 'Nairobi, Kenya',
        phone: '+254 700 456789',
        email: 'info@tsemex-realestate.com'
      }
    ]);

    // Create Super Admin
    // Create default super admin role first
    const superRole = await Role.create({
      companyId: companies[0]._id,
      name: 'Super Admin',
      department: 'IT',
      level: 1,
      permissions: {},
      dataScope: 'enterprise'
    });

    const superAdmin = await User.create({
      name: 'Tsemex Super Admin',
      email: 'admin@tsemex.com',
      password: 'admin123',
      role: 'super_admin',
      companyId: companies[0]._id,
      roleId: superRole._id
    });

    console.log('✅ Seed complete!');
    console.log('🆔 Super Admin:', superAdmin.email);
    console.log('🔑 Password: admin123');
    console.log('🏢 Companies created:', companies.length);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedData();
