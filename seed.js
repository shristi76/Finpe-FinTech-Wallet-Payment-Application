// require('dotenv').config();
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const User = require('./src/models/User');
// const Transaction = require('./src/models/Transaction');

// const seedUsers = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('Database Connected for Seeding...');

//     await User.deleteMany();
//     await Transaction.deleteMany();
//     console.log('Existing users & transactions deleted.');

//     // Default password and mpin
//     const salt = await bcrypt.genSalt(10);
//     const password = await bcrypt.hash('password123', salt);
//     // Let's seed an MPIN "1234" for easy testing
//     const mpin = await bcrypt.hash('1234', salt);

//     const usersToCreate = [
//       { name: 'Amit Sharma', email: 'amit@example.com', phone: '9876543210', upiId: 'amit123@phonepe', password, mpin, balance: 5000 },
//       { name: 'Priya Singh', email: 'priya@example.com', phone: '9876543211', upiId: 'priya456@phonepe', password, mpin, balance: 3000 },
//       { name: 'Rahul Verma', email: 'rahul@example.com', phone: '9876543212', upiId: 'rahul789@phonepe', password, mpin, balance: 1500 },
//       { name: 'Neha Gupta', email: 'neha@example.com', phone: '9876543213', upiId: 'neha012@phonepe', password, mpin, balance: 8000 },
//     ];

//     await User.insertMany(usersToCreate);
//     console.log('Seed Users Imported Successfully!');
//     console.log('All Users have default password: password123 | default MPIN: 1234');
    
//     process.exit();
//   } catch (error) {
//     console.error(`Error with Seeding: ${error.message}`);
//     process.exit(1);
//   }
// };

// seedUsers();


require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./src/models/User');
const Transaction = require('./src/models/Transaction');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Database Connected for Seeding...');

    // Clear old data
    await User.deleteMany();
    await Transaction.deleteMany();

    console.log('Existing users & transactions deleted.');

    const salt = await bcrypt.genSalt(10);

    const password = await bcrypt.hash('password123', salt);
    const mpin = await bcrypt.hash('1234', salt);

    // Create Users
    const users = await User.insertMany([
      {
        name: 'Amit Sharma',
        email: 'amit@example.com',
        phone: '9876543210',
        upiId: 'amit123@phonepe',
        password,
        mpin,
        balance: 5000,
      },
      {
        name: 'Priya Singh',
        email: 'priya@example.com',
        phone: '9876543211',
        upiId: 'priya456@phonepe',
        password,
        mpin,
        balance: 3000,
      },
      {
        name: 'Rahul Verma',
        email: 'rahul@example.com',
        phone: '9876543212',
        upiId: 'rahul789@phonepe',
        password,
        mpin,
        balance: 1500,
      },
      {
        name: 'Neha Gupta',
        email: 'neha@example.com',
        phone: '9876543213',
        upiId: 'neha012@phonepe',
        password,
        mpin,
        balance: 8000,
      },
    ]);

    console.log('Users Seeded Successfully!');

    const [amit, priya, rahul, neha] = users;

    // Seed Transactions
    await Transaction.insertMany([
      // Add Money
      {
        sender: amit._id,
        amount: 10000,
        type: 'ADD_MONEY',
        category: 'ADD_MONEY',
        status: 'SUCCESS',
      },

      {
        sender: amit._id,
        amount: 5000,
        type: 'ADD_MONEY',
        category: 'ADD_MONEY',
        status: 'SUCCESS',
      },

      // Transfers
      {
        sender: amit._id,
        receiver: priya._id,
        amount: 1200,
        type: 'TRANSFER',
        category: 'TRANSFER',
        status: 'SUCCESS',
      },

      {
        sender: amit._id,
        receiver: rahul._id,
        amount: 800,
        type: 'TRANSFER',
        category: 'TRANSFER',
        status: 'SUCCESS',
      },

      {
        sender: neha._id,
        receiver: amit._id,
        amount: 2500,
        type: 'TRANSFER',
        category: 'TRANSFER',
        status: 'SUCCESS',
      },

      // Recharge
      {
        sender: amit._id,
        amount: 299,
        type: 'BILL_PAY',
        category: 'RECHARGE',
        billerName: 'Jio Recharge',
        status: 'SUCCESS',
      },

      {
        sender: amit._id,
        amount: 719,
        type: 'BILL_PAY',
        category: 'RECHARGE',
        billerName: 'Airtel Recharge',
        status: 'SUCCESS',
      },

      // Electricity
      {
        sender: amit._id,
        amount: 1450,
        type: 'BILL_PAY',
        category: 'ELECTRICITY',
        billerName: 'Adani Electricity',
        status: 'SUCCESS',
      },

      // Food
      {
        sender: amit._id,
        amount: 550,
        type: 'BILL_PAY',
        category: 'FOOD',
        billerName: 'Swiggy',
        status: 'SUCCESS',
      },

      {
        sender: amit._id,
        amount: 320,
        type: 'BILL_PAY',
        category: 'FOOD',
        billerName: 'Zomato',
        status: 'SUCCESS',
      },

      // Shopping
      {
        sender: amit._id,
        amount: 2499,
        type: 'BILL_PAY',
        category: 'SHOPPING',
        billerName: 'Amazon',
        status: 'SUCCESS',
      },

      {
        sender: amit._id,
        amount: 1499,
        type: 'BILL_PAY',
        category: 'SHOPPING',
        billerName: 'Flipkart',
        status: 'SUCCESS',
      },

      // Travel
      {
        sender: amit._id,
        amount: 780,
        type: 'BILL_PAY',
        category: 'TRAVEL',
        billerName: 'Uber',
        status: 'SUCCESS',
      },

      {
        sender: amit._id,
        amount: 450,
        type: 'BILL_PAY',
        category: 'TRAVEL',
        billerName: 'Ola',
        status: 'SUCCESS',
      },

      // Withdraw
      {
        sender: amit._id,
        amount: 3000,
        type: 'WITHDRAW',
        category: 'WITHDRAW',
        status: 'SUCCESS',
      },

      {
        sender: amit._id,
        amount: 1000,
        type: 'WITHDRAW',
        category: 'WITHDRAW',
        status: 'SUCCESS',
      },
    ]);

    console.log('Transactions Seeded Successfully!');
    console.log(
      'Default Password: password123 | Default MPIN: 1234'
    );

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();

