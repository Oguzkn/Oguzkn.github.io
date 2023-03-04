
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js';
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

function oda_kur(prm_oda_id,prm_oyuncu_id){
    set(
        ref(db ,'oda_id/'+prm_oda_id),{
            oyuncu_id:prm_oyuncu_id
    });

    document.getElementById("oda_kodu").value=oda_kodu;
    console.log("oda_kur calişti");

}


function oda_katil(prm_oda_kodu){
    
    if(prm_oda_kodu == json_to_array.oda_id){
        console.log("oda_katil çalişti  :  "+prm_oda_kodu);

    }else{
        console.log("oda kodu doğru değil")
    }
    
}
