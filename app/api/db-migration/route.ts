import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // This should only be run by an admin with proper authorization
    // In a production environment, add more security checks here
    // For example, check for a specific API key in the request headers

    // Find all users with isAdmin field but no role field
    const usersToMigrate = await prisma.user.findMany({
      where: {
        isAdmin: { not: undefined }
      }
    });

    const results = [];

    // Update each user
    for (const user of usersToMigrate) {
      // Determine the role based on isAdmin
      let role = 'Member';
      if (user.isAdmin === true) {
        role = 'Super-Admin';
      }

      // Update the user with the new role field
      try {
        // Update directly in the MongoDB collection
        await prisma.$runCommandRaw({
          update: "User",
          updates: [
            {
              q: { _id: { $oid: user.id } },
              u: { 
                $set: { role: role },
                // If you want to remove the old field, uncomment this:
                // $unset: { isAdmin: "" }
              }
            }
          ]
        });

        results.push({
          id: user.id,
          email: user.email,
          oldValue: { isAdmin: user.isAdmin },
          newValue: { role: role },
          status: 'success'
        });
      } catch (updateError) {
        results.push({
          id: user.id,
          email: user.email,
          error: updateError.message,
          status: 'error'
        });
      }
    }

    return NextResponse.json({
      migrated: results.length,
      details: results
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during migration', details: error.message },
      { status: 500 }
    );
  }
} 