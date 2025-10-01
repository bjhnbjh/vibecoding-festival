# Authentication Implementation

## Overview
FestivalHub uses Supabase Auth for user authentication with email/password.

## Configuration

### Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Validation Rules

### Email
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Standard email format required

### Password
- Minimum length: 6 characters
- Enforced on both frontend and backend

## Architecture

### AuthContext (`src/contexts/AuthContext.tsx`)
- Manages global auth state via React Context
- Handles Supabase session lifecycle
- Provides `login`, `signup`, `logout` functions
- Syncs user data to localStorage for persistence

### API Routes
- `src/app/api/auth/signup/route.ts` - Validates and creates users
- `src/app/api/auth/login/route.ts` - Handles login requests

### Pages
- `src/app/signup/page.tsx` - Registration form
- `src/app/login/page.tsx` - Login form

## User Metadata
Stored in Supabase user_metadata:
- `name`: User's display name
- `university`: Optional school affiliation

## Session Management
- Auto-refresh enabled via Supabase client
- Sessions persist in browser localStorage
- Auth state changes trigger context updates

## Troubleshooting

### "Invalid email format" error
- Ensure email matches validation regex
- Check for whitespace in input

### Supabase connection issues
- Verify environment variables are set
- Check browser console for configuration errors
- Ensure Supabase project is active
