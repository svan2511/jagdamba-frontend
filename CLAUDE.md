# Hospital App - Frontend

## Project Overview
- **Name**: MAA JAGDAMBA SUPER SPECIALITY HOSPITAL - Frontend
- **Type**: React + TypeScript + Vite SPA
- **Framework**: React 18 with TypeScript, Redux Toolkit, React Router v6
- **UI**: Custom design system with Material Design 3 inspired components
- **API**: Laravel REST API (hospital-api)

## Key Features
- Public pages: Homepage, About, Doctors, Doctor Details, Contact, Emergency, Gallery
- Authentication: Login, Register, Forgot Password, OTP verification
- Role-based dashboards:
  - Patient Dashboard: Book appointments, view medical records, prescriptions, profile
  - Doctor Dashboard: Appointments, patients, prescriptions, schedule, availability
  - Admin Dashboard: Manage doctors, patients, appointments, reviews, gallery, CMS

## Architecture

### Tech Stack
- React 18 + TypeScript
- Vite (build tool)
- Redux Toolkit (state management)
- React Router v6 (routing)
- Axios (HTTP client)
- Framer Motion (animations)
- Lucide React (icons)
- react-hot-toast (notifications)
- Tailwind CSS (styling - custom configuration)

### Project Structure
```
src/
├── api/           # API client, types, and endpoints
│   ├── client.ts         # Axios instance with interceptors
│   ├── types.ts          # TypeScript interfaces
│   ├── auth.ts           # Login, register, etc.
│   ├── doctors.ts        # Doctor endpoints
│   ├── appointments.ts   # Appointment endpoints
│   ├── patient.ts        # Patient profile/records
│   ├── admin.ts          # Admin operations
│   └── index.ts          # Re-exports
├── components/    # Reusable UI components
├── layouts/       # Layout components (PublicLayout, AdminLayout, etc.)
├── pages/         # Page components by role
│   ├── auth/           # Login, Register, etc.
│   ├── patient/        # Patient dashboard pages
│   ├── doctor/         # Doctor dashboard pages
│   └── admin/          # Admin dashboard pages
├── store/        # Redux store and slices
│   └── slices/
│       └── authSlice.ts  # Auth state management
└── hooks/        # Custom React hooks
```

### API Integration
- Base URL: `http://localhost:8000/api`
- Authentication: Laravel Sanctum (Bearer token)
- Token stored in localStorage
- Automatic token refresh via axios interceptors
- Error handling: Shows toast notifications on errors

## Key Conventions

### Component Style
- Glass-card design with glassmorphism effects
- Custom font system: Poppins (display), Playfair Display (headlines), Inter (body)
- MD3-inspired tokens: `--primary`, `--on-primary`, `--surface`, etc.
- Responsive: mobile-first with md/lg breakpoints

### State Management
- Redux Toolkit for global state (auth, user data)
- Local state with useState for UI state
- useCallback/useEffect for data fetching

### API Calls
- All API calls go through `src/api/` folder
- Use the provided API functions (doctorsApi, appointmentsApi, etc.)
- Handle loading/error states in components

## Important Files

### Routing (App.tsx)
- Public routes: `/`, `/about`, `/doctors`, `/contact`, etc.
- Auth routes: `/login`, `/register`, `/forgot-password`, `/verify-otp`
- Patient: `/patient/*` - PatientDashboardLayout wraps these
- Doctor: `/doctor/*` - DoctorDashboardLayout wraps these
- Admin: `/admin/*` - AdminLayout wraps these

### API Client (api/client.ts)
- Sets Authorization header with Bearer token
- Handles 401 responses (redirect to login)
- Logs errors to console

### Auth (store/slices/authSlice.ts)
- Stores user info and token
- login/logout actions
- Persists to localStorage

## Common Issues Fixed
- TypeScript errors with `ApiResponse` import - created separate types.ts
- Undefined errors in dashboards - added defensive checks (`?.`, `|| []`)
- alerts() replaced with react-hot-toast
- AddDoctor now actually saves to database via API

## Commands
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Environment
- Node.js 18+
- Vite 8+
- API runs on Laravel at localhost:8000