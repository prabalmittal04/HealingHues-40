import { db } from "./firebase"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"

export async function getUserMoodEntries(userId: string) {
  // Query moodEntries collection for the specific user ordered by timestamp ascending
  const moodQuery = query(
    collection(db, "moodEntries"),
    where("userId", "==", userId),
    orderBy("timestamp", "asc")
  )

  const snapshot = await getDocs(moodQuery)

  // Map each document to a mood entry object
  const entries = snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      moodValue: data.moodValue,       // numeric rating e.g. 1-5
      moodLabel: data.moodLabel,       // mood name e.g. "Happy"
      timestamp: data.timestamp.toDate(),  // convert Firestore Timestamp to JS Date
    }
  })

  return entries
}
