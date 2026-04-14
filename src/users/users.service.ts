import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { User, Role } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private collection = 'users';

  constructor(private readonly firebaseService: FirebaseService) {}

  async findUsers(role?: Role): Promise<User[]> {
    const ref = this.firebaseService.db.collection(this.collection);
    const snapshot = role
      ? await ref.where('role', '==', role).get()
      : await ref.get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];
  }

  async findUser(id: string): Promise<User> {
    const doc = await this.firebaseService.db
      .collection(this.collection)
      .doc(id)
      .get();

    if (!doc.exists) throw new NotFoundException(`User ${id} not found`);

    return { id: doc.id, ...doc.data() } as User;
  }

  async create(user: User): Promise<User> {
    const newUser = {
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ref = await this.firebaseService.db
      .collection(this.collection)
      .add(newUser);

    return { id: ref.id, ...newUser };
  }

  async update(id: string, updatedUser: Partial<User>): Promise<User> {
    const ref = this.firebaseService.db
      .collection(this.collection)
      .doc(id);

    const doc = await ref.get();
    if (!doc.exists) throw new NotFoundException(`User ${id} not found`);

    await ref.update({
      ...updatedUser,
      updatedAt: new Date().toISOString(),
    });

    return this.findUser(id);
  }

  async delete(id: string): Promise<{ message: string }> {
    const ref = this.firebaseService.db
      .collection(this.collection)
      .doc(id);

    const doc = await ref.get();
    if (!doc.exists) throw new NotFoundException(`User ${id} not found`);

    await ref.delete();
    return { message: `User ${id} deleted successfully` };
  }
}
