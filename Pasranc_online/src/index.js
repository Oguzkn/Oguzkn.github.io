//---------------------------firebase bağlantı kısmı------------------>
import { initializeApp } from 'firebase/app';
import { getDatabase, ref,set,get,child, update ,onChildChanged, onValue} from "firebase/database";        
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
    document.getElementById('oyun_ekranı').style.display='flex';
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
    console.log('KATILINILAN ODA NUMARASI: '+prm_oda_id);

    
     
}

//------------------------- oyun ekranı kısmı foksiyonları ve tanımlamaları---------------------------->
var konum_1=[];var konum_2=[];var cins_1=[];var cins_2=[];var son_hamle={konum_1:"",konum_2:"",cins_1:"",cins_2:""};
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

var konum_yazisi;
window.ilk_konum_bilgi=function(prm_ilk_konum){ // şeçilen tuşun konum bilgisini veriyor ve harf konumunu yolluyor
  
  console.log("İLK SEÇİLEN TUŞUN KONUMU:"+prm_ilk_konum[0]);
  konum_yazisi = prm_ilk_konum[0];
  console.log("İLK SEÇİLEN TUŞUN KONUMUNUN HARF DEĞERİ:"+konum_yazisi[0]);
  console.log("ilk_konum_bilgi fonksiyonu bitti");
  return konum_yazisi;
}
window.hamle_konum_bilgileri=function(prm_olasi_bütün_konum,prm_taş_rengi){ // olası hamle konumlarını tespit eder ve renklendirir
  var hamle_konumları=[];
  var hamle_konumları_esas = [];
  var seçilen_taşın_rengi ;
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

  console.log("HAMLE_KONUMLARI:"+hamle_konumları);

  if (prm_taş_rengi[0][0]=="s"){seçilen_taşın_rengi="siyah";rakip_renk="b";}// hamle taşlarının rengine göre rakip rengi seçiyor // alttaki for döngüsü için 
  if (prm_taş_rengi[0][0]=="b"){seçilen_taşın_rengi="beyaz";rakip_renk="s";}

  for (i=0;i<hamle_konumları.length;i++){ // bu for döngüsü renklendirilecek hamle yollarında başka taş var mı kontrol ediyor
      if ((document.getElementById(hamle_konumları[i]).title == "BOŞ")||(document.getElementById(hamle_konumları[i]).title[0] == rakip_renk)){
          hamle_konumları_esas.push(hamle_konumları[i]);
          
      } 
  }
  
  for (a=0;a<hamle_konumları_esas.length;a++){// bu for döngüsü kabul edilebilecek konumların rengini kırmızıya çeviriyor
      document.getElementById(hamle_konumları_esas[a]).style.backgroundColor="#A52A2A"; 
  }
  
  console.log("hamle_konum_bilgileri fonksiyonu bitti");
}

window.hamle=function(prm_konum,prm_cins){ // hamle yapmanı sağlıyor <--- EN önemli kısım --->
  var harf_indexi;
  var olasi_bütün_konum=[];
  var olasi_harf_konum=[];
  var olasi_sayi_konum=[];
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
    var a;
    
    for (a=0;a<64;a++){document.getElementById(koordinatlar[a]).style.backgroundColor="#bdb76b";} // hamle yollarını gösteren renk değişimini sıfırlıyor 

    anlık_hamle_yazma(konum_1[0],konum_2[0],cins_1[0],cins_2[0]);// hamleyi database e yolluyor

    
  
    konum_1=[];cins_1=[];konum_2=[];cins_2=[];// verileri temizliyor bir sonraki hamleye hazırlık
    console.log("tuş iki algılandı");        
    }
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
      console.log("p_verisi");console.log(p_verisi);
      console.log("son_hamle");console.log(son_hamle);
      if((son_hamle.cins_1==p_verisi.cins_2)&&(son_hamle.cins_2==p_verisi.cins_1)){
        alert("BU HAMLEYİ YAPAMAZSNIZ");

      }else{
      const updates = {};
      updates['Odalar/' + oda_id] = p_verisi;
      return update(ref(getDatabase()), updates);
      }
    } else {
      console.log("VERİ YOK VERİ");
    }}).catch((error) => { console.error(error);});

}
window.tetik=function(){ //tetik çalıştığında ilgili odaya girip verileri alıyor 
  //console.log('tetik bir çalıştı yani');
  if(oda_id==='ODAİDBİLGİ'){
    oda_id=document.getElementById('oda_id_bilgi').innerHTML;
    path='Odalar/'+oda_id+'/';
    //console.log('güncel path:  '+path);

    const commentsRef = ref(getDatabase(), path);
    
    onValue(commentsRef, (data) => {
      if(data){
        //console.log(' tetik value hamle algılandı');
        //console.log(path);
        //console.log(data.val());
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
    //console.log(konum_1+konum_2);
    var ilk_cins=document.getElementById(konum_1).style.backgroundImage;
    var ikinci_cins=document.getElementById(konum_2).style.backgroundImage;
    document.getElementById(konum_1).style.backgroundImage=ikinci_cins;
    document.getElementById(konum_2).style.backgroundImage=ilk_cins;
    document.getElementById(konum_1).title=cins_2; 
    document.getElementById(konum_2).title=cins_1;

    
    son_hamle=çekilen_veri;
    console.log(son_hamle);

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
