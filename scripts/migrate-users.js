// This script migrates users from the old isAdmin field to the new role field
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function main() {
  // Connection URL
  const url = process.env.DATABASE_URL;
  const client = new MongoClient(url);

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB');

    // Get database name from connection string
    const dbName = url.split('/').pop().split('?')[0];
    const db = client.db(dbName);
    
    // Get the users collection
    const usersCollection = db.collection('User');
    
    // Find all users with isAdmin field
    const users = await usersCollection.find({ isAdmin: { $exists: true } }).toArray();
    
    console.log(`Found ${users.length} users to migrate`);
    
    let succeeded = 0;
    let failed = 0;
    
    // Update each user
    for (const user of users) {
      try {
        const role = user.isAdmin === true ? 'Super-Admin' : 'Member';
        
        // Update the user with the new role field
        const result = await usersCollection.updateOne(
          { _id: user._id },
          { 
            $set: { role: role }
            // If you want to remove the old field, uncomment this:
            // $unset: { isAdmin: "" }
          }
        );
        
        if (result.modifiedCount === 1) {
          console.log(`Successfully updated user ${user.email} from isAdmin=${user.isAdmin} to role=${role}`);
          succeeded++;
        } else {
          console.log(`No changes made for user ${user.email}`);
        }
      } catch (error) {
        console.error(`Error updating user ${user.email}:`, error);
        failed++;
      }
    }
    
    console.log(`Migration complete: ${succeeded} succeeded, ${failed} failed`);
    
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}

main().catch(console.error); 