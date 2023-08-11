//---------------------------FİREBASE CONNECT------------------>
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
const app = initializeApp(firebaseConfig); 
const db = getDatabase(app);
const auth = getAuth();
signInAnonymously(auth)
  .then(() => {
    // Signed in..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errormesaj = error.mesaj;
    // ...
  });

//--------------------------LOGİN PAGE ---------------->

window.create_room= function(prm_oda_no,prm_oyuncu1) { 
    const reference=ref(db, 'Rooms/' + prm_oda_no); //----- firebaseye oda_nosunu içeren bir path ekleyip içerisine oda_no ve player1 isimlerini ekliyor
    set(reference, {
      Room_No:prm_oda_no,
      Player1_Nick:prm_oyuncu1
    });
    
    document.getElementById('room_no_info').innerHTML= prm_oda_no;//---- room_no_info divinin textini prm olarak gelen oda_no ile  değiştiriyor 
    
    
    document.getElementById("login_page").style.display='none';//----login_page divini saklayıp game_page divini ortaya çıkarıyor
    document.getElementById('game_page').style.display='grid';

    document.getElementById('gamer_name_1').innerHTML=prm_oyuncu1;// gamer_name_1 divinin textini prm olarak gelen player1 ile değiştiriyor 

    console.log('OLUŞTURULAN VE KATILINILAN ODA NUMARASI: '+prm_oda_no);

}

window.join_room=function(prm_oda_no,prm_oyuncu2){ 
  var oyuncu1_değeri;
    get(child(ref(getDatabase()), `Rooms/${prm_oda_no}`)).then((snapshot) => { //--- firebaseyeden oda kodunu kullarak bir path oluşturuyor onsan bir anlık görüntü alıyor
      if (snapshot.exists()) { //--- görüntüde bir şey varsa 
        var oda_no_ve_oyuncu1_değerleri=snapshot.val();//--- value değerinden oda numarası ve player 1 isimlerini çekiyor
        oyuncu1_değeri= oda_no_ve_oyuncu1_değerleri.Player1_Nick;
        const dbe_gönderilen_veri_listesi={//----firebaseye updatelenecek json dosyasını içeriği düzenleniyor
          Room_No:prm_oda_no, 
          Player1_Nick:oyuncu1_değeri,
          Player2_Nick:prm_oyuncu2,
          Location_1:'',
          Location_2:'',
          Gender_1:'',
          Gender_2:''          
        };
        document.getElementById('room_no_info').innerHTML=prm_oda_no;//---- room_no_info divinin textini prm olarak gelen oda_no ile  değiştiriyor 
        document.getElementById('gamer_name_1').innerHTML=oyuncu1_değeri;//---- oyuncu isimlerini içeren divlerin textlerini değiştirir.
        document.getElementById('gamer_name_2').innerHTML=prm_oyuncu2;
    
        const updates = {};
        updates['Rooms/' + prm_oda_no] = dbe_gönderilen_veri_listesi;//--- fireabaseye path oluşturup update yapıyor
        return update(ref(getDatabase()), updates);
      } else {
        console.log("VERİ YOK VERİ");
        alert_bildirim("ODA NUMARASI BULUNAMADI");
      }}).catch((error) => { console.error(error);});
      
      
      
    document.getElementById("login_page").style.display='none';//----login_page divini saklayıp game_page divini ortaya çıkarıyor
    document.getElementById('game_page').style.display='grid';

    console.log('KATILINILAN ODA NUMARASI: '+prm_oda_no);
   
}

//------------------------- GAME PAGE---------------------------->
var konum_1=[];
var konum_2=[];
var cins_1=[];
var cins_2=[];

var konum_harf;
var oyuncu_rengi;
var harf_konumları=["A","B","C","D","E","F","G","H"];
var sayı_konumları=["1","2","3","4","5","6","7","8"];
var koordinatlar=["A1","A2","A3","A4","A5","A6","A7","A8","B1","B2","B3","B4","B5","B6","B7","B8","C1","C2","C3","C4","C5","C6","C7","C8","D1","D2","D3","D4","D5","D6","D7","D8","E1","E2","E3","E4","E5","E6","E7","E8","F1","F2","F3","F4","F5","F6","F7","F8","G1","G2","G3","G4","G5","G6","G7","G8","H1","H2","H3","H4","H5","H6","H7","H8",]


