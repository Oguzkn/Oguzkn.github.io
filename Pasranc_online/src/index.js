//---------------------------firebase bağlantı kısmı------------------>
import { initializeApp } from 'firebase/app';
import { getDatabase, ref,set,get,child, update ,onChildChanged,onChildAdded, onValue} from "firebase/database";        
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
const app = initializeApp(firebaseConfig); const db = getDatabase(app);
//--------------------------her kısımndan erişileccek fonksiyon ve tanımlar-------------------->

//--------------------------oyun giriş ekranı  kısmı fonksiyonları ve tanımlamaları ---------------->

window.oda_kur= function (prm_oda_id, prm_p1_id) {
   
    const reference=ref(db, 'Odalar/' + prm_oda_id); 
    set(reference, {
      oda_kodu:prm_oda_id,
      p1_name: prm_p1_id
    });

    var oda_id=document.getElementById('oda_id_bilgi').innerHTML=prm_oda_id;
   
    document.getElementById("oyun_giriş_ekranı").style.display='none';
    document.getElementById('oyun_tahtası').style.display='flex';
    console.log('OLUŞTURULAN VE KATILINILAN ODA NUMARASI: '+prm_oda_id);

  
}

window.oda_katıl=function(prm_oda_id,prm_p2_id){ 
    get(child(ref(getDatabase()), `Odalar/${prm_oda_id}`)).then((snapshot) => {
      if (snapshot.exists()) { 
        var prm_p1_id=snapshot.val();
        var prm_p1_id = prm_p1_id.p1_name;
        const p_verisi={
          oda_kodu:prm_oda_id, 
          p1_name:prm_p1_id,
          p2_name:prm_p2_id,
          konum_1:'',
          konum_2:'',
          cins_1:'',
          cins_2:''          
        };
        const updates = {};
        updates['Odalar/' + prm_oda_id] = p_verisi;
        return update(ref(getDatabase()), updates);
      } else {
        console.log("VERİ YOK VERİ");
      }}).catch((error) => { console.error(error);});
      
      
    document.getElementById("oyun_giriş_ekranı").style.display='none'; document.getElementById('oyun_tahtası').style.display='flex';

    var oda_id=document.getElementById('oda_id_bilgi').innerHTML=prm_oda_id;
    console.log('KATILINILAN ODA NUMARASI: '+prm_oda_id);

    
     
}

//------------------------- oyun ekranı kısmı foksiyonları ve tanımlamaları---------------------------->
var konum_1=[];
var konum_2=[];
var cins_1=[];
var cins_2=[];

window.hamle=function(prm_konum,prm_cins){ // hamle yapmanı sağlıyor <--- EN önemli kısım --->
  
  if (konum_1.length==0){// ilk buton seçilmişte bu block çalışır
    konum_1.push(prm_konum);cins_1.push(prm_cins); // ilk konum ve cins verileri depolanır
    console.log('tuş bir algılandı');
    
  }else{// ikinci buton seçilmişse bu block çalışır
    konum_2.push(prm_konum);cins_2.push(prm_cins);//ikinci konum ve taş cinsi verileri depolanır

    //document.getElementById(konum_1[0]).title=cins_2[0];// bu kısım taşların title yerini değiştiriyor 
    //document.getElementById(konum_2[0]).title=cins_1[0];

    //var ilk_cins=document.getElementById(konum_1[0]).style.backgroundImage;
    //var ikinci_cins=document.getElementById(konum_2[0]).style.backgroundImage;
    //document.getElementById(konum_1[0]).style.backgroundImage=ikinci_cins;
    //document.getElementById(konum_2[0]).style.backgroundImage=ilk_cins;

    anlık_hamle_yazma(konum_1[0],konum_2[0],cins_1[0],cins_2[0]);// hamleyi database e yolluyor
    
  
    konum_1=[];cins_1=[];konum_2=[];cins_2=[];// verileri temizliyor bir sonraki hamleye hazırlık
    console.log("tuş iki algılandı");        
    }
}

