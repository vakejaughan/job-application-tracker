import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  Auth,
  User,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firebaseApp: FirebaseApp;
  private auth: Auth;
  private currentUser: User | null = null;

  constructor() {
    this.firebaseApp = initializeApp(environment.firebase);
    this.auth = getAuth(this.firebaseApp);
  }

  async login(email: string, password: string): Promise<User> {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      throw new Error('Please enter both email and password.');
    }

    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      trimmedEmail,
      trimmedPassword
    );

    this.currentUser = userCredential.user;
    return userCredential.user;
  }

  async createAccount(email: string, password: string): Promise<User> {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      throw new Error('Please enter both email and password to create an account.');
    }

    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      trimmedEmail,
      trimmedPassword
    );

    this.currentUser = userCredential.user;
    return userCredential.user;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}