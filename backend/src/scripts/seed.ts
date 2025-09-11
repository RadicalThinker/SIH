then iimport mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Student, Teacher, Class } from '../models/User.js';
import { Class as ClassModel } from '../models/Class.js';
import logger from '../utils/logger.js';

// Sample data
const sampleClasses = [
  {
    name: 'Grade 6A',
    grade: 6,
    subject: 'General',
    teacherId: null, // Will be set after teacher creation
    students: []
  },
  {
    name: 'Grade 7A',
    grade: 7,
    subject: 'General',
    teacherId: null,
    students: []
  },
  {
    name: 'Grade 8A',
    grade: 8,
    subject: 'General',
    teacherId: null,
    students: []
  }
];

const sampleTeachers = [
  {
    name: 'Mrs. Priya Sharma',
    email: 'priya.sharma@school.com',
    password: 'teacher123',
    subjects: ['math', 'science'],
    classes: []
  },
  {
    name: 'Mr. Rajesh Kumar',
    email: 'rajesh.kumar@school.com',
    password: 'teacher123',
    subjects: ['english', 'physics'],
    classes: []
  }
];

const sampleStudents = [
  {
    name: 'Arjun Singh',
    pin: '1234',
    grade: 6,
    classId: null, // Will be set after class creation
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
  },
  {
    name: 'Priya Patel',
    pin: '5678',
    grade: 6,
    classId: null,
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
  },
  {
    name: 'Rahul Verma',
    pin: '9012',
    grade: 7,
    classId: null,
    stats: {
      totalPoints: 300,
      level: 3,
      streak: 7,
      badgesEarned: 5,
      lessonsCompleted: 10,
      gamesPlayed: 15,
      totalTimeSpent: 250,
      lastActiveDate: new Date()
    },
    preferences: {
      language: 'en',
      theme: 'dark',
      soundEnabled: false,
      notificationsEnabled: true
    }
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    // Connect to database
    await mongoose.connect('mongodb://localhost:27017/rural-education');
    
    logger.info('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await ClassModel.deleteMany({});
    
    logger.info('🗑️ Cleared existing data');
    console.log('✅ Cleared existing data');

    // Create classes
    console.log('📚 Creating classes...');
    const createdClasses = [];
    for (const classData of sampleClasses) {
      const newClass = new ClassModel(classData);
      await newClass.save();
      createdClasses.push(newClass);
      logger.info(`✅ Created class: ${newClass.name}`);
      console.log(`✅ Created class: ${newClass.name}`);
    }

    // Create teachers
    const createdTeachers = [];
    for (let i = 0; i < sampleTeachers.length; i++) {
      const teacherData = sampleTeachers[i];
      const classId = createdClasses[i]?._id;
      
      const teacher = new Teacher({
        ...teacherData,
        classes: classId ? [classId] : []
      });
      
      await teacher.save();
      createdTeachers.push(teacher);
      
      // Update class with teacher ID
      if (classId) {
        await ClassModel.findByIdAndUpdate(classId, { teacherId: teacher._id });
      }
      
      logger.info(`✅ Created teacher: ${teacher.name}`);
    }

    // Create students
    for (let i = 0; i < sampleStudents.length; i++) {
      const studentData = sampleStudents[i];
      const classIndex = Math.floor(i / 2); // Distribute students across classes
      const classId = createdClasses[classIndex]?._id;
      
      const student = new Student({
        ...studentData,
        classId: classId
      });
      
      await student.save();
      
      // Update class with student ID
      if (classId) {
        await ClassModel.findByIdAndUpdate(
          classId, 
          { $push: { students: student._id } }
        );
      }
      
      logger.info(`✅ Created student: ${student.name} (PIN: ${studentData.pin})`);
    }

    logger.info('🎉 Database seeding completed successfully!');
    logger.info('\n📋 Sample Login Credentials:');
    logger.info('Teachers:');
    sampleTeachers.forEach(teacher => {
      logger.info(`  Email: ${teacher.email}, Password: ${teacher.password}`);
    });
    logger.info('Students:');
    sampleStudents.forEach(student => {
      logger.info(`  Name: ${student.name}, PIN: ${student.pin}`);
    });

  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    logger.info('🔌 Database connection closed');
  }
}

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      logger.info('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
