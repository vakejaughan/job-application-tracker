import { Injectable } from '@angular/core';
import { JobApplication, ApplicationStatus } from '../models/job-application.model';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private getStorageKey(user: string): string {
    return `jobApplications_${user}`;
  }

  private starterApplications: JobApplication[] = [
    {
      id: 1,
      company: 'Warner Music Group',
      role: 'Digital Media Operations Assistant',
      location: 'New York, NY',
      dateApplied: '2026-05-17',
      status: 'Applied',
      notes: 'Asked for salary expectations.',
      jobUrl: 'https://google.com'
    },
    {
      id: 2,
      company: 'JPMorgan',
      role: 'Private Bank Analyst',
      location: 'New York, NY',
      dateApplied: '2026-05-16',
      status: 'Saved',
      notes: 'Need to tailor resume before applying.',
      jobUrl: 'https://google.com' 
    }
  ];

  private applications: JobApplication[] = [];

  constructor() {}

  getApplications(): JobApplication[] {
    return this.applications;
  }

  addApplication(user: string, application: Omit<JobApplication, 'id'>): void {
    const newApplication: JobApplication ={
      id: Date.now(),
      ...application
    };
    this.applications.push(newApplication);
    this.saveToLocalStorage(user);
  }

  deleteApplication(user: string, id: number): void {
    this.applications = this.applications.filter(app => app.id !== id);
    this.saveToLocalStorage(user);
  }

  updateStatus(user: string, id: number, status: ApplicationStatus): void {
    const application = this.applications.find(app => app.id === id);

    if (application) {
      application.status = status;
      this.saveToLocalStorage(user);
    }
  }

  updateApplication(
    user: string,
    id: number,
    updatedApplication: Omit<JobApplication, 'id'>): void {
      const index = this.applications.findIndex(app => app.id === id);

      if (index !== -1) {
        this.applications[index] = {
          id,
          ...updatedApplication
        };
        this.saveToLocalStorage(user);
      }
  }

  private saveToLocalStorage(user: string): void {
    localStorage.setItem(this.getStorageKey(user), JSON.stringify(this.applications));
  }

  loadFromLocalStorage(user: string): void {
   const savedApplications = localStorage.getItem(this.getStorageKey(user));
    if (savedApplications) {
      this.applications = JSON.parse(savedApplications);
    } else if (user === 'Jake'){
      this.applications = [...this.starterApplications];
      this.saveToLocalStorage(user);
    } else {
      this.applications = [];
    }
  }
}