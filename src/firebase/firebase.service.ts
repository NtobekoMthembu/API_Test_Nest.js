import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  public db!: admin.firestore.Firestore;

  onModuleInit() {
    if (!admin.apps.length) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
      const serviceAccount = require('../../firebase-service-account.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    this.db = admin.firestore();
  }
}