import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js';
        
const firebaseConfig = {
    apiKey: "AIzaSyCMa4_Q2TtXHZKjcgbiEFDWHQio_9-f4j0",
    authDomain: "oguzk-1467d.firebaseapp.com",
    databaseURL: "https://oguzk-1467d-default-rtdb.firebaseio.com",
    projectId: "oguzk-1467d",
    storageBucket: "oguzk-1467d.appspot.com",
    messagingSenderId: "430568764328",
    appId: "1:430568764328:web:51427c8682821ca7b6a39d",
    measurementId: "G-B70BV83C80"
    };

        
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
        
const app = initializeApp(firebaseConfig);  
export const db = getDatabase(app);
