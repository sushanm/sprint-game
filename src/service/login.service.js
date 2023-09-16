import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    setDoc,
    Firestore,
    onSnapshot
} from "firebase/firestore";
import { db } from "../firebase";

class LoginDataService {
    getUserName = () => {
        return localStorage.getItem('sprintplanningpockernewLoginName');
    }

    getUserId=()=>{
        return localStorage.getItem('sprintplanningpockernewLoginID');
    }

    createNewUser = (newUser) => {
        return addDoc(collection(db, "users"), newUser)
    }
}

export default new LoginDataService();