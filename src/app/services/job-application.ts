import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp, getApp, getApps } from 'firebase/app';
import {
  Firestore,
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';

import { JobApplication, ApplicationStatus } from '../models/job-application.model';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private firebaseApp: FirebaseApp;
  private db: Firestore;

  private applications: JobApplication[] = [];

  constructor() {
    this.firebaseApp = getApps().length === 0
      ? initializeApp(environment.firebase)
      : getApp();

    this.db = getFirestore(this.firebaseApp);
  }

  getApplications(): JobApplication[] {
    return this.applications;
  }

  async loadApplications(userId: string): Promise<void> {
    const applicationsCollection = collection(
      this.db,
      'users',
      userId,
      'applications'
    );

    const snapshot = await getDocs(applicationsCollection);

    this.applications = snapshot.docs.map(documentSnapshot => {
      return documentSnapshot.data() as JobApplication;
    });
  }

  async addApplication(
    userId: string,
    application: Omit<JobApplication, 'id'>
  ): Promise<void> {
    const newApplication: JobApplication = {
      id: Date.now(),
      ...application
    };

    const applicationDoc = doc(
      this.db,
      'users',
      userId,
      'applications',
      String(newApplication.id)
    );

    await setDoc(applicationDoc, newApplication);

    this.applications.push(newApplication);
  }

  async deleteApplication(userId: string, id: number): Promise<void> {
    const applicationDoc = doc(
      this.db,
      'users',
      userId,
      'applications',
      String(id)
    );

    await deleteDoc(applicationDoc);

    this.applications = this.applications.filter(app => app.id !== id);
  }

  async updateStatus(
    userId: string,
    id: number,
    status: ApplicationStatus
  ): Promise<void> {
    const application = this.applications.find(app => app.id === id);

    if (!application) {
      return;
    }

    const updatedApplication: JobApplication = {
      ...application,
      status
    };

    const applicationDoc = doc(
      this.db,
      'users',
      userId,
      'applications',
      String(id)
    );

    await setDoc(applicationDoc, updatedApplication);

    application.status = status;
  }

  async updateApplication(
    userId: string,
    id: number,
    updatedApplication: Omit<JobApplication, 'id'>
  ): Promise<void> {
    const fullUpdatedApplication: JobApplication = {
      id,
      ...updatedApplication
    };

    const applicationDoc = doc(
      this.db,
      'users',
      userId,
      'applications',
      String(id)
    );

    await setDoc(applicationDoc, fullUpdatedApplication);

    const index = this.applications.findIndex(app => app.id === id);

    if (index !== -1) {
      this.applications[index] = fullUpdatedApplication;
    }
  }
}