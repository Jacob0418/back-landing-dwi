import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from './model';
import { connect, getMongoId } from '../../shared/database/mongodb';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export async function createUser(user: User): Promise<User> {
    const db = await connect();
    const collection = db.collection<User>('users');
    
    user.password = await bcrypt.hash(user.password, 10);
    user.role = user.role || 'user';
    
    const result = await collection.insertOne({
        ...user,
        createdAt: new Date(),
    });
    
    return { ...user, _id: result.insertedId.toString(), createdAt: new Date() };
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const db = await connect();
    const collection = db.collection<User>('users');
    
    return collection.findOne({ email });
}

// export async function getUserById(id: string): Promise<User | null> {
//     const db = await connect();
//     const collection = db.collection<User>('users');
    
//     const mongoId = getMongoId(id);
//     if (!mongoId) return null;
    
//     return collection.findOne({ _id: mongoId });
// }

// export async function updateUser(id: string, userData: Partial<User>): Promise<User | null> {
//     const db = await connect();
//     const collection = db.collection<User>('users');
    
//     const mongoId = getMongoId(id);
//     if (!mongoId) return null;
    
//     if (userData.password) {
//         userData.password = await bcrypt.hash(userData.password, 10);
//     }
    
//     const result = await collection.findOneAndUpdate(
//         { _id: mongoId },
//         { $set: userData },
//         { returnDocument: 'after' }
//     );
    
//     return result.value || null;
// }

// export async function deleteUser(id: string): Promise<boolean> {
//     const db = await connect();
//     const collection = db.collection<User>('users');
    
//     const mongoId = getMongoId(id);
//     if (!mongoId) return false;
    
//     const result = await collection.deleteOne({ _id: mongoId });
    
//     return result.deletedCount === 1;
// }

export function generateToken(user: User): string {
    const payload = { id: user._id, email: user.email, role: user.role };
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
}

export function verifyToken(token: string): { id: string; email: string } | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY) as { id: string; email: string, role: string };
        return decoded;
    } catch (error) {
        return null;
    }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await getUserByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;
    console.log('User authenticated successfully:', user);
    return user;
}