// scripts/createTestUsers.js - Strong Password Version
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function createTestUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const testUsers = [
      {
        username: 'user1',
        email: 'user1@test.com',
        password: 'Test123!' // ✅ Uppercase T, lowercase est, number 123, special !
      },
      {
        username: 'user2', 
        email: 'user2@test.com',
        password: 'Test456@' // ✅ Uppercase T, lowercase est, number 456, special @
      },
      {
        username: 'user3',
        email: 'user3@test.com', 
        password: 'Test789#' // ✅ Uppercase T, lowercase est, number 789, special #
      },
      {
        username: 'user4',
        email: 'user4@test.com',
        password: 'Test012$' // ✅ Uppercase T, lowercase est, number 012, special $
      },
      {
        username: 'test',
        email: 'test@test.com',
        password: 'Pass123!' // ✅ Uppercase P, lowercase ass, number 123, special !
      }
    ];

    for (const userData of testUsers) {
      // Delete existing user first
      await User.findOneAndDelete({ email: userData.email });
      console.log(`🗑️ Removed existing: ${userData.email}`);

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = new User({
        username: userData.username,
        email: userData.email,
        password: hashedPassword
      });

      await user.save();
      console.log(`✅ Created: ${userData.username} with strong password`);
    }

    console.log('\n🎉 Test users created successfully!');
    console.log('\n📋 Login Credentials (Strong Passwords):');
    console.log('===============================================');
    testUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} / ${user.password}`);
    });
    console.log('===============================================');
    console.log('\n💡 Password Pattern: Test[number][special]');
    console.log('   All contain: Uppercase + lowercase + number + special char\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestUsers();
