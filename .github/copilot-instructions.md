# Copilot / AI Agent Instructions for e-placement-hub

This file provides targeted, actionable guidance for AI coding agents working on the e-placement-hub repository.

Core Architecture & Components:
- **Backend**: Node/Express + MongoDB at `/backend`
  - JWT auth, protected routes, and session management
  - Routes mounted at `/api/{users,students,drives,dashboard}`
  - CommonJS module system (`require`/`module.exports`)
  - ML microservice integration at port 8000 
- **Frontend**: React + Vite + Tailwind at `/frontend`
  - ES modules, functional components
  - Role-based routing (admin vs student views)
  - Dashboard with real-time statistics

Key Integration Points:
- **Authentication**:
  - JWT shape must be `{ user: { id, name, role } }`
  - OTPs expire in 5m, stored hashed in `otp` collection
  - Temp JWT issued after OTP expires in 10m
- **Student-Drive Linking**:
  - Student.placementActivity stores per-company objects
  - Company matching via exact string `placementActivity.company == drive.companyName`
  - Round status updates validate against drive's round keys
- **File Processing**:
  - Student masterlist upload via `multipart/form-data`
  - Required columns: `Superset ID,Name,Moodle ID,CGPA,Branch,Email,Phone,Companies`
- **ML Integration**: 
  - Endpoint: `POST http://localhost:8000/predict`
  - Returns: `{ prediction_score, predicted_class }`
  - Failures mapped to 503 with descriptive message

Critical Workflows:
1. Development Setup:
```bash
# Backend
cd backend && npm install
cp .env.example .env # Set MONGO_URI,JWT_SECRET,EMAIL_*,PORT
npm run dev  # Nodemon on index.js
python ml-service/ml_predictor.py  # ML service on 8000

# Frontend
cd frontend && npm install
npm run dev  # Vite on 5173
```

2. Adding Features:
- Auth flows: See `userRoutes.js` forgot-password pattern
- File uploads: Follow `studentRoutes.js` multer setup
- Aggregations: Use `driveRoutes.js` Promise.all pattern
- Round updates: Validate round names before updates

Maintainer Instructions:
1. **PR Required For**:
   - API shape changes 
   - New dependencies
   - Auth flow modifications
   - Schema updates affecting student-drive links
2. **Direct Commits OK For**:
   - UI text/copy changes
   - Error message improvements
   - Non-breaking bug fixes

Code Style & Conventions:
- Backend: async/await with try/catch blocks
- Error responses: Specific 4xx or generic 500
- Updates: Use `findOneAndUpdate` with `upsert: true`
- Keep CommonJS in backend unless migrating whole codebase

Example Patterns:
```js
// Counting across collections
const drivesWithCount = await Promise.all(drives.map(async drive => {
  const count = await Student.countDocuments({
    'placementActivity.company': drive.companyName
  });
  return { ...drive.toObject(), applicantCount: count };
}));

// OTP flow with expiry
const otp = await Otp.create({
  email,
  otp: hashedOtp,
  expires: 300 // 5min TTL
});
// Later: bcrypt.compare() -> JWT with 10min expiry
```

Questions? Ask repo owner about:
- Missing .env.example values
- ML service containerization plans
- New third-party integrations

End of instructions.
