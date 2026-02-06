import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  setDoc,
  updateDoc,
  deleteDoc,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";

export async function getDocument<T>(
  collectionName: string,
  id: string
): Promise<T | null> {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as T;
}

export async function getCollection<T>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> {
  const q = query(collection(db, collectionName), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

export async function setDocument(
  collectionName: string,
  id: string,
  data: Record<string, unknown>
) {
  await setDoc(doc(db, collectionName, id), data);
}

export async function updateDocument(
  collectionName: string,
  id: string,
  data: Record<string, unknown>
) {
  await updateDoc(doc(db, collectionName, id), data);
}

export async function deleteDocument(collectionName: string, id: string) {
  await deleteDoc(doc(db, collectionName, id));
}

export { where, orderBy };
