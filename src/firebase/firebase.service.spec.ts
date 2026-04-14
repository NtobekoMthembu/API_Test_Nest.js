import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../firebase-service-account.json';

@Injectable()
export class FirebaseService implements OnModuleInit {
  public db: admin.firestore.Firestore;

  onModuleInit() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });
    }
    this.db = admin.firestore();
  }
}
