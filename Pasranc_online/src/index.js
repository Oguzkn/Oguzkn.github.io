//---------------------------firebase bağlantı kısmı------------------>
import { initializeApp } from 'firebase/app';
import { getDatabase, ref,set,get,child, update ,onChildChanged, onValue} from "firebase/database";
import { getAuth, signInAnonymously ,onAuthStateChanged} from "firebase/auth"; 
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
const auth = getAuth();
signInAnonymously(auth)
  .then(() => {
    // Signed in..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });
  

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
    document.getElementById('oyun_ekranı').style.display='flex';

    document.getElementById('oyuncu_ismi').innerHTML=prm_p1_id;
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
      
      
    document.getElementById("oyun_giriş_ekranı").style.display='none';
     document.getElementById('oyun_ekranı').style.display='flex';

    var oda_id=document.getElementById('oda_id_bilgi').innerHTML=prm_oda_id;

    document.getElementById('oyuncu_ismi').innerHTML=prm_p2_id;
    document.getElementById('rakip_durumu').innerHTML=p_verisi.p1_name;
    console.log('KATILINILAN ODA NUMARASI: '+prm_oda_id);
   
}

//------------------------- oyun ekranı kısmı foksiyonları ve tanımlamaları---------------------------->
var konum_1=[];var konum_2=[];var cins_1=[];var cins_2=[];var son_hamle={konum_1:"",konum_2:"",cins_1:"",cins_2:""};var konum_yazisi;var oyuncu_rengi;
var harf_koordinatlar=["A","B","C","D","E","F","G","H"];var sayi_koordinatlar=["1","2","3","4","5","6","7","8"];
var koordinatlar=[
  "A1","A2","A3","A4","A5","A6","A7","A8",
"B1","B2","B3","B4","B5","B6","B7","B8",
"C1","C2","C3","C4","C5","C6","C7","C8",
"D1","D2","D3","D4","D5","D6","D7","D8",
"E1","E2","E3","E4","E5","E6","E7","E8",
"F1","F2","F3","F4","F5","F6","F7","F8",
"G1","G2","G3","G4","G5","G6","G7","G8",
"H1","H2","H3","H4","H5","H6","H7","H8",]

window.ilk_konum_bilgi=function(prm_ilk_konum){ // şeçilen tuşun konum bilgisini veriyor ve harf konumunu yolluyor
  
  //console.log("İLK SEÇİLEN TUŞUN KONUMU:"+prm_ilk_konum[0]);
  konum_yazisi = prm_ilk_konum[0];
  //console.log("İLK SEÇİLEN TUŞUN KONUMUNUN HARF DEĞERİ:"+konum_yazisi[0]);
  //console.log("ilk_konum_bilgi fonksiyonu bitti");
  return konum_yazisi;
}
var hamle_konumları_esas = [];
window.hamle_konum_bilgileri=function(prm_olasi_bütün_konum,prm_taş_rengi){ // olası hamle konumlarını tespit eder ve renklendirir
  var hamle_konumları=[];
  
  var seçilen_taşın_rengi;
  var rakip_renk ;
  var a;var b;var i;
  for (a=0;a<64;a++){ //bu for dongüsü hesaplanan hamleleri tahta içindeki hamleler ile karşılaştırıp kabul edilecek hamleleri seçiyor
      for(b=0;b<64;b++){ 
          if (prm_olasi_bütün_konum[a] == koordinatlar[b]) {
              //console.log(olasi_bütün_konum[a]);
              hamle_konumları.push(prm_olasi_bütün_konum[a]);   
          }
      }       
  }
  hamle_konumları=hamle_konumları.filter(function(element){return element!==undefined;}) // kabul edilebilecek hamlelerin arasından  undefined değerlerini temizliyor

  //console.log("HAMLE_KONUMLARI:"+hamle_konumları);

  if (prm_taş_rengi[0][0]=="s"){seçilen_taşın_rengi="siyah";rakip_renk="b";}// hamle taşlarının rengine göre rakip rengi seçiyor // alttaki for döngüsü için 
  if (prm_taş_rengi[0][0]=="b"){seçilen_taşın_rengi="beyaz";rakip_renk="s";}

  for (i=0;i<hamle_konumları.length;i++){ // bu for döngüsü renklendirilecek hamle yollarında takımından taşı var mı kontrol ediyor
      if ((document.getElementById(hamle_konumları[i]).title == "BOŞ")||(document.getElementById(hamle_konumları[i]).title[0] == rakip_renk)){
          hamle_konumları_esas.push(hamle_konumları[i]);
          
      } 
  }
  for (a=0;a<hamle_konumları_esas.length;a++){// bu for döngüsü kabul edilebilecek konumların rengini kırmızıya çeviriyor
      document.getElementById(hamle_konumları_esas[a]).style.backgroundColor="#A52A2A"; 
  }
  
  //console.log("hamle_konum_bilgileri fonksiyonu bitti");
  
}
window.hamle=function(prm_konum,prm_cins){ // hamle yapmanı sağlıyor <--- EN önemli kısım --->
  var harf_indexi;
  var olasi_bütün_konum=[];
  var olasi_harf_konum=[];
  var olasi_sayi_konum=[];
  
  if (konum_1.length==0){// ilk buton seçilmişte bu block çalışır
    konum_1.push(prm_konum);cins_1.push(prm_cins); // ilk konum ve cins verileri depolanır
    console.log('tuş bir algılandı');
    if(oyuncu_rengi==undefined){
      oyuncu_rengi=prm_cins[0];
      
    }
    hamle_konumları_esas = [];
    
  }else{// ikinci buton seçilmişse bu block çalışır
    konum_2.push(prm_konum);cins_2.push(prm_cins);//ikinci konum ve taş cinsi verileri depolanır
    var a;
    for (a=0;a<64;a++){document.getElementById(koordinatlar[a]).style.backgroundColor="#98c2ea";} // hamle yollarını gösteren renk değişimini sıfırlıyor 

    anlık_hamle_yazma(konum_1[0],konum_2[0],cins_1[0],cins_2[0]);// hamleyi database e yolluyor

    konum_1=[];cins_1=[];konum_2=[];cins_2=[]; // verileri temizliyor bir sonraki hamleye hazırlık
    console.log("tuş iki algılandı");  
         
    }
  var boş_liste=[];
  if((cins_1!=boş_liste)&&(oyuncu_rengi==cins_1[0][0])){// ilk seçilen taştan sonra rakibin taşını oynamana izin vermiyor
    //console.log(oyuncu_rengi);
    if ((cins_1.length != 0)&&(cins_1[0][4] == "k")) { // OLASI KALE HAREKETLERİNİ HESAPLIYOR 
        

      ilk_konum_bilgi(konum_1);
      console.log("KALE ALGILANDI");

      olasi_bütün_konum.push(konum_yazisi[0]+1);// dikine hareket 
      olasi_bütün_konum.push(konum_yazisi[0]+2);
      olasi_bütün_konum.push(konum_yazisi[0]+3);
      olasi_bütün_konum.push(konum_yazisi[0]+4);
      olasi_bütün_konum.push(konum_yazisi[0]+5);
      olasi_bütün_konum.push(konum_yazisi[0]+6);
      olasi_bütün_konum.push(konum_yazisi[0]+7);
      olasi_bütün_konum.push(konum_yazisi[0]+8);

      olasi_bütün_konum.push("A"+konum_yazisi[1]); // yatay hareket
      olasi_bütün_konum.push("B"+konum_yazisi[1]);
      olasi_bütün_konum.push("C"+konum_yazisi[1]);
      olasi_bütün_konum.push("D"+konum_yazisi[1]);
      olasi_bütün_konum.push("E"+konum_yazisi[1]);
      olasi_bütün_konum.push("F"+konum_yazisi[1]);
      olasi_bütün_konum.push("G"+konum_yazisi[1]);
      olasi_bütün_konum.push("H"+konum_yazisi[1]);
      
      //console.log("OLASI BÜTÜN KONUMLAR :"+olasi_bütün_konum);

      hamle_konum_bilgileri (olasi_bütün_konum,cins_1);
      
    }
    if ((cins_1.length != 0)&&(cins_1[0][4] == "a")) { // OLASI AT HAREKETLERİNİ HESAPLIYOR

        
        ilk_konum_bilgi(konum_1);
        console.log("AT ALGILANDI");

        harf_indexi=harf_koordinatlar.indexOf(konum_yazisi[0]);
        //console.log(konum_yazisi[1]);

        olasi_harf_konum.push(harf_koordinatlar[harf_indexi-2]);
        olasi_harf_konum.push(harf_koordinatlar[harf_indexi-1]);
        olasi_harf_konum.push(harf_koordinatlar[harf_indexi+1]);
        olasi_harf_konum.push(harf_koordinatlar[harf_indexi+2]);
        //console.log(olasi_harf_konum);

        
        olasi_sayi_konum.push(konum_yazisi[1] -2);
        olasi_sayi_konum.push(konum_yazisi[1] -1);
        olasi_sayi_konum.push(konum_yazisi[1] -1+2);
        olasi_sayi_konum.push(konum_yazisi[1] -1+3);
        //console.log(olasi_sayi_konum);

        olasi_bütün_konum.push(olasi_harf_konum[0]+olasi_sayi_konum[1]);
        olasi_bütün_konum.push(olasi_harf_konum[0]+olasi_sayi_konum[2]);
        olasi_bütün_konum.push(olasi_harf_konum[1]+olasi_sayi_konum[0]);
        olasi_bütün_konum.push(olasi_harf_konum[1]+olasi_sayi_konum[3]);
        olasi_bütün_konum.push(olasi_harf_konum[2]+olasi_sayi_konum[0]);
        olasi_bütün_konum.push(olasi_harf_konum[2]+olasi_sayi_konum[3]);
        olasi_bütün_konum.push(olasi_harf_konum[3]+olasi_sayi_konum[1]);
        olasi_bütün_konum.push(olasi_harf_konum[3]+olasi_sayi_konum[2]);
        //console.log(olasi_bütün_konum);

        hamle_konum_bilgileri (olasi_bütün_konum,cins_1);
        
        
    }
    if ((cins_1.length != 0)&&(cins_1[0][4] == "f")) { // OLASI FİL HAREKETLERİNİ HESAPLIYOR

        ilk_konum_bilgi(konum_1);
        console.log("FİL ALGILANDI");

        harf_indexi = harf_koordinatlar.indexOf(konum_yazisi[0]);
        
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1]+(konum_yazisi[1]-1)); //sol üst çapraz
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-2]+(konum_yazisi[1]-2));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-3]+(konum_yazisi[1]-3));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-4]+(konum_yazisi[1]-4));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-5]+(konum_yazisi[1]-5));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-6]+(konum_yazisi[1]-6));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-7]+(konum_yazisi[1]-7));
        
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+2]+(konum_yazisi[1]-1+2)); // sağ alt çapraz
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+3]+(konum_yazisi[1]-1+3));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+4]+(konum_yazisi[1]-1+4));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+5]+(konum_yazisi[1]-1+5));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+6]+(konum_yazisi[1]-1+6));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+7]+(konum_yazisi[1]-1+7));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+8]+(konum_yazisi[1]-1+8));

        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+2]+(konum_yazisi[1]-1));// sağ üst çapraz
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+3]+(konum_yazisi[1]-2));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+4]+(konum_yazisi[1]-3));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+5]+(konum_yazisi[1]-4));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+6]+(konum_yazisi[1]-5));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+7]+(konum_yazisi[1]-6));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+8]+(konum_yazisi[1]-7));
        
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1]+(konum_yazisi[1]-1+2)); // sol alt çapraz
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-2]+(konum_yazisi[1]-1+3));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-3]+(konum_yazisi[1]-1+4));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-4]+(konum_yazisi[1]-1+5));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-5]+(konum_yazisi[1]-1+6));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-6]+(konum_yazisi[1]-1+7));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-7]+(konum_yazisi[1]-1+8));

        //console.log(olasi_bütün_konum);

        hamle_konum_bilgileri (olasi_bütün_konum,cins_1);
        

    }
    if ((cins_1.length != 0)&&(cins_1[0][4] == "p")) { // OLASI PİYON HAREKETERİNİ HESAPLIYOR
        
        ilk_konum_bilgi(konum_1);
        console.log("PİYON ALGILANDI");

        harf_indexi = harf_koordinatlar.indexOf(konum_yazisi[0]);
        if (cins_1[0][0]=="b"){// BEYAZ SIYAH AYRIMI (BEYAZ İÇİN)
            olasi_bütün_konum.push(harf_koordinatlar[harf_indexi]+(konum_yazisi[1]-1+2));// bir sonrası 
            olasi_bütün_konum.push(harf_koordinatlar[harf_indexi]+(konum_yazisi[1]-1+3));// iki sonrası
        }
        if (cins_1[0][0]=="s"){// BEYAZ SİYAH AYRIMI( SİYAH İÇİN)
            olasi_bütün_konum.push(harf_koordinatlar[harf_indexi]+(konum_yazisi[1]-1));// bir sonrası 
            olasi_bütün_konum.push(harf_koordinatlar[harf_indexi]+(konum_yazisi[1]-2));// iki sonrası

        }
        //console.log(olasi_bütün_konum);
        hamle_konum_bilgileri (olasi_bütün_konum,cins_1);
        
    }
    if ((cins_1.length != 0)&&(cins_1[0][4] == "v")) { // OLASI VEZİR HAREKETLERİNİ HESAPLIYOR 

        ilk_konum_bilgi(konum_1);
        console.log("VEZİR ALGILANDI");

        harf_indexi = harf_koordinatlar.indexOf(konum_yazisi[0]);

        olasi_bütün_konum.push(konum_yazisi[0]+1);// dikine hareket
        olasi_bütün_konum.push(konum_yazisi[0]+2);
        olasi_bütün_konum.push(konum_yazisi[0]+3);
        olasi_bütün_konum.push(konum_yazisi[0]+4);
        olasi_bütün_konum.push(konum_yazisi[0]+5);
        olasi_bütün_konum.push(konum_yazisi[0]+6);
        olasi_bütün_konum.push(konum_yazisi[0]+7);
        olasi_bütün_konum.push(konum_yazisi[0]+8);

        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1]+(konum_yazisi[1]-1)); //sol üst
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-2]+(konum_yazisi[1]-2));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-3]+(konum_yazisi[1]-3));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-4]+(konum_yazisi[1]-4));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-5]+(konum_yazisi[1]-5));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-6]+(konum_yazisi[1]-6));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-7]+(konum_yazisi[1]-7));
        
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+2]+(konum_yazisi[1]-1+2)); // sağ alt
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+3]+(konum_yazisi[1]-1+3));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+4]+(konum_yazisi[1]-1+4));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+5]+(konum_yazisi[1]-1+5));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+6]+(konum_yazisi[1]-1+6));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+7]+(konum_yazisi[1]-1+7));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+8]+(konum_yazisi[1]-1+8));
        
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+2]+(konum_yazisi[1]-1));// sağ üst
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+3]+(konum_yazisi[1]-2));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+4]+(konum_yazisi[1]-3));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+5]+(konum_yazisi[1]-4));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+6]+(konum_yazisi[1]-5));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+7]+(konum_yazisi[1]-6));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+8]+(konum_yazisi[1]-7));
        
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1]+(konum_yazisi[1]-1+2)); // sol alt
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-2]+(konum_yazisi[1]-1+3));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-3]+(konum_yazisi[1]-1+4));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-4]+(konum_yazisi[1]-1+5));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-5]+(konum_yazisi[1]-1+6));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-6]+(konum_yazisi[1]-1+7));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-7]+(konum_yazisi[1]-1+8));

        //console.log(olasi_bütün_konum);

        hamle_konum_bilgileri (olasi_bütün_konum,cins_1);
        
    }
    if ((cins_1.length != 0)&&(cins_1[0][4] == "ş")) { // OLASI ŞAH HAREKETLERİNİ HESAPLIYOR

        ilk_konum_bilgi(konum_1);
        console.log("KALE ALGILANDI");

        harf_indexi = harf_koordinatlar.indexOf(konum_yazisi[0]);

        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1]+(konum_yazisi[1]-1)); // bir birim çevresi
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1]+(konum_yazisi[1]));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1]+(konum_yazisi[1]-1+2));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi]+(konum_yazisi[1]-1));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi]+(konum_yazisi[1]-1+2));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+2]+(konum_yazisi[1]-1));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+2]+(konum_yazisi[1]));
        olasi_bütün_konum.push(harf_koordinatlar[harf_indexi-1+2]+(konum_yazisi[1]-1+2));

        //console.log(olasi_bütün_konum);

        hamle_konum_bilgileri (olasi_bütün_konum,cins_1);
        
    }
    
  }else{
    alert ("rakip taşı oynatamazsın");
    konum_1=[];cins_1=[];

  }

  
}
window.anlık_hamle_yazma=function(prm_konum_1,prm_konum_2,prm_cins_1,prm_cins_2){ // oyuncu hamlesini tamamladığında hamle bilgilerini database yolluyor 
  var oda_id=document.getElementById('oda_id_bilgi').innerHTML;
  get(child(ref(getDatabase()), `Odalar/${oda_id}`)).then((snapshot) => {
    if (snapshot.exists()) { 
      var datalar=snapshot.val();var prm_p1_id = datalar.p1_name;var prm_p2_id = datalar.p2_name;var prm_oda_id = datalar.oda_kodu;
      const p_verisi={
        oda_kodu:prm_oda_id, 
        p1_name:prm_p1_id,
        p2_name:prm_p2_id,
        konum_1:prm_konum_1,
        konum_2:prm_konum_2,
        cins_1:prm_cins_1,
        cins_2:prm_cins_2
      };
      
      if(son_hamle.cins_1.charAt(0)==p_verisi.cins_1.charAt(0)){// arka arkaya hamle yapmayı engelliyor
        hamle_konumları_esas=[];
      }else{
        if(hamle_konumları_esas.includes(p_verisi.konum_2)){//
        
          if((son_hamle.cins_1==p_verisi.cins_2)&&(son_hamle.cins_2==p_verisi.cins_1)){// oyunun döngüye girmesini engelliyor
            alert("BU HAMLEYİ YAPAMAZSINIZ");
          }else{
          const updates = {};
          updates['Odalar/' + oda_id] = p_verisi;
          return update(ref(getDatabase()), updates);
          }
        }
      }
    } else {
      console.log("VERİ YOK VERİ");
    }}).catch((error) => { console.error(error);});
}
window.tetik=function(){ //tetik çalıştığında ilgili odaya girip verileri alıyor 
  
  if(oda_id==='ODAİDBİLGİ'){
    oda_id=document.getElementById('oda_id_bilgi').innerHTML;
    path='Odalar/'+oda_id+'/';
    //console.log('güncel path:  '+path);

    const commentsRef = ref(getDatabase(), path);
    
    onValue(commentsRef, (data) => {
      if(data){
        
        var dbden_çekilen_veriler=data.val();

        //console.log('güncel path:  '+path);
        anlık_hamle_görselleştirme(dbden_çekilen_veriler);
        
      }
    });
  }
}
window.anlık_hamle_görselleştirme=function(çekilen_veri){// tetik sonrası okunan verilere göre oyun tahtası görüntüsünü düzenliyor görseli düzenliyor
  
  if(çekilen_veri.cins_1!=''){
    var konum_1=çekilen_veri.konum_1;
    var konum_2=çekilen_veri.konum_2;
    var cins_2=çekilen_veri.cins_2;
    var cins_1=çekilen_veri.cins_1;
    
    var ilk_cins=document.getElementById(konum_1).style.backgroundImage;
    var ikinci_cins=document.getElementById(konum_2).style.backgroundImage;
    document.getElementById(konum_1).style.backgroundImage=ikinci_cins;
    document.getElementById(konum_2).style.backgroundImage=ilk_cins;
    document.getElementById(konum_1).title=cins_2; 
    document.getElementById(konum_2).title=cins_1;

    
    son_hamle=çekilen_veri;
    var yeni_span = document.createElement("span_hamle"); //hamle kaydı için her seferinde yeni span etiketi oluşturuyor
    var cins_1_edit=cins_1.slice(4,9);
    var yeni_hamle_node = document.createTextNode(cins_1_edit.toUpperCase()+"||"+konum_1+">"+konum_2+"\n");// span etiketi içine eklenecek texti hazırlıyor
    yeni_span.appendChild(yeni_hamle_node); //spanın içerisine texti ekliyor
    document.getElementById("hamleler").appendChild(yeni_span);// spanı tablo divine ekliyor

    if((cins_1=='b_1_şah')&&(konum_2[1]=='8')){
      var mesaj='Oyun Bitti Beyaz Kazandı';
      alert_bildirim(mesaj);
    }
    if((cins_1=='s_1_şah')&&(konum_2[1]=='1')){
      var mesaj='Oyun Bitti Siyah Kazandı';
      alert_bildirim(mesaj);
    }


    if(çekilen_veri.p2_name){document.getElementById('rakip_durumu').innerHTML=çekilen_veri.p2_name;}
    if(çekilen_veri.p2_name==document.getElementById('oyuncu_ismi').innerHTML){document.getElementById('rakip_durumu').innerHTML=çekilen_veri.p1_name;}
  }
  return son_hamle;

}
var oda_id=document.getElementById('oda_id_bilgi').innerHTML;var path='/';const commentsRef = ref(getDatabase(), path);
onChildChanged(commentsRef, (data) => { // rtbd e her veri girişininde tetikleniyor
  if(data){
    //console.log(' changed hamle algılandı');
    //console.log(data.val());
    tetik();
  }
});

