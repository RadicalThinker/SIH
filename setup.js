#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Rural Education Gamified Learning Platform...\n');

// Function to copy environment files
function setupEnvironment() {
  console.log('📝 Setting up environment files...');
  
  // Backend environment
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  const backendEnvExamplePath = path.join(__dirname, 'backend', 'env.example');
  
  if (!fs.existsSync(backendEnvPath) && fs.existsSync(backendEnvExamplePath)) {
    fs.copyFileSync(backendEnvExamplePath, backendEnvPath);
    console.log('✅ Created backend/.env from env.example');
  }
  
  // Frontend environment
  const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
  const frontendEnvExamplePath = path.join(__dirname, 'frontend', 'env.example');
  
  if (!fs.existsSync(frontendEnvPath) && fs.existsSync(frontendEnvExamplePath)) {
    fs.copyFileSync(frontendEnvExamplePath, frontendEnvPath);
    console.log('✅ Created frontend/.env from env.example');
  }
}

// Function to install dependencies
function installDependencies() {
  console.log('\n📦 Installing dependencies...');
  
  try {
    console.log('Installing backend dependencies...');
    execSync('npm install', { cwd: path.join(__dirname, 'backend'), stdio: 'inherit' });
    console.log('✅ Backend dependencies installed');
    
    console.log('Installing frontend dependencies...');
    execSync('npm install', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });
    console.log('✅ Frontend dependencies installed');
  } catch (error) {
    console.error('❌ Error installing dependencies:', error.message);
    process.exit(1);
  }
}

// Function to create necessary directories
function createDirectories() {
  console.log('\n📁 Creating necessary directories...');
  
  const directories = [
    'backend/logs',
    'backend/uploads',
    'backend/games',
    'frontend/public/locales'
  ];
  
  directories.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
}

// Function to generate JWT secret
function generateJWTSecret() {
  console.log('\n🔐 Generating JWT secret...');
  
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  if (fs.existsSync(backendEnvPath)) {
    let envContent = fs.readFileSync(backendEnvPath, 'utf8');
    
    if (envContent.includes('your-jwt-secret-key-minimum-32-characters-long')) {
      const jwtSecret = require('crypto').randomBytes(32).toString('hex');
      envContent = envContent.replace(
        'your-jwt-secret-key-minimum-32-characters-long',
        jwtSecret
      );
      fs.writeFileSync(backendEnvPath, envContent);
      console.log('✅ Generated secure JWT secret');
    }
  }
}

// Function to display next steps
function displayNextSteps() {
  console.log('\n🎉 Setup completed successfully!\n');
  console.log('📋 Next steps:');
  console.log('1. Start MongoDB service:');
  console.log('   Windows: net start MongoDB');
  console.log('   macOS/Linux: sudo systemctl start mongod');
  console.log('');
  console.log('2. Seed the database:');
  console.log('   cd backend && npm run seed');
  console.log('');
  console.log('3. Start the development servers:');
  console.log('   Terminal 1: cd backend && npm run dev');
  console.log('   Terminal 2: cd frontend && npm run dev');
  console.log('');
  console.log('4. Access the application:');
  console.log('   Frontend: http://localhost:5173');
  console.log('   Backend API: http://localhost:5000');
  console.log('');
  console.log('🔑 Demo Login Credentials:');
  console.log('   Students:');
  console.log('     - PIN: 1234, Class ID: Grade 6A');
  console.log('     - PIN: 5678, Class ID: Grade 6A');
  console.log('     - PIN: 9012, Class ID: Grade 7A');
  console.log('   Teachers:');
  console.log('     - Email: priya.sharma@school.com, Password: teacher123');
  console.log('     - Email: rajesh.kumar@school.com, Password: teacher123');
  console.log('');
  console.log('📚 Documentation:');
  console.log('   - README.md - Project overview');
  console.log('   - GETTING_STARTED.md - Detailed setup guide');
  console.log('   - .cursor/rules/ - Development guidelines');
}

// Main setup function
async function main() {
  try {
    setupEnvironment();
    createDirectories();
    generateJWTSecret();
    installDependencies();
    displayNextSteps();
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
main();
