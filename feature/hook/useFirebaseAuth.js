import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth, db } from "../../app/firebase";
import { login, logout } from "../authUser/authUserSlice";

export default function useFirebaseAuth() {
    const dispatch = useDispatch();

    const authStateChanged = async (authState) => {
        if (!authState) {
            dispatch(logout());
            return;
        }

        const docRef = doc(db, "users", authState.uid);
        const docSnap = await getDoc(docRef);
        let userData;
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            userData = docSnap.data();
        } else {
            console.log("No such document!");
        }

        dispatch(
            login({
                uid: authState.uid,
                name: authState.displayName,
                email: authState.email,
                data: userData,
            })
        );
    };

    // listen for Firebase state change
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChanged);
        return () => unsubscribe();
    }, []);
}
