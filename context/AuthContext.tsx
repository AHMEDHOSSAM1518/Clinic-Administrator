
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserRole, StaffUser } from '../types';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  onSnapshot,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

interface AuthContextType {
  user: StaffUser | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  users: StaffUser[];
  addUser: (user: Partial<StaffUser>) => void;
  updateUser: (id: string, updates: Partial<StaffUser>) => void;
  deleteUser: (id: string) => void;
  canManageUser: (targetUser: StaffUser) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'mousa_clinical_registry_v4';
const SESSION_STORAGE_KEY = 'mousa_clinical_session_v4';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize Firebase Auth and Users Registry
  useEffect(() => {
    // Listen for Auth changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as StaffUser;
          setUser(userData);
          setRole(userData.role);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    // Listen for Users Registry changes
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersList = snapshot.docs.map(doc => doc.data() as StaffUser);
      setUsers(usersList);
      
      // Seed initial users if collection is empty (for demo purposes)
      if (usersList.length === 0) {
        seedInitialUsers();
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUsers();
    };
  }, []);

  const seedInitialUsers = async () => {
    const initialUsers: StaffUser[] = [
      {
        id: 'root-owner',
        name: 'Clinic Owner',
        email: 'owner@mousaclinic.com',
        password: 'owner123',
        role: UserRole.OWNER,
        position: 'Chief Executive',
        lastLogin: new Date().toLocaleString(),
        isActive: true
      },
      {
        id: 'admin-1',
        name: 'Clinic Administrator',
        email: 'admin1@mousaclinic.com',
        password: 'admin123',
        role: UserRole.ADMIN,
        position: 'Medical Manager',
        lastLogin: 'Never',
        isActive: true
      },
      {
        id: 'user-1',
        name: 'Staff User',
        email: 'user1@mousaclinic.com',
        password: 'user123',
        role: UserRole.USER,
        position: 'Medical Staff',
        lastLogin: 'Never',
        isActive: true
      }
    ];
    
    for (const u of initialUsers) {
      await setDoc(doc(db, 'users', u.id), u);
    }
  };

