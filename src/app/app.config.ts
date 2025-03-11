import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()), provideFirebaseApp(() => initializeApp({ projectId: "join-52e31", appId: "1:290584592371:web:a52999eaaabf744119dc86", storageBucket: "join-52e31.firebasestorage.app", apiKey: "AIzaSyCQy7vwff4IXLJGmuVv8k_hgDdYTTx2tpE", authDomain: "join-52e31.firebaseapp.com", messagingSenderId: "290584592371" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
