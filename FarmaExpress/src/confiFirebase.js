// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getAuth, indexedDBLocalPersistence} from "firebase/auth";
import {getFirestore, initializeFirestore,persistentSingleTabManager, persistentLocalCache,  CACHE_SIZE_UNLIMITED } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAhee30TNo532yn-6bDUsqnEPMNDsSvjIo",
  authDomain: "dfarma-express.firebaseapp.com",
  projectId: "dfarma-express",
  storageBucket: "dfarma-express.appspot.com",
  messagingSenderId: "690858663614",
  appId: "1:690858663614:web:c80d5cc3df2b8ea7e008ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeFirestore(app,
  {localCache:
    persistentLocalCache(/*settings*/{tabManager: persistentSingleTabManager()})
    
});



const auth = getAuth(app);
const db = getFirestore(app);


// Habilitar el almacenamiento en caché persistente

  




export{auth,db};