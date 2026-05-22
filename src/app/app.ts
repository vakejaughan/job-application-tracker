import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobApplication, ApplicationStatus } from './models/job-application.model';
import { JobApplicationService } from './services/job-application';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  statuses: ApplicationStatus[] = [
    'Saved',
    'Applied',
    'Followed Up',
    'Interviewing',
    'Rejected',
    'Offer',
    'Networking'
  ];

  selectedUser: string = '';
  loggedInEmail: string = '';

  isLoggedIn: boolean = false;
  loginUsername: string = '';
  loginPassword: string = '';
  loginError: string = '';

  editingApplicationId: number | null = null;
  selectedFilter: 'All' | ApplicationStatus = 'All';
  searchTerm: string = '';

  newApplication: Omit<JobApplication, 'id'> = {
    company: '',
    role: '',
    location: '',
    dateApplied: '',
    status: 'Saved',
    jobUrl: '',
    notes: ''
  };

  editingApplicationDraft: Omit<JobApplication, 'id'> = {
    company: '',
    role: '',
    location: '',
    dateApplied: '',
    status: 'Saved',
    jobUrl: '',
    notes: ''
  };

  constructor(
    private jobApplicationService: JobApplicationService,
    private authService: AuthService
  ) {}

  get applications(): JobApplication[] {
    return this.jobApplicationService.getApplications();
  }

  get filteredApplications(): JobApplication[] {
    let filtered = this.applications;

    if (this.selectedFilter !== 'All') {
      filtered = filtered.filter(app => app.status === this.selectedFilter);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();

      filtered = filtered.filter(app =>
        app.company.toLowerCase().includes(term) ||
        app.role.toLowerCase().includes(term) ||
        app.location.toLowerCase().includes(term) ||
        app.notes.toLowerCase().includes(term) ||
        app.jobUrl.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  async submitApplication(): Promise<void> {
  if (!this.newApplication.company || !this.newApplication.role) {
    return;
  }

  if (this.editingApplicationId !== null) {
    await this.jobApplicationService.updateApplication(
      this.selectedUser,
      this.editingApplicationId,
      this.newApplication
    );

    this.editingApplicationId = null;
  } else {
    await this.jobApplicationService.addApplication(
      this.selectedUser,
      this.newApplication
    );
  }

  this.newApplication = {
    company: '',
    role: '',
    location: '',
    dateApplied: '',
    status: 'Saved',
    jobUrl: '',
    notes: ''
  };
}

  startEditingApplication(application: JobApplication): void {
    this.editingApplicationId = application.id;

    this.editingApplicationDraft = {
      company: application.company,
      role: application.role,
      location: application.location,
      dateApplied: application.dateApplied,
      status: application.status,
      jobUrl: application.jobUrl,
      notes: application.notes
    };
  }

  async saveInlineEdit(): Promise<void> {
  if (this.editingApplicationId === null) {
    return;
  }

  if (!this.editingApplicationDraft.company || !this.editingApplicationDraft.role) {
    return;
  }

  await this.jobApplicationService.updateApplication(
    this.selectedUser,
    this.editingApplicationId,
    this.editingApplicationDraft
  );

  this.cancelInlineEdit();
}

  cancelInlineEdit(): void {
    this.editingApplicationId = null;

    this.editingApplicationDraft = {
      company: '',
      role: '',
      location: '',
      dateApplied: '',
      status: 'Saved',
      jobUrl: '',
      notes: ''
    };
  }

  async deleteApplication(id: number): Promise<void> {
  const confirmed = confirm('Are you sure you want to delete this application?');

  if (!confirmed) {
    return;
  }

  await this.jobApplicationService.deleteApplication(this.selectedUser, id);
}

  getTotalApplications(): number {
    return this.applications.length;
  }

  getAppliedCount(): number {
    return this.applications.filter(app => app.status === 'Applied').length;
  }

  getInterviewingCount(): number {
    return this.applications.filter(app => app.status === 'Interviewing').length;
  }

  getOfferCount(): number {
    return this.applications.filter(app => app.status === 'Offer').length;
  }

  getRejectedCount(): number {
    return this.applications.filter(app => app.status === 'Rejected').length;
  }

  getNetworkingCount(): number {
    return this.applications.filter(app => app.status === 'Networking').length;
  }

  async login(): Promise<void> {
    try {
      const user = await this.authService.login(
        this.loginUsername,
        this.loginPassword
      );

      this.selectedUser = user.uid;
      this.loggedInEmail = user.email || '';
      this.isLoggedIn = true;
      this.loginError = '';

      await this.jobApplicationService.loadApplications(this.selectedUser);
      this.selectedFilter = 'All';
      this.searchTerm = '';
      this.cancelInlineEdit();
    } catch (error) {
      this.loginError = error instanceof Error
        ? error.message
        : 'Something went wrong while logging in.';
    }
  }

  async createAccount(): Promise<void> {
    try {
      const user = await this.authService.createAccount(
        this.loginUsername,
        this.loginPassword
      );

      this.selectedUser = user.uid;
      this.loggedInEmail = user.email || '';
      this.isLoggedIn = true;
      this.loginError = '';

      await this.jobApplicationService.loadApplications(this.selectedUser);

      this.selectedFilter = 'All';
      this.searchTerm = '';
      this.cancelInlineEdit();
    } catch (error) {
      this.loginError = error instanceof Error
        ? error.message
        : 'Something went wrong while creating your account.';
    }
  }

  async logout(): Promise<void> {
    await this.authService.logout();

    this.isLoggedIn = false;
    this.selectedUser = '';
    this.loggedInEmail = '';

    this.loginUsername = '';
    this.loginPassword = '';
    this.loginError = '';

    this.selectedFilter = 'All';
    this.searchTerm = '';
    this.cancelInlineEdit();
  }
}