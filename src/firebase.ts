import admin, { ServiceAccount } from 'firebase-admin';
import { serviceAccount } from '@app/config';
import { debug } from '@app/core';

export const bootstrapFirebase = (): void => {
  admin.initializeApp({
    credential: admin.credential.cert((serviceAccount as unknown) as ServiceAccount),
  });
  if (debug()) {
    global.console.log(`Firebase Admin is ready. `);
  }
};
