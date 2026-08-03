/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProfileForm from './components/ProfileForm';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './utils/firebaseError';

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setFirebaseUser(authUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              id: authUser.uid,
              name: data.name,
              email: data.email,
              phone: data.phone || '',
              company: data.company || '',
            });
            setNeedsProfile(false);
          } else {
            setNeedsProfile(true);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, 'users');
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
        setNeedsProfile(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleProfileComplete = async (data: Partial<User>) => {
    if (!firebaseUser) return;
    try {
      const userData = {
        name: data.name || firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        phone: data.phone || '',
        company: data.company || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      setUser({
        id: firebaseUser.uid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        company: userData.company,
      });
      setNeedsProfile(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'users');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-cyan-400 font-mono tracking-widest uppercase text-sm">A carregar...</div>;
  }

  if (firebaseUser && needsProfile) {
    return (
      <ProfileForm 
        initialName={firebaseUser.displayName || ''} 
        initialEmail={firebaseUser.email || ''} 
        onComplete={handleProfileComplete} 
      />
    );
  }

  return (
    <>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={() => {}} />
      )}
    </>
  );
}


