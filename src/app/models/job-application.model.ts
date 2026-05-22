export type ApplicationStatus =
  | 'Saved'
  | 'Applied'
  | 'Followed Up'
  | 'Interviewing'
  | 'Rejected'
  | 'Offer'
  | 'Networking';

export interface JobApplication {
  id: number;
  company: string;
  role: string;
  location: string;
  dateApplied: string;
  status: ApplicationStatus;
  jobUrl: string;
  notes: string;
}