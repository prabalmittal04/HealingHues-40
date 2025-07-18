# Firebase Indexes Deployment Guide

## Why You Need Cloud Firestore Indexes

Your wellness center uses complex queries that require indexes to work properly. Without these indexes, you'll get **"Missing or insufficient permissions"** errors.

## Required Indexes for Wellness Center

### **Core Wellness Collections:**
1. **`wellnessSessions`** - User session data with `userId` + `completedAt`
2. **`videoCompletions`** - Video completion tracking with `userId` + `completedAt`
3. **`activityCompletions`** - Activity completion data with `userId` + `completedAt`

### **Supporting Collections:**
4. **`meditationSessions`** - Meditation data with `rating` ordering
5. **`musicAlbums`** - Music albums with `title` ordering
6. **`tracks`** - Music tracks with `title` ordering
7. **`therapists`** - Therapist data with `rating` ordering
8. **`supportGroups`** - Support groups with `participants` ordering
9. **`foodEntries`** - Nutrition data with `timestamp` ordering
10. **`medicines`** - Medicine recommendations with `popularity` ordering

## How to Deploy Indexes

### **Option 1: Firebase CLI (Recommended)**

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

4. **Deploy the indexes**:
   ```bash
   firebase deploy --only firestore:indexes
   ```

### **Option 2: Firebase Console**

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `healinghues-f6133`
3. **Navigate to Firestore Database**
4. **Click on "Indexes" tab**
5. **Click "Add Index"** for each collection
6. **Or import the indexes** using the Firebase CLI

## Index Details

### **Wellness Sessions Index**
```javascript
Collection: wellnessSessions
Fields: 
- userId (Ascending)
- completedAt (Descending)
```

### **Video Completions Index**
```javascript
Collection: videoCompletions
Fields:
- userId (Ascending)
- completedAt (Descending)
```

### **Activity Completions Index**
```javascript
Collection: activityCompletions
Fields:
- userId (Ascending)
- completedAt (Descending)
```

## Query Patterns That Require Indexes

### **User-Specific Queries with Ordering:**
```javascript
// These queries need indexes:
query(
  collection(db, "wellnessSessions"),
  where("userId", "==", userId),
  orderBy("completedAt", "desc"),
  limit(50)
)
```

### **Public Data with Ordering:**
```javascript
// These queries need indexes:
query(
  collection(db, "therapists"),
  orderBy("rating", "desc"),
  limit(20)
)
```

## Monitoring Index Creation

### **Check Index Status:**
1. **Firebase Console** → Firestore Database → Indexes
2. **Look for status indicators:**
   - ✅ **Built** - Index is ready
   - 🔄 **Building** - Index is being created
   - ❌ **Error** - Index creation failed

### **Index Creation Time:**
- **Small collections**: 1-5 minutes
- **Large collections**: 10-30 minutes
- **Complex indexes**: Up to 1 hour

## Troubleshooting

### **Common Issues:**

1. **"Missing or insufficient permissions"**:
   - Deploy security rules first
   - Then deploy indexes
   - Wait for indexes to finish building

2. **"The query requires an index"**:
   - Check if the required index exists
   - Create the missing index
   - Wait for index to build

3. **"Index building failed"**:
   - Check for data inconsistencies
   - Verify field types match
   - Recreate the index

### **Error Messages to Watch For:**
```
Error: The query requires an index for the collection
Error: Missing or insufficient permissions
Error: Index not found
```

## Testing After Deployment

1. **Start your app**: `npm run dev`
2. **Navigate to wellness center**: `/wellness`
3. **Test each feature**:
   - Complete a wellness session
   - Watch a wellness video
   - Complete an activity
   - Check meditation studio
   - Test soothing music
   - Try therapy hub
4. **Check browser console** for any index-related errors

## Performance Benefits

### **With Indexes:**
- ✅ Fast query execution
- ✅ Real-time updates work properly
- ✅ No permission errors
- ✅ Smooth user experience

### **Without Indexes:**
- ❌ Slow query execution
- ❌ Permission errors
- ❌ Broken real-time listeners
- ❌ Poor user experience

## Next Steps

1. **Deploy the indexes** using Firebase CLI
2. **Monitor index building** in Firebase Console
3. **Test all wellness center features**
4. **Verify real-time updates** are working
5. **Check for any remaining errors**

Your wellness center will now have optimal performance with properly indexed queries! 🚀 