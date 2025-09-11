import mongoose from 'mongoose';

// Simple schemas
const classSchema = new mongoose.Schema({
  name: String,
  grade: Number,
  subject: String,
  teacherId: mongoose.Schema.Types.ObjectId,
  students: [mongoose.Schema.Types.ObjectId]
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String,
  role: { type: String, enum: ['student', 'teacher', 'admin'] },
  pin: String,
  grade: Number,
  classId: mongoose.Schema.Types.ObjectId,
  email: String,
  password: String,
  stats: {
    totalPoints: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    badgesEarned: { type: Number, default: 0 },
    lessonsCompleted: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: Date.now }
  },
  preferences: {
    language: { type: String, default: 'en' },
    theme: { type: String, default: 'light' },
    soundEnabled: { type: Boolean, default: true },
    notificationsEnabled: { type: Boolean, default: true }
  }
}, { timestamps: true, discriminatorKey: 'role' });

const Class = mongoose.model('Class', classSchema);
const User = mongoose.model('User', userSchema);
const Student = User.discriminator('student', new mongoose.Schema({}));
const Teacher = User.discriminator('teacher', new mongoose.Schema({}));

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    await mongoose.connect('mongodb://localhost:27017/rural-education');
    console.log('✅ Connected to database');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Class.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create classes
    console.log('📚 Creating classes...');
    const grade6A = new Class({
      name: 'Grade 6A',
      grade: 6,
      subject: 'General',
      teacherId: null,
      students: []
    });
    await grade6A.save();
    console.log('✅ Created class: Grade 6A');

    const grade7A = new Class({
      name: 'Grade 7A',
      grade: 7,
      subject: 'General',
      teacherId: null,
      students: []
    });
    await grade7A.save();
    console.log('✅ Created class: Grade 7A');

    // Create students
    console.log('👨‍🎓 Creating students...');
    const student1 = new Student({
      name: 'Arjun Singh',
      role: 'student',
      pin: '1234',
      grade: 6,
      classId: grade6A._id,
      stats: {
        totalPoints: 150,
        level: 2,
        streak: 3,
        badgesEarned: 2,
        lessonsCompleted: 5,
        gamesPlayed: 8,
        totalTimeSpent: 120,
        lastActiveDate: new Date()
      },
      preferences: {
        language: 'en',
        theme: 'light',
        soundEnabled: true,
        notificationsEnabled: true
      }
    });
    await student1.save();
    console.log('✅ Created student: Arjun Singh (PIN: 1234)');

    const student2 = new Student({
      name: 'Priya Patel',
      role: 'student',
      pin: '5678',
      grade: 6,
      classId: grade6A._id,
      stats: {
        totalPoints: 200,
        level: 2,
        streak: 5,
        badgesEarned: 3,
        lessonsCompleted: 7,
        gamesPlayed: 12,
        totalTimeSpent: 180,
        lastActiveDate: new Date()
      },
      preferences: {
        language: 'hi',
        theme: 'light',
        soundEnabled: true,
        notificationsEnabled: true
      }
    });
    await student2.save();
    console.log('✅ Created student: Priya Patel (PIN: 5678)');

    // Update class with students
    grade6A.students = [student1._id, student2._id];
    await grade6A.save();

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('Students:');
    console.log('  Name: Arjun Singh, PIN: 1234, Class: Grade 6A');
    console.log('  Name: Priya Patel, PIN: 5678, Class: Grade 6A');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

seedDatabase();
