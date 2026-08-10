const mongoose = require('mongoose');

const names = [
  "Aarav Sharma", "Vihaan Patel", "Aditya Kumar", "Sai Krishna", "Arjun Singh",
  "Rohan Gupta", "Krishna Reddy", "Ishaan Joshi", "Shaurya Desai", "Ayaan Mehta",
  "Omkar Kadam", "Dhruv Nair", "Kabir Menon", "Aryan Bhat", "Rishi Iyer",
  "Karan Malhotra", "Karthik Pillai", "Devansh Thakur", "Yash Agarwal", "Neel Trivedi",
  "Rudra Bhatt", "Vedant Dixit", "Pranav Rao", "Shivansh Kapoor", "Anshul Verma",
  "Pratham Jain", "Ayush Choudhary", "Darshan Gowda", "Harshvardhan Sinha", "Nikhil Doshi",
  "Lakshya Saxena", "Siddharth Das", "Tanishq Ahuja", "Ojas Soni", "Rajat Bansal",
  "Gaurav Mukherjee", "Sankalp Tiwari", "Varun Chauhan", "Manav Sengupta", "Kunal Biswas",
  "Aarush Chatterjee", "Vivaan Banerjee", "Advait Bose", "Atharva Basu", "Reyansh Dutta",
  "Reyansh Ghose", "Rakshit Guha", "Daksh Thakur", "Aaditya Ghosh", "Arnav Dasgupta",
  "Anya Sharma", "Diya Patel", "Ananya Kumar", "Saanvi Reddy", "Aadhya Singh",
  "Myra Gupta", "Kiara Joshi", "Prisha Desai", "Kavya Mehta", "Avni Kadam",
  "Ira Nair", "Navya Menon", "Riya Bhat", "Aarohi Iyer", "Pari Malhotra",
  "Aisha Pillai", "Anika Thakur", "Jiya Agarwal", "Nandini Trivedi", "Meera Bhatt",
  "Sneha Dixit", "Aditi Rao", "Shruti Kapoor", "Rhea Verma", "Tanya Jain",
  "Ishika Choudhary", "Nidhi Gowda", "Siddhi Sinha", "Pooja Doshi", "Kriti Saxena",
  "Neha Das", "Swara Ahuja", "Mahi Soni", "Anushka Bansal", "Tia Mukherjee",
  "Vanya Tiwari", "Manya Chauhan", "Aahana Sengupta", "Nyra Biswas", "Suhana Chatterjee",
  "Roshni Banerjee", "Simran Bose", "Kashish Basu", "Muskan Dutta", "Anjali Ghose",
  "Rupali Guha", "Deepika Thakur", "Payal Ghosh", "Shikha Dasgupta", "Alia Menon"
];

async function updateNames() {
  try {
    const mongoUri = 'mongodb://127.0.0.1:27018/test';
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    const db = mongoose.connection.db;
    
    // Find all users that look like 'Player X'
    const users = await db.collection('users').find({ name: /^Player \d+$/ }).toArray();
    console.log(`Found ${users.length} users to update.`);

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const newName = names[i % names.length];
      
      // Update User
      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { name: newName } }
      );
    }

    console.log(`Successfully updated ${users.length} users with realistic Indian names.`);
    process.exit(0);
  } catch (error) {
    console.error('Update Error:', error);
    process.exit(1);
  }
}

updateNames();
