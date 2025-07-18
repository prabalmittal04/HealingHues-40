# Firebase Security Rules Deployment Guide

## Why You Need to Update Firebase Security Rules

Your wellness center now uses new Firebase collections that require proper security rules:

- `wellnessSessions` - User wellness session data
- `videoCompletions` - Video completion tracking
- `activityCompletions` - Activity completion data
- `users` - Enhanced user profiles with wellness data

## Current Security Issue

Without proper security rules, your Firebase database is vulnerable to:
- Unauthorized data access
- Data manipulation by malicious users
- Potential data breaches

## How to Deploy the Security Rules

### Option 1: Using Firebase CLI (Recommended)

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project**:
   ```bash
   firebase init firestore
   ```
   - Select your project: `healinghues-f6133`
   - Use existing rules: `firestore.rules`
   - Use existing indexes: `firestore.indexes.json`

4. **Deploy the security rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

5. **Deploy the indexes**:
   ```bash
   firebase deploy --only firestore:indexes
   ```

### Option 2: Using Firebase Console

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `healinghues-f6133`
3. **Navigate to Firestore Database**
4. **Click on "Rules" tab**
5. **Copy and paste the content from `firestore.rules`**
6. **Click "Publish"**

## Security Rules Overview

The new security rules ensure:

### ✅ **User Data Protection**
- Users can only access their own data
- Authentication required for all operations
- User ID validation on all collections

### ✅ **Wellness Center Collections**
```javascript
// Wellness sessions - users can only access their own sessions
match /wellnessSessions/{sessionId} {
  allow read, write: if request.auth != null && 
    request.auth.uid == resource.data.userId;
  allow create: if request.auth != null && 
    request.auth.uid == request.resource.data.userId;
}
```

### ✅ **Public vs Private Data**
- **Private**: User profiles, sessions, completions (user-specific)
- **Public**: Community messages, medicine recommendations (readable by all)

### ✅ **Data Validation**
- Ensures `userId` matches authenticated user
- Validates required fields on creation
- Prevents unauthorized data access

## Testing the Security Rules

After deployment, test your wellness center:

1. **Start your app**: `npm run dev`
2. **Navigate to wellness center**: `/wellness`
3. **Click "Test Firebase" button**
4. **Check browser console** for success/error messages
5. **Verify in Firebase Console** that data is being saved

## Troubleshooting

### Common Issues:

1. **"Permission denied" errors**:
   - Ensure user is authenticated
   - Check that `userId` matches authenticated user
   - Verify security rules are deployed

2. **"Missing or insufficient permissions"**:
   - Deploy security rules again
   - Check Firebase Console for rule syntax errors
   - Ensure indexes are created for queries

3. **Real-time listeners not working**:
   - Verify user authentication
   - Check browser console for errors
   - Ensure proper cleanup of listeners

## Security Best Practices

1. **Always validate user authentication**
2. **Use user-specific data isolation**
3. **Implement proper error handling**
4. **Regular security audits**
5. **Monitor Firebase usage**

## Next Steps

1. **Deploy the security rules** using one of the methods above
2. **Test the wellness center** functionality
3. **Monitor Firebase Console** for any permission errors
4. **Set up Firebase monitoring** for production use

Your wellness center data will now be properly secured and accessible only to authenticated users! 