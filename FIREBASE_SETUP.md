# Firebase Setup

## Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication > Email/Password

### 2. Get Configuration

1. Go to Project settings
2. Add a web app
3. Copy the config object

### 3. Update Configuration

Replace the values in `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
}
```

## Testing

1. Run `npm run dev`
2. Navigate to `/signup` to create an account
3. Check your email for verification
4. Test sign in/out functionality

## Notes

- Email verification is sent automatically on signup
- Password reset functionality is available
- Authentication state persists across browser sessions