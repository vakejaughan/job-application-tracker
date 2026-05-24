# Job Application Tracker

A full-stack job application tracking web app built with Angular and Firebase.

Users can create an account, log in, and manage their own job applications with searchable, filterable, per-user data.

**Live Demo:** https://job-application-tracker-d9c37.web.app

---

## Overview

Job Application Tracker helps users organize their job search by tracking applications, statuses, notes, job listing links, and application dates in one place.

This project started as an Angular practice app and was gradually expanded into a hosted full-stack application using Firebase Authentication, Cloud Firestore, Firebase Hosting, and Firestore security rules.

---

## Features

- Create an account and log in with Firebase Authentication
- Stay logged in across page refreshes
- Add job applications
- Edit applications inline
- Delete applications with confirmation
- Search applications by company, role, location, notes, or job URL
- Filter applications by status
- View dashboard stats for application statuses
- Store application data per authenticated user in Cloud Firestore
- Protect user data with Firestore security rules
- Responsive UI
- Custom favicon and polished empty states
- Hosted publicly with Firebase Hosting

---

## Tech Stack

- Angular
- TypeScript
- Firebase Authentication
- Cloud Firestore
- Firebase Hosting
- HTML
- CSS
- Git

---

## Application Statuses

Applications can be tracked with the following statuses:

- Saved
- Applied
- Followed Up
- Interviewing
- Rejected
- Offer
- Networking

---

## Firebase Structure

Application data is stored in Cloud Firestore using the authenticated user's Firebase UID.

    users
    └── {uid}
        └── applications
            └── {applicationId}
                ├── company
                ├── role
                ├── location
                ├── dateApplied
                ├── status
                ├── jobUrl
                └── notes

---

## Security Rules

Firestore security rules are configured so users can only read and write their own application data.

    rules_version = '2';

    service cloud.firestore {
      match /databases/{database}/documents {

        match /users/{userId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;

          match /applications/{applicationId} {
            allow read, write: if request.auth != null && request.auth.uid == userId;
          }
        }
      }
    }

---

## What I Learned

Through this project, I practiced:

- Building a standalone Angular application
- Managing component state with TypeScript
- Using template-driven forms with ngModel
- Creating reusable services
- Moving from localStorage to a real cloud database
- Implementing Firebase Authentication
- Structuring per-user Firestore data
- Writing Firestore security rules
- Deploying an Angular app with Firebase Hosting
- Using Git to checkpoint stable project builds
- Debugging real-world frontend and Firebase integration issues

---

## Future Improvements

Possible future features include:

- Add application timestamps with createdAt and updatedAt
- Add sorting by newest, oldest, company, and status
- Add stronger form validation messages
- Add password reset
- Add user profile settings
- Add contact/networking fields
- Add follow-up reminder dates
- Add CSV export
- Improve mobile styling
- Add automated deployment through GitHub Actions

## Author

Built by Jake Vaughan as a full-stack Angular/Firebase practice project.