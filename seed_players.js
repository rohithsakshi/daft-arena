const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const indianNames = [
  "Aarav Sharma", "Vivaan Patel", "Aditya Singh", "Vihaan Kumar", "Arjun Gupta",
  "Sai Reddy", "Reyansh Joshi", "Krishna Iyer", "Ishaan Verma", "Shaurya Desai",
  "Ayaan Nair", "Dhruv Menon", "Kabir Bhatia", "Rishi Rao", "Rudra Pillai",
  "Ananya Reddy", "Diya Sharma", "Aadhya Patel", "Saanvi Iyer", "Myra Gupta",
  "Prisha Singh", "Riya Kumar", "Avni Joshi", "Ishita Verma", "Navya Desai",
  "Tara Nair", "Sara Menon", "Kavya Bhatia", "Anika Rao", "Neha Pillai",
  "Karthik K", "Rahul S", "Siddharth M", "Vikram P", "Pooja V",
  "Rohan D", "Meera N", "Nikhil R", "Sneha B", "Ashwin K",
  "Varun J", "Priya T", "Akash S", "Shruti M", "Nitin P",
  "Simran K", "Kunal D", "Divya N", "Harish R", "Anjali B"
];

async function seed() {
  await mongoose.connect('mongodb://admin:ea90f1742d0b4baa@db-daftarena-8c9c33d8.malikbusiness.cloud:443/?tls=true&authSource=admin');
  const db = mongoose.connection.db;

  const tournamentId = new ObjectId('6a7ab586682856477c5d865c');
  const eventId = new ObjectId('6a7ab8c4cd7746eb46ad21de');

  const users = indianNames.map(name => {
    return {
      _id: new ObjectId(),
      name: name,
      email: name.toLowerCase().replace(/ /g, '.') + Math.floor(Math.random() * 1000) + '@example.com',
      hashedPassword: 'password123',
      authProvider: 'LOCAL',
      emailVerified: true,
      systemRole: 'PLAYER',
      onboardingCompleted: true,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 0
    };
  });

  await db.collection('users').insertMany(users);
  console.log('Inserted 50 users');

  const registrations = users.map(user => {
    return {
      _id: new ObjectId(),
      tournamentId: tournamentId,
      eventId: eventId,
      participantIds: [user._id],
      status: 'Pending',
      paymentStatus: 'Pending',
      auditLog: [
        {
          _id: new ObjectId(),
          status: 'Pending',
          changedBy: user._id,
          changedAt: new Date(),
          reason: 'Initial Registration Checkout'
        }
      ],
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 0
    };
  });

  await db.collection('registrations').insertMany(registrations);
  console.log('Inserted 50 registrations');

  process.exit(0);
}

seed().catch(console.error);
