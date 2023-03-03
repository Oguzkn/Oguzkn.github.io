
function oda_kur(){
    var oda_kodu = 1808
    var oda_array = {oda_id:oda_kodu,name:"mehmet"};

    var array_to_json =JSON.stringify(oda_array);


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
