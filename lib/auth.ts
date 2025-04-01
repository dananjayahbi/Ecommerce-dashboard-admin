import { compare, hash } from 'bcrypt';

// Function to hash a password
export async function hashPassword(password: string) {
  return await hash(password, 12);
}

// Function to compare a password with a hash
export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword);
} 