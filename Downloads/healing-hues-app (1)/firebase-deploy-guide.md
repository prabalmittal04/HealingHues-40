# Firebase Security Rules Deployment Guide

## Step 1: Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

## Step 2: Login to Firebase
```bash
firebase login
```

## Step 3: Initialize Firebase (if not already done)
```bash
firebase init firestore
```

## Step 4: Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

## Alternative: Deploy All Firebase Services
```bash
firebase deploy
```

## Verify Deployment
After deployment, you should see a success message. The new `liveSessions` collection will now be accessible.

## Testing the Rules
1. Try creating a live session using the "Test Live Session" button
2. Check the browser console for any permission errors
3. Verify that the session appears in the Live Sessions tab

## Troubleshooting
If you still get permission errors:
1. Make sure you're logged in to Firebase CLI
2. Verify the project ID is correct
3. Check that the rules were deployed successfully
4. Try refreshing the page and testing again 