window.alert_bildirim=function(prm_mesaj){
  document.getElementById("alert_div").style.display='flex';
  document.getElementById("alert_mesaj").innerHTML=prm_mesaj;

}

window.addEventListener('beforeunload', (event) => {
  event.returnValue = `Are you sure you want to leave?`;
  
});
/*
<------- VERİ TABANINA NASIL BAĞLANIYORUM-------->
1- öncelikle nodejs kullanarak firebase modüllerilerini indirdim.
2-firebase console ayarlarından veri tabanı configleri sayesinde kendi açtığım  veri tabannına bağlandım.

<---------- Oda_kur fonksiyonu nasıl çalışıyor-------->
1-Oda_kur fonksiyonu oyun ekran girişinde p1 den oda kodu alıyor 
2-Aldığı oda kodunu ref ile bağlandığım db konumuna set ile bir oda açıyorum ve içerisinde sahte bir kullanıcı ismi ile oda kodunu ekliyorum.
3-p1 ilerlemesi olduğu için giriş ekranını kaldırıp oyun ekranını ekliyorum.

<-----------oda_katıl nasıl çalışıyor------------->
1-giriş ekranından aldığı oda kodunu kullanarak ref ile belirlenen dizindeki verileri çekiyor.
2-çektiği verileri tekrar yazmak üzere p verisi objesine sahte hamle verileri ile ekliyor.
3-p2 ilerlemesi olduğu için giriş ekranınnı kaldırıp oyun ekranını aktifleştiriyor.

<----------ilk_konum_bilgi ne işe yarıyor----------->
1- içerisinde geliştiriken işimi kolaylaşıran console.log içeriyor ve konum_yazisi adındaki kısa süreli tutulan değişkene seçilmiş tuşun  konum harfini atıyor ve return ile dışarı tanımlıyor.

<----------hamle_konum_bilgileri ne işe yarıyor ------->
1-hamle renklendirmesinde görev alıyor
2- önce parametre olarak aldığı ham hamle olasılıklarını koordinatlar ile karşılaştırıp eşleşenleri hamle_kkonumları listesine ekliyor.
3-mümkün olmayanlar undefined türüne çevrildiği için bir sonraki tek satırlık bloktan undefinde temizliği yapıyor.
4-mümkün olan hamle konumları üzerinden takım arkadaşı var mı kontrol ediyor varsa eliyor ve son kalan hamle olasılıkklarını hamle_konumları_esas listesine ekliyor.
5-hamle_konumları_esas liste içeriğimi kırmızı renklendiriyor.

<--------- hamle fonksiyonu ne işe yarıyor---------->
1-hamle fonskiyonu temel işlevi yürütüyor(ilk tuş algılaması ,ikinci tuş alıglaması ,algılanan tuşun cinsinin belirlenmesi ,bu belirlenen cinse göre ham hamle konumlarını hesaplama vb.)
2- ikinci tuş bloğunun içerisnde olası hamlelerinin renklendrimesini sfırlanyan bir kod bulağu bulunuyor.
3- ikinci tuş bloğunun içerinde hamle verilerini db yollayan fonksiyon bulunuyor.

<---------- anlık hamle yazma ne işe yarıyor--------->
1-hamle fonksiyonun else bloğu ile tetiklenir
2- paramaetre olrak aldığı verileri databse içerisine yzar ama bunu öncekini önce siler sonra yazar.

<---------- onChildChange ne işe yarar ----------->
1- bu firebase kütüphanesinden kullandığın bir fonksiyon
2-temelde veritabanındaki değişimleri algılıyor.
3- tetik fonksiyonunu çağırıyor.

<--------- tetik ne işe yarıyor----------->
1- tetik tetiklendiğinde oda_id bilgisini html içerisine otomatik aktarılan ODAİDBİLGİ divinden çekiyor.
2- çektiği bu veriyle oda numarasına erişebilecek pathı oluşturuyor.
3- bu pathi kullanan onValue fonksiyonu verileri çekiyor.
4- çekilen verileri anlık hamle görselleştirme fonksiyonuyla her iki ekrandan tahataya döküyor.


<----------- oyunun döngüye girmemesi nasıl sağlanıyor------->
1-anlık_hamle_görselleştirme fonksiyonu içersinde son_hamle adında bir liste var
2- bu liste dbden okunan son veriyi alıyor.
3-anlık_hamle_yazma fonksiyonunun içerisinde gerçekleşen db e yazılma işlemi öncesi aynı hamlenin tersi mi yapılmış kontrol ediliyor eğer oyunu döngüye sokacak hamleyse ekrana uyarı veriyor.

<--------oyun ilerleme şekli---------->

1-Bir oda kodu belirler ve odaya katıl butonuna tıklar.
2- P2 oyuncusunu bekler o odaya katılana kadar işlem yapamaz.
3-P2 odaya katıldığında oyun başlar.
4-siyah beyaz kararı verilir.
5-P1 bir taş seçer(hamle fonksiyonu if bloğu tetiklenir prm olarak konum ve taş cinsi bilgisi gönderir.)
6-P1 bir konum seçer(hamle fonksiyonu else bloğu tetiklenir,ilk tetiklenme ile ikinci tetiklenme kısmında toplanan veriler db e gönderilir )
7-P2 ONVALUE db e veri girişiyle tetiklenir.
8-P2 de 5,6,7 numaraları tekrarlar böylece oyun devam ettmiş olur.



 


*/
