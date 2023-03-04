import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js';
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const analytics = getAnalytics(app);
const ref = ref();
const set = set();
