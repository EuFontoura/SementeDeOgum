# Semente de Ogum — ENEM Mock Exam Platform  
## AI Workflow & Technical Constraints Specification

## 1. Project Overview
**Semente de Ogum** is a web-based ENEM mock exam platform designed for students and teachers, built entirely on Firebase services using the free tier.

Due to free plan limitations, specific strategies are applied for authentication, data storage, and image handling.

---

## 2. Infrastructure & Stack

### Backend Services
- **Firebase Authentication**
- **Firebase Firestore (Free Plan)**
- **No Firebase Storage usage**

### Frontend
- Web-based application
- Role-based UI rendering (Student / Teacher)

---

## 3. Authentication (Firebase Auth)
- Email and password authentication
- Firebase-managed sessions
- Role association stored in Firestore
- Password reset handled via Firebase Auth

---

## 4. Database (Firestore — Free Tier)

### Collections (Suggested)
- users
- exams
- questions
- answers
- results

### Constraints
- Reads and writes optimized to stay within free limits
- Denormalized data where necessary
- Minimal nested queries

---

## 5. Image Handling Strategy (Free Tier Compatible)

Since Firebase Storage is not available on the free plan:

### Image Upload Rules
- Image upload is **optional**
- Images must be **processed before storage**

### Accepted Strategy
- Convert images to **Base64**
- Compress and resize images on the client side
- Store the Base64 string directly in Firestore

### Image Processing Requirements
- Max width constraint (e.g. 800px)
- Quality compression applied
- Base64 string size monitored to avoid document size limits

---

## 6. Student Area

### 6.1 Dashboard
- Available mock exams
- Exam status:
  - Not started
  - In progress
  - Completed

### 6.2 Student Profile
- Personal data
- Exam history
- Completed exams and performance summary

### 6.3 Exam Execution

#### Timer
- Duration: **5 hours and 30 minutes**
- Fixed once the exam starts
- Visible at bottom-right corner
- Minimizable via icon
- Turns **red** when **30 minutes remain**
- Auto-finalization when timer reaches zero

#### Navigation
- Previous question button
- Next question button
- Finish exam button
  - Confirmation modal required

#### Question Navigation Panel
- Left-side panel
- Displays all questions
- Shows answered and unanswered status
- Allows direct question access

---

## 7. Teacher Area

### 7.1 Dashboard
- Created exams list
- Access to student results

### 7.2 Results Analysis
- Individual student performance
- Answer review
- Subject-based analysis

---

## 8. Mock Exam Creation Workflow

### 8.1 ENEM Structure

#### Day 1
- 45 questions: Languages
- 45 questions: Human Sciences

#### Day 2
- 45 questions: Natural Sciences
- 45 questions: Mathematics

The system suggests 45 questions per subject according to the ENEM model.

---

### 8.2 Question Creation

Each question supports:
- Optional image (Base64 encoded)
- Question text
- Multiple alternatives
- Correct answer selection
- Live preview before saving

---

### 8.3 Exam Summary
Before publishing:
- Total question count
- Subject distribution
- Full preview
- Final confirmation step

---

## 9. System Rules
- Exams cannot be edited after publication
- Timer cannot be paused or reset
- Automatic submission on timeout
- Strict role-based access control

---

## 10. UX Principles
- Clean and distraction-free exam interface
- Clear answered/unanswered indicators
- Responsive layout
- Persistent timer visibility

---

## 11. System Objective
Deliver a realistic ENEM simulation while operating entirely within Firebase free tier constraints, prioritizing performance, usability, and cost-efficiency.