var esas_hamle_konumları = [];
window.hamle_konumları_bilgisi=function(prm_olası_bütün_konumlar,prm_taş_rengi){ // olası hamle konumlarını tespit eder ve renklendirir
  var hamle_konumları=[];
  var seçilmiş_taş_rengi;
  var rakip_rengi ;
  var a;var b;var i;
  for (a=0;a<64;a++){ //bu for dongüsü hesaplanan hamleleri 64 KOORDİNATTAN BİRİNDE Mİ DİYE BAKIP karşılaştırıp kabul edilecek hamleleri seçiyor
      for(b=0;b<64;b++){ 
          if (prm_olası_bütün_konumlar[a] == koordinatlar[b]) {
              hamle_konumları.push(prm_olası_bütün_konumlar[a]);   
            }
      }
  }

  hamle_konumları=hamle_konumları.filter(function(element){return element!==undefined;}) // kabul edilebilecek hamlelerin arasından  undefined değerlerini temizliyor

  if (prm_taş_rengi[0][0]=="s"){seçilmiş_taş_rengi="siyah";rakip_rengi="b";}// hamle taşlarının rengine göre rakip rengi seçiyor // alttaki for döngüsü için 
  if (prm_taş_rengi[0][0]=="b"){seçilmiş_taş_rengi="beyaz";rakip_rengi="s";}

  for (i=0;i<hamle_konumları.length;i++){ // bu for döngüsü renklendirilecek hamle yollarında takımından taşı var mı kontrol ediyor
      if ((document.getElementById(hamle_konumları[i]).title == "BOŞ")||(document.getElementById(hamle_konumları[i]).title[0] == rakip_rengi)){
          esas_hamle_konumları.push(hamle_konumları[i]);
      } 
  }
  for(i=0;i<hamle_konumları.length;i++){
    if (document.getElementById(hamle_konumları[i]).title[0]==seçilmiş_taş_rengi[0]){
      //console.log("TESPİT EDİLEN TAKIM ARKADAŞI KONUMU : "+hamle_konumları[i]);
    }
  }

  for (a=0;a<esas_hamle_konumları.length;a++){document.getElementById(esas_hamle_konumları[a]).style.backgroundColor="#A52A2A";} // bu for döngüsü kabul edilebilecek konumların rengini kırmızıya çeviriyor
  

}
window.move=function(prm_konum,prm_cins){ // hamle yapmanı sağlıyor <--- EN önemli kısım --->
  var harf_indexi;
  var olası_bütün_konumlar=[];
  var olası_bütün_harfler=[];
  var olası_bütün_sayılar=[];
  
  if (konum_1.length==0){// ilk buton seçilmişte bu block çalışır
    konum_1.push(prm_konum);cins_1.push(prm_cins); // ilk konum ve cins verileri depolanıR
    console.log('tuş bir algılandı');
    if(oyuncu_rengi==undefined){oyuncu_rengi=prm_cins[0];}// oyuncu_rengini bellirliyor
    esas_hamle_konumları = [];
    sayac_durum("aktif");

  }else{// ikinci buton seçilmişse bu block çalışır
    konum_2.push(prm_konum);cins_2.push(prm_cins);//ikinci konum ve taş cinsi verileri depolanır
    var a;
    for (a=0;a<64;a++){document.getElementById(koordinatlar[a]).style.backgroundColor="#fff";} // hamle yollarını gösteren renk değişimini sıfırlıyor 

    rtdbe_hamle_yazıcı(konum_1[0],konum_2[0],cins_1[0],cins_2[0]);// hamleyi database e yolluyor

    konum_1=[];cins_1=[];konum_2=[];cins_2=[]; // verileri temizliyor bir sonraki hamleye hazırlık
    console.log("tuş iki algılandı");
    sayac_durum("pasif");
         
    }
  var boş_liste=[]; 
  if((cins_1 != boş_liste)&&(oyuncu_rengi[0]==cins_1[0][0])){
      
      if ((cins_1.length != 0)&&(cins_1[0][4] == "k")) { // OLASI KALE HAREKETLERİNİ HESAPLIYOR 
          
        konum_harf = konum_1[0];
        console.log("KALE ALGILANDI");
  
        olası_bütün_konumlar.push(konum_harf[0]+1);// dikine hareket 
        olası_bütün_konumlar.push(konum_harf[0]+2);
        olası_bütün_konumlar.push(konum_harf[0]+3);
        olası_bütün_konumlar.push(konum_harf[0]+4);
        olası_bütün_konumlar.push(konum_harf[0]+5);
        olası_bütün_konumlar.push(konum_harf[0]+6);
        olası_bütün_konumlar.push(konum_harf[0]+7);
        olası_bütün_konumlar.push(konum_harf[0]+8);
  
        olası_bütün_konumlar.push("A"+konum_harf[1]); // yatay hareket
        olası_bütün_konumlar.push("B"+konum_harf[1]);
        olası_bütün_konumlar.push("C"+konum_harf[1]);
        olası_bütün_konumlar.push("D"+konum_harf[1]);
        olası_bütün_konumlar.push("E"+konum_harf[1]);
        olası_bütün_konumlar.push("F"+konum_harf[1]);
        olası_bütün_konumlar.push("G"+konum_harf[1]);
        olası_bütün_konumlar.push("H"+konum_harf[1]);
        
        //console.log("OLASI BÜTÜN KONUMLAR :"+olası_bütün_konumlar);
  
        hamle_konumları_bilgisi (olası_bütün_konumlar,cins_1);
        
      }
      if ((cins_1.length != 0)&&(cins_1[0][4] == "a")) { // OLASI AT HAREKETLERİNİ HESAPLIYOR
  
          
        konum_harf = konum_1[0];
          console.log("AT ALGILANDI");
  
          harf_indexi=harf_konumları.indexOf(konum_harf[0]);
          //console.log(konum_harf[1]);
  
          olası_bütün_harfler.push(harf_konumları[harf_indexi-2]);
          olası_bütün_harfler.push(harf_konumları[harf_indexi-1]);
          olası_bütün_harfler.push(harf_konumları[harf_indexi+1]);
          olası_bütün_harfler.push(harf_konumları[harf_indexi+2]);
          //console.log(olası_bütün_harfler);
  
          
          olası_bütün_sayılar.push(konum_harf[1] -2);
          olası_bütün_sayılar.push(konum_harf[1] -1);
          olası_bütün_sayılar.push(konum_harf[1] -1+2);
          olası_bütün_sayılar.push(konum_harf[1] -1+3);
          //console.log(olası_bütün_sayılar);
  
          olası_bütün_konumlar.push(olası_bütün_harfler[0]+olası_bütün_sayılar[1]);
          olası_bütün_konumlar.push(olası_bütün_harfler[0]+olası_bütün_sayılar[2]);
          olası_bütün_konumlar.push(olası_bütün_harfler[1]+olası_bütün_sayılar[0]);
          olası_bütün_konumlar.push(olası_bütün_harfler[1]+olası_bütün_sayılar[3]);
          olası_bütün_konumlar.push(olası_bütün_harfler[2]+olası_bütün_sayılar[0]);
          olası_bütün_konumlar.push(olası_bütün_harfler[2]+olası_bütün_sayılar[3]);
          olası_bütün_konumlar.push(olası_bütün_harfler[3]+olası_bütün_sayılar[1]);
          olası_bütün_konumlar.push(olası_bütün_harfler[3]+olası_bütün_sayılar[2]);
          //console.log(olası_bütün_konumlar);
  
          hamle_konumları_bilgisi (olası_bütün_konumlar,cins_1);
          
          
      }
      if ((cins_1.length != 0)&&(cins_1[0][4] == "f")) { // OLASI FİL HAREKETLERİNİ HESAPLIYOR
  
          konum_harf = konum_1[0];
          console.log("FİL ALGILANDI");
  
          harf_indexi = harf_konumları.indexOf(konum_harf[0]);
          
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1]+(konum_harf[1]-1)); //sol üst çapraz
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-2]+(konum_harf[1]-2));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-3]+(konum_harf[1]-3));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-4]+(konum_harf[1]-4));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-5]+(konum_harf[1]-5));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-6]+(konum_harf[1]-6));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-7]+(konum_harf[1]-7));
          
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+2]+(konum_harf[1]-1+2)); // sağ alt çapraz
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+3]+(konum_harf[1]-1+3));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+4]+(konum_harf[1]-1+4));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+5]+(konum_harf[1]-1+5));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+6]+(konum_harf[1]-1+6));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+7]+(konum_harf[1]-1+7));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+8]+(konum_harf[1]-1+8));
  
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+2]+(konum_harf[1]-1));// sağ üst çapraz
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+3]+(konum_harf[1]-2));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+4]+(konum_harf[1]-3));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+5]+(konum_harf[1]-4));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+6]+(konum_harf[1]-5));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+7]+(konum_harf[1]-6));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+8]+(konum_harf[1]-7));
          
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1]+(konum_harf[1]-1+2)); // sol alt çapraz
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-2]+(konum_harf[1]-1+3));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-3]+(konum_harf[1]-1+4));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-4]+(konum_harf[1]-1+5));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-5]+(konum_harf[1]-1+6));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-6]+(konum_harf[1]-1+7));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-7]+(konum_harf[1]-1+8));
  
          //console.log(olası_bütün_konumlar);
  
          hamle_konumları_bilgisi (olası_bütün_konumlar,cins_1);
          
  
      }
      if ((cins_1.length != 0)&&(cins_1[0][4] == "p")) { // OLASI PİYON HAREKETERİNİ HESAPLIYOR
          
          konum_harf = konum_1[0];
          console.log("PİYON ALGILANDI");
  
          harf_indexi = harf_konumları.indexOf(konum_harf[0]);
          if (cins_1[0][0]=="b"){// BEYAZ SIYAH AYRIMI (BEYAZ İÇİN)
              olası_bütün_konumlar.push(harf_konumları[harf_indexi]+(konum_harf[1]-1+2));// bir sonrası 
              olası_bütün_konumlar.push(harf_konumları[harf_indexi]+(konum_harf[1]-1+3));// iki sonrası
          }
          if (cins_1[0][0]=="s"){// BEYAZ SİYAH AYRIMI( SİYAH İÇİN)
              olası_bütün_konumlar.push(harf_konumları[harf_indexi]+(konum_harf[1]-1));// bir sonrası 
              olası_bütün_konumlar.push(harf_konumları[harf_indexi]+(konum_harf[1]-2));// iki sonrası
  
          }
          //console.log(olası_bütün_konumlar);
          hamle_konumları_bilgisi (olası_bütün_konumlar,cins_1);
          
      }
      if ((cins_1.length != 0)&&(cins_1[0][4] == "v")) { // OLASI VEZİR HAREKETLERİNİ HESAPLIYOR 
  
          konum_harf = konum_1[0];
          console.log("VEZİR ALGILANDI");
  
          harf_indexi = harf_konumları.indexOf(konum_harf[0]);
  
          olası_bütün_konumlar.push(konum_harf[0]+1);// dikine hareket
          olası_bütün_konumlar.push(konum_harf[0]+2);
          olası_bütün_konumlar.push(konum_harf[0]+3);
          olası_bütün_konumlar.push(konum_harf[0]+4);
          olası_bütün_konumlar.push(konum_harf[0]+5);
          olası_bütün_konumlar.push(konum_harf[0]+6);
          olası_bütün_konumlar.push(konum_harf[0]+7);
          olası_bütün_konumlar.push(konum_harf[0]+8);

        olası_bütün_konumlar.push("A"+konum_harf[1]); // yatay hareket
        olası_bütün_konumlar.push("B"+konum_harf[1]);
        olası_bütün_konumlar.push("C"+konum_harf[1]);
        olası_bütün_konumlar.push("D"+konum_harf[1]);
        olası_bütün_konumlar.push("E"+konum_harf[1]);
        olası_bütün_konumlar.push("F"+konum_harf[1]);
        olası_bütün_konumlar.push("G"+konum_harf[1]);
        olası_bütün_konumlar.push("H"+konum_harf[1]);
  
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1]+(konum_harf[1]-1)); //sol üst
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-2]+(konum_harf[1]-2));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-3]+(konum_harf[1]-3));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-4]+(konum_harf[1]-4));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-5]+(konum_harf[1]-5));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-6]+(konum_harf[1]-6));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-7]+(konum_harf[1]-7));
          
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+2]+(konum_harf[1]-1+2)); // sağ alt
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+3]+(konum_harf[1]-1+3));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+4]+(konum_harf[1]-1+4));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+5]+(konum_harf[1]-1+5));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+6]+(konum_harf[1]-1+6));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+7]+(konum_harf[1]-1+7));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+8]+(konum_harf[1]-1+8));
          
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+2]+(konum_harf[1]-1));// sağ üst
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+3]+(konum_harf[1]-2));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+4]+(konum_harf[1]-3));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+5]+(konum_harf[1]-4));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+6]+(konum_harf[1]-5));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+7]+(konum_harf[1]-6));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+8]+(konum_harf[1]-7));
          
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1]+(konum_harf[1]-1+2)); // sol alt
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-2]+(konum_harf[1]-1+3));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-3]+(konum_harf[1]-1+4));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-4]+(konum_harf[1]-1+5));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-5]+(konum_harf[1]-1+6));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-6]+(konum_harf[1]-1+7));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-7]+(konum_harf[1]-1+8));
  
          //console.log(olası_bütün_konumlar);
  
          hamle_konumları_bilgisi (olası_bütün_konumlar,cins_1);
          
      }
      if ((cins_1.length != 0)&&(cins_1[0][4] == "ş")) { // OLASI ŞAH HAREKETLERİNİ HESAPLIYOR
  
          konum_harf = konum_1[0];
          console.log("KALE ALGILANDI");
  
          harf_indexi = harf_konumları.indexOf(konum_harf[0]);
  
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1]+(konum_harf[1]-1)); // bir birim çevresi
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1]+(konum_harf[1]));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1]+(konum_harf[1]-1+2));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi]+(konum_harf[1]-1));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi]+(konum_harf[1]-1+2));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+2]+(konum_harf[1]-1));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+2]+(konum_harf[1]));
          olası_bütün_konumlar.push(harf_konumları[harf_indexi-1+2]+(konum_harf[1]-1+2));
  
          //console.log(olası_bütün_konumlar);
  
          hamle_konumları_bilgisi (olası_bütün_konumlar,cins_1);
          
      }
  }else{alert ("Rakip taşı veya boş bir kareyi seçtiniz.");konum_1=[];cins_1=[];}
}
var son_hamle={konum_1:"",konum_2:"",Gender_1:"",Gender_2:""};
window.rtdbe_hamle_yazıcı=function(prm_konum_1,prm_konum_2,prm_cins_1,prm_cins_2){ // oyuncu hamlesini tamamladığında hamle bilgilerini database yolluyor 
  var room_no=document.getElementById('room_no_info').innerHTML;

  get(child(ref(getDatabase()), `Rooms/${room_no}`)).then((snapshot) => {
    if (snapshot.exists()) { 
      var datalar=snapshot.val();
      var prm_oyuncu1 = datalar.Player1_Nick;
      var prm_p2_id = datalar.Player2_Nick;
      var prm_oda_no = datalar.Room_No;
      const dbe_gönderilen_veri_listesi={
        Room_No:prm_oda_no, 
        Player1_Nick:prm_oyuncu1,
        Player2_Nick:prm_p2_id,
        Location_1:prm_konum_1,
        Location_2:prm_konum_2,
        Gender_1:prm_cins_1,
        Gender_2:prm_cins_2
      };
      console.log("son hamle:  ");
      console.log(son_hamle);
      console.log("dbe gönderilen veri");
      console.log(dbe_gönderilen_veri_listesi);

        if(son_hamle.Gender_1 && son_hamle.Gender_1.charAt(0)==dbe_gönderilen_veri_listesi.Gender_1.charAt(0)){// arka arkaya hamle yapmayı engelliyor son hamlende kullanılan taşın ilk harfi ikinci hamlede kullanılan taşın ilk harfi ile aynı mı diye bakıyor
          esas_hamle_konumları=[];

          console.log("ARKA ARKAYA HAMLE YAPMAYA ÇALIŞIYORSUNUZ");
        }else{
          if(esas_hamle_konumları.includes(dbe_gönderilen_veri_listesi.Location_2)){//
          
            if((son_hamle.Gender_1==dbe_gönderilen_veri_listesi.Gender_2)&&(son_hamle.Gender_2==dbe_gönderilen_veri_listesi.Gender_1)){// oyunun döngüye girmesini engelliyor
              alert("BU HAMLEYİ YAPAMAZSINIZ DÖNGÜ ENGELLEYİCİ SİSTEM");
            }else{
            
            const updates = {};
            updates['Rooms/' + room_no] = dbe_gönderilen_veri_listesi;
            return update(ref(getDatabase()), updates);
            }
          }
        
      }
    } else {
      console.log("VERİ YOK VERİ");
    }}).catch((error) => { console.error(error);});
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

onChildChanged(ref(getDatabase(), '/'), (data) => {if(data){trigger();}});// eğer rtdbin merkez dizininde bir değişiklik olursa triggerı çalıştırır.

window.trigger=function(){ //trigger çalıştığında ilgili odaya girip verileri alıyor 

  var room_no=document.getElementById('room_no_info').innerHTML;
  
  get(child(ref(getDatabase()), `Rooms/${room_no}`)).then((snapshot) => {
    if (snapshot.exists()) { 
      var rtdbden_yakalanan_veriler=snapshot.val();
      anlık_veri_görselleştirme(rtdbden_yakalanan_veriler);
    }; 
  });
}
window.anlık_veri_görselleştirme=function(prm_rtdbden_yakalan_veriler){// trigger sonrası okunan verilere göre oyun tahtası görüntüsünü düzenliyor görseli düzenliyor
  
  document.getElementById('gamer_name_1').innerHTML=prm_rtdbden_yakalan_veriler.Player1_Nick;//---- oyuncu isimlerini içeren divlerin textlerini değiştirir.
  document.getElementById('gamer_name_2').innerHTML=prm_rtdbden_yakalan_veriler.Player2_Nick;
  
  if(prm_rtdbden_yakalan_veriler.Gender_1 !=''){// bu satırın amacı oyun ekranı ilk defa yüklendiğinde varsayılan olarak boş gelen Gender_1 verisinin konsole hata mesajı verdirmemesini sağlamak.Dolana kadar bloğu çalıştırmıyor.
    
    var konum_1=prm_rtdbden_yakalan_veriler.Location_1;
    var konum_2=prm_rtdbden_yakalan_veriler.Location_2;
    var cins_2=prm_rtdbden_yakalan_veriler.Gender_2;
    var cins_1=prm_rtdbden_yakalan_veriler.Gender_1;

    var birinci_cins=document.getElementById(konum_1).style.backgroundImage;
    var ikinci_cins=document.getElementById(konum_2).style.backgroundImage;
    document.getElementById(konum_1).style.backgroundImage=ikinci_cins;
    document.getElementById(konum_2).style.backgroundImage=birinci_cins;
    document.getElementById(konum_1).title=cins_2; 
    document.getElementById(konum_2).title=cins_1;

    ses_çalar();
    son_hamle=prm_rtdbden_yakalan_veriler;// son_hamle burada dolduruluyor

    if((cins_1=='b_1_şah')&&(konum_2[1]=='8')){
      var mesaj='Oyun Bitti Beyaz Kazandı';
      alert_bildirim(mesaj);
    }
    if((cins_1=='s_1_şah')&&(konum_2[1]=='1')){
      var mesaj='Oyun Bitti Siyah Kazandı';
      alert_bildirim(mesaj);
    }
  }
  return son_hamle;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener('beforeunload', (event) => {event.returnValue = `Are you sure you want to leave?`;});

var sn=0;
var dk=0;
var sayac_nesnesi;

window.sayac=function(){
  sn++;
    if(sn==60){dk++;sn=0;}
    if(sn<=9){
      document.getElementById("counter_1").innerHTML="0"+dk+":"+"0"+sn;
    }else{
      document.getElementById("counter_1").innerHTML="0"+dk+":"+sn;}
}
window.sayac_durum=function(prm_durum){
  if (prm_durum=="aktif"){sayac_nesnesi= setInterval(sayac,1000);}
  if (prm_durum=="pasif"){clearInterval(sayac_nesnesi);}
}
window.alert_bildirim=function(prm_mesaj){
  var Mesaj=prm_mesaj;
  document.getElementById("div_alert").style.display='flex';
  document.getElementById("game_page").style.display='none';
  document.getElementById("message").innerHTML=Mesaj;
}
window.ses_çalar=function(){new Audio('taşlar_sesler/taş_sesi.mp3').play();}

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

<----------first_location_info ne işe yarıyor----------->
1- içerisinde geliştiriken işimi kolaylaşıran console.log içeriyor ve konum_harf adındaki kısa süreli tutulan değişkene seçilmiş tuşun  konum harfini atıyor ve return ile dışarı tanımlıyor.

<----------hamle_konumları_bilgisi ne işe yarıyor ------->
1-hamle renklendirmesinde görev alıyor
2- önce parametre olarak aldığı ham hamle olasılıklarını koordinatlar ile karşılaştırıp eşleşenleri hamle_kkonumları listesine ekliyor.
3-mümkün olmayanlar undefined türüne çevrildiği için bir sonraki tek satırlık bloktan undefinde temizliği yapıyor.
4-mümkün olan hamle konumları üzerinden takım arkadaşı var mı kontrol ediyor varsa eliyor ve son kalan hamle olasılıkklarını esas_hamle_konumları listesine ekliyor.
5-esas_hamle_konumları liste içeriğimi kırmızı renklendiriyor.

<--------- hamle fonksiyonu ne işe yarıyor---------->
1-hamle fonskiyonu temel işlevi yürütüyor(ilk tuş algılaması ,ikinci tuş alıglaması ,algılanan tuşun cinsinin belirlenmesi ,bu belirlenen cinse göre ham hamle konumlarını hesaplama vb.)
2- ikinci tuş bloğunun içerisnde olası hamlelerinin renklendrimesini sfırlanyan bir kod bulağu bulunuyor.
3- ikinci tuş bloğunun içerinde hamle verilerini db yollayan fonksiyon bulunuyor.

<---------- anlık hamle yazma ne işe yarıyor--------->
1-hamle fonksiyonun else bloğu ile triggerlenir
2- paramaetre olrak aldığı verileri databse içerisine yzar ama bunu öncekini önce siler sonra yazar.

<---------- onChildChange ne işe yarar ----------->
1- bu firebase kütüphanesinden kullandığın bir fonksiyon
2-temelde veritabanındaki değişimleri algılıyor.
3- trigger fonksiyonunu çağırıyor.

<--------- trigger ne işe yarıyor----------->
1- trigger triggerlendiğinde room_no bilgisini html içerisine otomatik aktarılan ODAİDBİLGİ divinden çekiyor.
2- çektiği bu veriyle oda numarasına erişebilecek pathı oluşturuyor.
3- bu pathi kullanan onValue fonksiyonu verileri çekiyor.
4- çekilen verileri anlık hamle görselleştirme fonksiyonuyla her iki ekrandan tahataya döküyor.


<----------- oyunun döngüye girmemesi nasıl sağlanıyor------->
1-anlık_veri_görselleştirme fonksiyonu içersinde son_hamle adında bir liste var
2- bu liste dbden okunan son veriyi alıyor.
3-rtdbe_hamle_yazıcı fonksiyonunun içerisinde gerçekleşen db e yazılma işlemi öncesi aynı hamlenin tersi mi yapılmış kontrol ediliyor eğer oyunu döngüye sokacak hamleyse ekrana uyarı veriyor.

<--------oyun ilerleme şekli---------->

1-Bir oda kodu belirler ve odaya katıl butonuna tıklar.
2- P2 oyuncusunu bekler o odaya katılana kadar işlem yapamaz.
3-P2 odaya katıldığında oyun başlar.
4-siyah beyaz kararı verilir.
5-P1 bir taş seçer(hamle fonksiyonu if bloğu triggerlenir prm olarak konum ve taş cinsi bilgisi gönderir.)
6-P1 bir konum seçer(hamle fonksiyonu else bloğu triggerlenir,ilk triggerlenme ile ikinci triggerlenme kısmında toplanan veriler db e gönderilir )
7-P2 ONVALUE db e veri girişiyle triggerlenir.
8-P2 de 5,6,7 numaraları tekrarlar böylece oyun devam ettmiş olur.



 


*/
