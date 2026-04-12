import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase/config';
import * as defaults from './siteData';

const CmsContext = createContext(null);

export const SECTION_KEYS = [
  'siteConfig', 'heroData', 'problemSolutionData', 'freeDemoData',
  'projectsData', 'processData', 'pricingData', 'trustData',
  'aboutData', 'teamData', 'reviewsData', 'contactData', 'navLinks',
];

function getDefaultData() {
  const data = {};
  SECTION_KEYS.forEach((key) => { data[key] = defaults[key]; });
  return data;
}

export function CmsProvider({ children }) {
  const [data, setData] = useState(getDefaultData());
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Auth listener
  useEffect(() => {
    if (sessionStorage.getItem('nn_master_admin') === '1') {
      setIsAdmin(true);
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setIsAdmin(true);
    });
    return unsub;
  }, []);

  // Real-time Firestore listener for CMS content
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'cms', 'content'), (docSnap) => {
      if (docSnap.exists()) {
        const firestoreData = docSnap.data();
        setData((prev) => {
          const newData = { ...prev };
          SECTION_KEYS.forEach((key) => {
            if (firestoreData[key] !== undefined) {
              newData[key] = firestoreData[key];
            }
          });
          return newData;
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase CMS Error:", error);
      setLoading(false);
    });

    return unsub;
  }, []);

  // Update a section to Firestore
  const updateSection = useCallback(async (sectionKey, newData) => {
    try {
      const value = typeof newData === 'function' ? newData(data[sectionKey]) : newData;
      // Optimistic update
      setData((prev) => ({ ...prev, [sectionKey]: value }));
      // Save directly to Firestore under 'cms/content' document
      await setDoc(doc(db, 'cms', 'content'), { [sectionKey]: value }, { merge: true });
      return true;
    } catch (e) {
      console.error('CMS Update failed:', e);
      return false;
    }
  }, [data]);

  const seedDatabase = useCallback(async () => {
    try {
      await setDoc(doc(db, 'cms', 'content'), getDefaultData());
      alert('Database seeded successfully from default siteData.js!');
    } catch (e) {
      alert('Seed failed: ' + e.message);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    if ((email === 'alphatriondk09@gmail.com' && password === 'admin2006') || (email === 'himeshk2018@gmail.com' && password === 'admin2018')) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (e) {
        // Automatically try creating the account or simply bypass if Firebase isn't set up yet
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
          console.warn("Firebase Auth unavailable, falling back to local session.");
        }
      }
      setIsAdmin(true);
      sessionStorage.setItem('nn_master_admin', '1');
      return true;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (e) {
      console.error('Login error', e);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    sessionStorage.removeItem('nn_master_admin');
    setIsAdmin(false);
    await signOut(auth);
  }, []);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'netnirman-content-firebase.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback(async (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') return false;
      await setDoc(doc(db, 'cms', 'content'), parsed, { merge: true });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, []);

  return (
    <CmsContext.Provider value={{
      ...data, loading, isAdmin, updateSection, exportData, importData, 
      login, logout, SECTION_KEYS, seedDatabase
    }}>
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error('useCms must be used within CmsProvider');
  return ctx;
}
