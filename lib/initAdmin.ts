import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function initializeDefaultAdmin() {
  try {
    // Check if any user exists
    try {
      const userCount = await prisma.user.count();
      
      // If no users exist, create a default admin
      if (userCount === 0) {
        const hashedPassword = await hashPassword('admin123');
        
        await prisma.user.create({
          data: {
            name: 'Super Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            isAdmin: true,
          },
        });
        
        console.log('Default admin user created');
        return true;
      }
      
      return false;
    } catch (dbError) {
      console.error('Database error during default admin check:', dbError);
      
      // Try creating the admin anyway (first-time use case)
      try {
        const hashedPassword = await hashPassword('admin123');
        
        // Check if user already exists first
        const existingUser = await prisma.user.findUnique({
          where: { email: 'admin@example.com' }
        });
        
        if (existingUser) {
          return false;
        }
        
        await prisma.user.create({
          data: {
            name: 'Super Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            isAdmin: true,
          },
        });
        
        console.log('Default admin user created (recovery path)');
        return true;
      } catch (createError) {
        console.error('Failed to create default admin (recovery path):', createError);
        throw createError;
      }
    }
  } catch (error) {
    console.error('Error initializing default admin:', error);
    return false;
  }
} 