import {db} from './database_import.js'

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
export {oda_kur};
