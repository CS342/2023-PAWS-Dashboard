import React, { useContext, useState, useEffect, useMemo } from 'react';
import {
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signOut,
   sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = React.createContext();

export function useAuth() {
   return useContext(AuthContext);
}

export function AuthProvider({ children }) {
   const [currentUser, setCurrentUser] = useState();
   const [isAdmin, setIsAdmin] = useState(false);
   const [loading, setLoading] = useState(true);

   const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);

   const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

   const logout = () => signOut(auth);

   const resetPassword = (email) => sendPasswordResetEmail(auth, email);

   const updateEmail = (email) => currentUser.updateEmail(email);

   const updatePassword = (password) => currentUser.updatePassword(password);

   useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
         setCurrentUser(user);

         if (auth.currentUser) {
            auth.currentUser.getIdTokenResult()
               .then((result) => {
                  if (result.claims.role === "admin") {
                     setIsAdmin(true);
                  } else {
                     setIsAdmin(false);
                  }
               });
         }


         setLoading(false);
      });

      return unsubscribe;
   }, []);

   const value = useMemo(() => ({
      currentUser,
      isAdmin,
      login,
      signup,
      logout,
      resetPassword,
      updateEmail,
      updatePassword,
   }), [currentUser]);

   return (
      <AuthContext.Provider value={value}>
         {!loading && children}
      </AuthContext.Provider>
   );
}
