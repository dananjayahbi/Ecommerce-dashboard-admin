import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // This should only be run by an authorized user
    // In production, add proper authorization checks
    
    // Find the admin user with email "admin@example.com"
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });
    
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }
    
    // Update the user to have role "Super-Admin"
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { role: 'Super-Admin' }
    });
    
    return NextResponse.json({ 
      message: 'Admin user updated successfully', 
      email: adminUser.email 
    });
  } catch (error) {
    console.error('Error fixing admin user:', error);
    return NextResponse.json(
      { error: 'Failed to fix admin user', details: error.message },
      { status: 500 }
    );
  }
} 