

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

const stockCollectionRef = collection(db, "sprints");

class SprintDataService {

    createNewSprint = (newSprint) => {
        return setDoc(doc(db, "sprints", newSprint.id), newSprint);
    }

    updateSprint = (id, updatedSprint) => {
        const productDoc = doc(db, "sprints", id);
        return updateDoc(productDoc, updatedSprint);
    };

    deleteProduct = (id) => {
        const bookDoc = doc(db, "sprints", id);
        return deleteDoc(bookDoc);
    };

    getAllProducts = () => {
        return getDocs(stockCollectionRef);
    };

    getAllProductNames = () => {

      return  stockCollectionRef.select('name','usage').get();
      //  return getDocs(stockCollectionRef).select("name", "usage");
        // const firestore = new Firestore();

        // const snap = firestore
        //     .collection("stock")
        //     .select("name", "usage")
        //     .get();
        //     return snap
    }


}

export default new SprintDataService();