  const login = async (emailRaw: string, passRaw: string) => {
    const email = emailRaw.trim().toLowerCase();
    const pass = passRaw.trim();

    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    if (!apiKey || apiKey === "undefined" || apiKey === "") {
      throw new Error("إعدادات Firebase ناقصة. يرجى إضافة الـ API Key في متغيرات البيئة (Environment Variables).");
    }

    // Create a timeout promise
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("انتهت مهلة الاتصال. يرجى التأكد من جودة الإنترنت وإعدادات Firebase.")), 20000)
    );

    try {
      const loginPromise = (async () => {
        try {
          // 1. Try standard Firebase Auth login
          const userCredential = await signInWithEmailAndPassword(auth, email, pass);
          const firebaseUser = userCredential.user;
          
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as StaffUser;
            if (!userData.isActive) {
              await signOut(auth);
              throw new Error("هذا الحساب معطل إدارياً.");
            }
            
            await updateDoc(doc(db, 'users', firebaseUser.uid), {
              lastLogin: new Date().toLocaleString()
            });
            
            setUser(userData);
            setRole(userData.role);
          } else {
            // Fallback: Check if a profile exists by email but with a different ID (e.g. temporary ID from seeding)
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const oldDoc = querySnapshot.docs[0];
              const userData = oldDoc.data() as StaffUser;
              
              // Link this profile to the new Firebase UID
              const updatedData = { ...userData, id: firebaseUser.uid, lastLogin: new Date().toLocaleString() };
              await setDoc(doc(db, 'users', firebaseUser.uid), updatedData);
              
              // Remove the old document if it had a different ID
              if (oldDoc.id !== firebaseUser.uid) {
                await deleteDoc(doc(db, 'users', oldDoc.id));
              }

              setUser(updatedData);
              setRole(updatedData.role);
            } else {
              // Auto-create a profile if Auth succeeded but no Firestore record exists
              const isFirstUser = users.length === 0;
              const newProfile: StaffUser = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || email.split('@')[0],
                email: email,
                password: '---', // Passwords are managed by Firebase Auth
                role: isFirstUser ? UserRole.OWNER : UserRole.USER,
                position: isFirstUser ? 'Clinic Owner' : 'Medical Staff',
                lastLogin: new Date().toLocaleString(),
                isActive: true
              };
              
              await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
              setUser(newProfile);
              setRole(newProfile.role);
            }
          }
        } catch (authError: any) {
          // If it's a credential error, try the fallback/provisioning
          if (authError.code === 'auth/invalid-credential' || authError.code === 'auth/user-not-found' || authError.code === 'auth/wrong-password') {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const userDoc = querySnapshot.docs[0];
              const userData = userDoc.data() as StaffUser;

              if (userData.password === pass) {
                try {
                  // Provision the user in Firebase Auth
                  const newUserCredential = await createUserWithEmailAndPassword(auth, email, pass);
                  const newFirebaseUser = newUserCredential.user;

                  const updatedData = { ...userData, id: newFirebaseUser.uid, lastLogin: new Date().toLocaleString() };
                  await setDoc(doc(db, 'users', newFirebaseUser.uid), updatedData);
                  
                  if (userDoc.id !== newFirebaseUser.uid) {
                    await deleteDoc(doc(db, 'users', userDoc.id));
                  }

                  setUser(updatedData);
                  setRole(updatedData.role);
                  return;
                } catch (provisionError: any) {
                  if (provisionError.code === 'auth/email-already-in-use') {
                    throw new Error("البريد الإلكتروني مسجل بالفعل ولكن كلمة المرور غير صحيحة. يرجى التأكد من كلمة المرور.");
                  }
                  throw provisionError;
                }
              } else {
                throw new Error("كلمة المرور غير صحيحة لهذا الحساب.");
              }
            } else {
              throw new Error("هذا البريد الإلكتروني غير مسجل في النظام.");
            }
          }
          throw authError;
        }
      })();

      // Race between login and timeout
      await Promise.race([loginPromise, timeout]);

    } catch (error: any) {
      console.error("Login Error Details:", error.code, error.message);

      // Specific error messages in Arabic
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error("خطأ في الشبكة. يرجى التحقق من اتصال الإنترنت.");
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error("محاولات كثيرة خاطئة. تم حظر الحساب مؤقتاً، حاول لاحقاً.");
      } else if (error.code === 'auth/invalid-email') {
        throw new Error("صيغة البريد الإلكتروني غير صحيحة.");
      }
      
      throw new Error(error.message || "فشل تسجيل الدخول. تأكد من البيانات والاتصال.");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
  };

  const addUser = async (userData: Partial<StaffUser>) => {
    if (user?.role !== UserRole.OWNER) return;
    const id = 'staff-' + Date.now();
    const newUser: StaffUser = {
      id,
      name: userData.name || 'Unnamed Staff',
      email: userData.email!,
      password: userData.password!, // Note: In production, don't store passwords in Firestore
      role: userData.role || UserRole.USER,
      position: userData.position || 'Clinical Staff',
      lastLogin: 'Never',
      isActive: true,
    };
    await setDoc(doc(db, 'users', id), newUser);
  };

  const updateUser = async (id: string, updates: Partial<StaffUser>) => {
    if (user?.role !== UserRole.OWNER && user?.id !== id) return;
    await updateDoc(doc(db, 'users', id), updates);
  };

  const deleteUser = async (id: string) => {
    if (user?.role !== UserRole.OWNER) return;
    if (user?.id === id) return;
    await deleteDoc(doc(db, 'users', id));
  };

  // Strictly enforce that ONLY Owners can manage the registry
  const canManageUser = (targetUser: StaffUser) => {
    if (!user) return false;
    return user.role === UserRole.OWNER;
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, users, addUser, updateUser, deleteUser, canManageUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
