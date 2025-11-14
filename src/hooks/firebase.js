import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCojZyf2FmbM9q2JKRM7E7sbnXakYLlOkE',
  authDomain: 'plink-qr.firebaseapp.com',
  databaseURL: 'https://plink-qr-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'plink-qr',
  storageBucket: 'plink-qr.firebasestorage.app',
  messagingSenderId: '568064223872',
  appId: '1:568064223872:web:9fbd2f4d7cb29d808d5465',
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
