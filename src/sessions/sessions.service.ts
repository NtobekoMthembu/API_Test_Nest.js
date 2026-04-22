import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Session } from './interfaces/session.interface';

@Injectable()
export class SessionsService {
  private collection = 'sessions';

  constructor(private readonly firebaseService: FirebaseService) {}
  // session created everytime a user login
  async createSession(data: Partial<Session>): Promise<Session> {
    const session: Session = {
      userId: data.userId!,
      userName: data.userName!,
      email: data.email!,
      loginTime: new Date().toISOString(),
      logoutTime: null,
      duration: null,
      isActive: true,
    };

    const ref = await this.firebaseService.db
      .collection(this.collection)
      .add(session);

    return { id: ref.id, ...session };
  }
 // end session after user logged ou and calculate the time user spent 
  async endSession(sessionId: string): Promise<Session> {
    const ref = this.firebaseService.db
      .collection(this.collection)
      .doc(sessionId);

    const doc = await ref.get();
    const data = doc.data() as Session;

    const logoutTime = new Date().toISOString();
    const duration = this.calculateDuration(data.loginTime, logoutTime);

    await ref.update({
      logoutTime,
      duration,
      isActive: false,
    });

    return { id: sessionId, ...data, logoutTime, duration, isActive: false };
  }
 // find all active users
  async findActiveSessions(): Promise<Session[]> {
    const snapshot = await this.firebaseService.db
      .collection(this.collection)
      .where('isActive', '==', true)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Session[];
  }
 // find all sessions history and order by login time
  async findAllSessions(): Promise<Session[]> {
    const snapshot = await this.firebaseService.db
      .collection(this.collection)
      .orderBy('loginTime', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Session[];
  }
 // find session(s) belong to specific user
  async findUserSessions(userId: string): Promise<Session[]> {
  const snapshot = await this.firebaseService.db
    .collection(this.collection)
    .where('userId', '==', userId)
    .get(); // ← removed .orderBy('loginTime', 'desc')

  const sessions = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Session[];

  // Sort in JavaScript instead of Firestore
  return sessions.sort(
    (a, b) =>
      new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime(),
  );
}
 // calcutate duration user spent logged in hour:minutes
  private calculateDuration(loginTime: string, logoutTime: string): string {
    const login = new Date(loginTime).getTime();
    const logout = new Date(logoutTime).getTime();
    const diffMs = logout - login;
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;

    if (hours === 0) return `${minutes} minutes`;
    if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
  }
}