import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from '../firebase/firebase.service';
import { SessionsService } from '../sessions/sessions.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/interfaces/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private collection = 'users';

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if email already exists
    const existing = await this.firebaseService.db
      .collection(this.collection)
      .where('email', '==', registerDto.email)
      .get();

    if (!existing.empty) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const newUser: User = {
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role,
      isOnline: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ref = await this.firebaseService.db
      .collection(this.collection)
      .add(newUser);

    // Return user without password
    const { password, ...result } = newUser;
    return { id: ref.id, ...result };
  }

  async login(loginDto: LoginDto) {
    // Find user by email
    const snapshot = await this.firebaseService.db
      .collection(this.collection)
      .where('email', '==', loginDto.email)
      .get();

    if (snapshot.empty) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userDoc = snapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() } as User;

    // Verify password
    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password!,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update user online status
    await this.firebaseService.db
      .collection(this.collection)
      .doc(user.id!)
      .update({
        isOnline: true,
        updatedAt: new Date().toISOString(),
      });

    // Record session
    const session = await this.sessionsService.createSession({
      userId: user.id,
      userName: user.name,
      email: user.email,
    });

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isOnline: true,
      },
    };
  }

  async logout(userId: string, sessionId: string) {
    // Update user online status
    await this.firebaseService.db
      .collection(this.collection)
      .doc(userId)
      .update({
        isOnline: false,
        updatedAt: new Date().toISOString(),
      });

    // End session and record logout time
    await this.sessionsService.endSession(sessionId);

    return { message: 'Logged out successfully' };
  }

  async getMe(userId: string) {
    const doc = await this.firebaseService.db
      .collection(this.collection)
      .doc(userId)
      .get();

    if (!doc.exists) {
      throw new UnauthorizedException('User not found');
    }

    const user = { id: doc.id, ...doc.data() } as User;
    const { password, ...result } = user;
    return result;
  }
}