window.anlık_hamle_yazma=function(prm_konum_1,prm_konum_2,prm_cins_1,prm_cins_2){ // oyuncu hamlesini tamamladığında hamle bilgilerini database yolluyor 
  var oda_id=document.getElementById('oda_id_bilgi').innerHTML;
  console.log(oda_id);
  get(child(ref(getDatabase()), `Odalar/${oda_id}`)).then((snapshot) => {
    if (snapshot.exists()) { 
      var datalar=snapshot.val();
      
      var prm_p1_id = datalar.p1_name;
      var prm_p2_id = datalar.p2_name;
      var prm_oda_id = datalar.oda_kodu;

      const p_verisi={
        oda_kodu:prm_oda_id, 
        p1_name:prm_p1_id,
        p2_name:prm_p2_id,
        konum_1:prm_konum_1,
        konum_2:prm_konum_2,
        cins_1:prm_cins_1,
        cins_2:prm_cins_2
      };
      const updates = {};
      updates['Odalar/' + oda_id] = p_verisi;
      return update(ref(getDatabase()), updates);
    } else {
      console.log("VERİ YOK VERİ");
    }}).catch((error) => { console.error(error);});
}


window.tetik=function(){
  console.log('tetik bir çalıştı yani');
  if(oda_id==='ODAİDBİLGİ'){
    oda_id=document.getElementById('oda_id_bilgi').innerHTML;
    path='Odalar/'+oda_id+'/';
    console.log('güncel path:  '+path);

    const commentsRef = ref(getDatabase(), path);
    
    onValue(commentsRef, (data) => {
      if(data){
        console.log(' tetik value hamle algılandı');
        console.log(path);
        console.log(data.val());
        var dbden_çekilen_veriler=data.val();

        console.log('güncel path:  '+path);
        anlık_hamle_görselleştirme(dbden_çekilen_veriler);
        
      }
    });
  }
}
window.anlık_hamle_görselleştirme=function(çekilen_veri){
  if(çekilen_veri.cins_1!=''){
    var konum_1=çekilen_veri.konum_1;
    var konum_2=çekilen_veri.konum_2;
    var cins_2=çekilen_veri.cins_2;
    var cins_1=çekilen_veri.cins_1;
    console.log(konum_1+konum_2);
    var ilk_cins=document.getElementById(konum_1).style.backgroundImage;
    var ikinci_cins=document.getElementById(konum_2).style.backgroundImage;
    document.getElementById(konum_1).style.backgroundImage=ikinci_cins;
    document.getElementById(konum_2).style.backgroundImage=ilk_cins;
    document.getElementById(konum_1).title=cins_2; 
    document.getElementById(konum_2).title=cins_1;

  }

}
var oda_id=document.getElementById('oda_id_bilgi').innerHTML;
var path='/';
console.log('varsayılan path:  '+path);
const commentsRef = ref(getDatabase(), path);

onChildChanged(commentsRef, (data) => {
  if(data){
    console.log(' changed hamle algılandı');
    console.log(data.val());
    tetik();
  }
});

/*
onValue(commentsRef, (data) => {
  if(data){
    console.log(' value hamle algılandı');
    console.log(path);
    console.log(data.val());
    tetik();
    
  }
});
*/
/*
  
    onChildChanged(commentsRef, (data) => {
      if(data){
        console.log('tetik changed hamle algılandı');
        //console.log(path);
        console.log(data.val());
        console.log('güncel path:  '+path);
        var z=data.val();
        var a='1111';
        console.log(z.a);
        
      }
    });
    */
 /*
onChildAdded(commentsRef, (data) => {
  if(data){
    console.log(' added hamle algılandı');
    console.log(path);
    console.log(data.val());
    tetik();
    
  }
});
*/
/*

    onChildAdded(commentsRef, (data) => {
      if(data){
        console.log(' tetik added hamle algılandı');
        console.log(path);
        console.log(data.val());
        
      }
      
    });*/
   
