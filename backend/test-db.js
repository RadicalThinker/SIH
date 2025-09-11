import mongoose from 'mongoose';

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    await mongoose.connect('mongodb://localhost:27017/rural-education-test');
    console.log('✅ Database connected successfully!');
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ name: String });
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = new TestModel({ name: 'Test Document' });
    await testDoc.save();
    console.log('✅ Test document created successfully!');
    
    // Clean up
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document cleaned up!');
    
    await mongoose.connection.close();
    console.log('🔌 Database connection closed!');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();
