import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Type definition for params
type RouteParams = {
  params: {
    id: string;
  };
};

// Helper function to safely get the id parameter
async function getIdParam(params: RouteParams['params']): Promise<string> {
  // Await the params object to satisfy Next.js requirements
  return params.id;
}

// GET /api/team/{id} - Get specific team member
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check if user is authenticated and has appropriate role
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only Admin and Super-Admin should access the team management
    if (session.user.role !== 'Admin' && session.user.role !== 'Super-Admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Safely get the ID parameter
    const id = await getIdParam(params);

    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password field
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team member' },
      { status: 500 }
    );
  }
}

// PUT /api/team/{id} - Update a team member
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check if user is authenticated and has appropriate role
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only Admin and Super-Admin should access the team management
    if (session.user.role !== 'Admin' && session.user.role !== 'Super-Admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }
    
    // Safely get the ID parameter
    const id = await getIdParam(params);
    
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

    // Permission checks for specific roles
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
    
    const body = await request.json();
    const { name, email, role, password } = body;

    // Validation
    if (!name && !email && !role && !password) {
      return NextResponse.json(
        { error: 'At least one field must be provided for update' },
        { status: 400 }
      );
    }

    // Check if email is being changed and if it already exists
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: id },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }
    }

    // Prepare data for update
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    
    // Role update permissions
    if (role) {
      // Cannot change role to Super-Admin
      if (role === 'Super-Admin' && userToUpdate.role !== 'Super-Admin') {
        return NextResponse.json(
          { error: 'Cannot change users to Super-Admin role' },
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

    // Handle password update if provided
    if (password) {
      const { hashPassword } = await import('@/lib/auth');
      updateData.password = await hashPassword(password);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

// DELETE /api/team/{id} - Delete a team member
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check if user is authenticated and has appropriate role
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only Admin and Super-Admin should access the team management
    if (session.user.role !== 'Admin' && session.user.role !== 'Super-Admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Safely get the ID parameter
    const id = await getIdParam(params);
    
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

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
} 