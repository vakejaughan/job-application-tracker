import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
import {
  Auth,
  User,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
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
    this.firebaseApp = getApps().length === 0
      ? initializeApp(environment.firebase)
      : getApp();

    this.auth = getAuth(this.firebaseApp);
  }

  watchAuthState(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, user => {
      this.currentUser = user;
      callback(user);
    });
  }

  async login(email: string, password: string): Promise<User> {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      throw new Error('Please enter both email and password.');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        trimmedEmail,
        trimmedPassword
      );

      this.currentUser = userCredential.user;
      return userCredential.user;
    } catch (error) {
      throw new Error(this.getAuthErrorMessage(error, 'login'));
    }
  }

  async createAccount(email: string, password: string): Promise<User> {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      throw new Error('Please enter both email and password to create an account.');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        trimmedEmail,
        trimmedPassword
      );

      this.currentUser = userCredential.user;
      return userCredential.user;
    } catch (error) {
      throw new Error(this.getAuthErrorMessage(error, 'createAccount'));
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  private getAuthErrorMessage(error: unknown, action: 'login' | 'createAccount'): string {
    const errorCode = this.getFirebaseErrorCode(error);

    if (errorCode === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    }

    if (errorCode === 'auth/invalid-credential') {
      return 'Invalid email or password.';
    }

    if (errorCode === 'auth/email-already-in-use') {
      return 'An account already exists with that email. Try logging in instead.';
    }

    if (errorCode === 'auth/weak-password') {
      return 'Password must be at least 6 characters.';
    }

    if (errorCode === 'auth/too-many-requests') {
      return 'Too many attempts. Please wait a bit and try again.';
    }

    return action === 'login'
      ? 'Unable to log in. Please try again.'
      : 'Unable to create account. Please try again.';
  }

  private getFirebaseErrorCode(error: unknown): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof (error as { code?: unknown }).code === 'string'
    ) {
      return (error as { code: string }).code;
    }

    return '';
  }
}