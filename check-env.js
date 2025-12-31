import { promises as fs } from "fs";
import dotenv from "dotenv";

async function checkEnvironment() {
  try {
    // Check if .env file exists
    await fs.access('.env');
    console.log('✅ .env file found');
    
    // Load and validate environment variables
    dotenv.config();
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in .env file!');
      console.error('Please add your MongoDB connection string to .env:');
      console.error('MONGODB_URI=your_mongodb_connection_string_here');
      process.exit(1);
    }
    
    console.log('✅ Environment configuration is valid');
    console.log('Starting Meow Meow Pet Shop application...');
    
  } catch (error) {
    console.error('❌ .env file not found!');
    console.error('Please create .env file with MONGODB_URI before running the project.');
    console.error('Example content:');
    console.error('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
    process.exit(1);
  }
}

await checkEnvironment();