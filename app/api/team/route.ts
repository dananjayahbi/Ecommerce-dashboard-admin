import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

// GET /api/team - Get all team members
export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all users except the current user
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: session.user.id
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// POST /api/team - Add a new team member
export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated and has appropriate role
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only Super-Admin and Admin can add team members
    if (session.user.role !== 'Super-Admin' && session.user.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, password, role = 'Member' } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Only Super-Admin can create Admin users
    if (role === 'Admin' && session.user.role !== 'Super-Admin') {
      return NextResponse.json(
        { error: 'Only Super-Admin can create Admin users' },
        { status: 403 }
      );
    }

    // Nobody can create Super-Admin users except another Super-Admin
    if (role === 'Super-Admin' && session.user.role !== 'Super-Admin') {
      return NextResponse.json(
        { error: 'Only Super-Admin can create Super-Admin users' },
        { status: 403 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}

// PATCH /api/team/:id - Update a team member
export async function PATCH(req: NextRequest) {
  try {
    // Check if user is authenticated and has appropriate role
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract the ID from the URL
    const id = req.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get the user to update
    const userToUpdate = await prisma.user.findUnique({
      where: { id }
    });

    if (!userToUpdate) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Permission checks
    // - Super-Admin can update any user
    // - Admin can only update Members
    // - Nobody can update themselves through this endpoint
    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot update your own account through this endpoint' },
        { status: 403 }
      );
    }

    if (session.user.role === 'Admin') {
      // Admins can't update other Admins or Super-Admins
      if (userToUpdate.role === 'Admin' || userToUpdate.role === 'Super-Admin') {
        return NextResponse.json(
          { error: 'Admin cannot update other Admins or Super-Admins' },
          { status: 403 }
        );
      }
    }

    if (session.user.role === 'Member') {
      return NextResponse.json(
        { error: 'Members cannot update user accounts' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password, role } = body;

    // Prepare update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    
    // Role update permissions
    if (role) {
      // Only Super-Admin can assign Super-Admin role
      if (role === 'Super-Admin' && session.user.role !== 'Super-Admin') {
        return NextResponse.json(
          { error: 'Only Super-Admin can assign Super-Admin role' },
          { status: 403 }
        );
      }

      // Only Super-Admin can change a user to/from Admin role
      if ((role === 'Admin' || userToUpdate.role === 'Admin') && session.user.role !== 'Super-Admin') {
        return NextResponse.json(
          { error: 'Only Super-Admin can assign or remove Admin role' },
          { status: 403 }
        );
      }

      updateData.role = role;
    }

    // Hash password if provided
    if (password) {
      updateData.password = await hashPassword(password);
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

// DELETE /api/team/:id - Delete a team member
export async function DELETE(req: NextRequest) {
  try {
    // Check if user is authenticated and has appropriate role
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract the ID from the URL
    const id = req.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get the user to delete
    const userToDelete = await prisma.user.findUnique({
      where: { id }
    });

    if (!userToDelete) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Permission checks
    // - Super-Admin can delete any user
    // - Admin can only delete Members
    // - Nobody can delete themselves
    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 403 }
      );
    }

    if (session.user.role === 'Admin') {
      // Admins can't delete other Admins or Super-Admins
      if (userToDelete.role === 'Admin' || userToDelete.role === 'Super-Admin') {
        return NextResponse.json(
          { error: 'Admin cannot delete other Admins or Super-Admins' },
          { status: 403 }
        );
      }
    }

    if (session.user.role === 'Member') {
      return NextResponse.json(
        { error: 'Members cannot delete user accounts' },
        { status: 403 }
      );
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
} 