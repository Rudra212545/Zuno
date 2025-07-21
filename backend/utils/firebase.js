import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';

// Path to service account file
const serviceAccountPath = path.resolve(process.cwd(), './firebase-service-account.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'your-project-id.appspot.com', // ✅ Replace this with your actual Firebase project’s storage bucket
  });
}

// ✅ Export the Firebase bucket instance
const bucket = admin.storage().bucket();

export { admin, bucket };
