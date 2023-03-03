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


var ilk_taş_cinsi =[]; var ilk_konum = [];// bunlar haereket fonksiyonun dışında çünkü ilk tuş tıklaması ilke ikinci tuş tıklaması arası veri tutuyor

var hamle_kayıtları=[]; // ilk taşın ismi -- ilk taşın konumu => ikinci taşın konumu
var kalıcı_hamle_kayıtları=[]; // hamle_kayıtları listesini üçlü paketler olarak kaydediyor
var sayac=new Number;

function ilk_konum_bilgi(prm_ilk_konum){ // şeçilen tuşun konum bilgisini veriyor ve harf konumunu yolluyor
    console.log("İLK SEÇİLEN TUŞUN KONUMU:"+prm_ilk_konum[0]);
    konum_yazisi = prm_ilk_konum[0];
    console.log("İLK SEÇİLEN TUŞUN KONUMUNUN HARF DEĞERİ:"+konum_yazisi[0]);
    console.log("ilk_konum_bilgi fonksiyonu bitti");
}
function hamle_konum_bilgileri(prm_olasi_bütün_konum,prm_taş_rengi){ // olası hamle konumlarını tespit eder ve renklendirir
    
    var hamle_konumları=[];
    var hamle_konumları_esas = [];
    var seçilen_taşın_rengi ;
    var rakip_renk ;

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

    if (prm_taş_rengi[0][0]=="S"){seçilen_taşın_rengi="siyah";rakip_renk="B";}// hamle taşlarının rengine göre rakip rengi seçiyor // alttaki for döngüsü için 
    if (prm_taş_rengi[0][0]=="B"){seçilen_taşın_rengi="beyaz";rakip_renk="S";}

    for (i=0;i<hamle_konumları.length;i++){ // bu for döngüsü renklendirilecek hamle yollarında başka taş var mı kontrol ediyor
        if ((document.getElementById(hamle_konumları[i]+hamle_konumları[i][1]).value == "BOŞ")||(document.getElementById(hamle_konumları[i]+hamle_konumları[i][1]).value[0] == rakip_renk)){
            hamle_konumları_esas.push(hamle_konumları[i]);
            console.log("'"+hamle_konumları[i]+hamle_konumları[i][1]+"'");
        } 
    }
    

    for (a=0;a<hamle_konumları_esas.length;a++){// bu for döngüsü kabul edilebilecek konumların rengini kırmızıya çeviriyor
        document.getElementById(hamle_konumları_esas[a]+hamle_konumları_esas[a][1]).style.backgroundColor="#A52A2A"; 
    }
    
    console.log("hamle_konum_bilgileri fonksiyonu bitti");
}

function hareket (prm_tas_cinsi ,prm_konum){

    var harf_indexi;
    var olasi_harf_konum=[];
    var olasi_sayi_konum=[];
    var olasi_bütün_konum=[];

    

    if (ilk_taş_cinsi.length == 0){ // eğer bu blok çalışıyorsa daha öncesinde bir tuş seçilmemiştir bunu ilk_taş_cinsi listesinin için boş olduğundan anlıyoruz

        if ((sayac >= 1)&&(kalıcı_hamle_kayıtları[sayac-1][0][0]==prm_tas_cinsi[0])){// AYNI OYUNCUNUN ÜST ÜSTE HAMLE YAPMASINI ENGELLİYOR
            alert("Sıra rakipte"); 
        }
        else{
            ilk_taş_cinsi.push(prm_tas_cinsi); // ilk tuşun taşıdığı taşın cinsini kaydediyor gerekçesi ilk tuşun verileri ve ikinci tuşun verileri ayrılsın ve ilk tuşun verileri kısa süre saklansın
            ilk_konum.push(prm_konum);// ilk tuşun taşıdığı konum bilgisini kaydediyor gerekçesi ilk tuşun verileri ve ikinci tuşun verileri ayrılsın  ve ilk tuşun verileri kısa süre saklansın

            hamle_kayıtları=[];// olurda hamle kayıtları listesi doluysa temiz bir başlagıç için listeyi sıfırlıyor
            hamle_kayıtları.push(prm_tas_cinsi,prm_konum); // liste sıfırsa içerisine ilk taş cinsi ve konumunu ekliyor 

            document.body.style.backgroundColor = "#A52A2A"; // ilk taş seçildiğinde arkaplanı kırmızıya çevirir

        }
        
        



    }  
    else {// eğer bu block çalışıyorsa daha öncesinde bir tuş seçilmiştir bunu ilk_taş_cinsi listesinin içinin dolu olduğundan anlıyoruz

        hamle_kayıtları.push(prm_konum);// şeçilen ikinci tuşun konum bilgisini kaydediyor
        console.log("hamle_kayıtları: " + hamle_kayıtları); // kontrol amaçlı

        kalıcı_hamle_kayıtları.push([hamle_kayıtları[0],hamle_kayıtları[1],hamle_kayıtları[2]]);
        console.log("kalıcı_hamle_kayıtları:"+kalıcı_hamle_kayıtları);

        sayac=kalıcı_hamle_kayıtları.length;// KALICI HAMLE KAYITLARINI KULLANARAK HAMLE SAYACI OLUŞTURYOR DÖNGÜ İÇİN KULLANILIYOR
        console.log("HAMLE sayac:"+sayac);
        

        var yeni_span = document.createElement("span_hamle"); //hamle kaydı için her seferinde yeni span etiketi oluşturuyor
        var yeni_hamle_node = document.createTextNode("["+sayac+"].   "+hamle_kayıtları[0]+" ^ ^ "+hamle_kayıtları[1]+" ||> "+hamle_kayıtları[2]+"\n");// span etiketi içine eklenecek texti hazırlıyor
        yeni_span.appendChild(yeni_hamle_node); //spanın içerisine texti ekliyor
        document.getElementById("HAMLELER_TABLOSU").appendChild(yeni_span);// spanı tablo divine ekliyor

        
        
        document.getElementById(prm_konum).value = ilk_taş_cinsi[0];// ikinci tuşun konumuna ilk tuşun taş cinsini ekliyor &&&&&&&&& OYUNUN TEMEL MANTIĞI BU SATIR &&&&&&&&&
        document.getElementById(ilk_konum).value = prm_tas_cinsi; // ilk tuşun konumuna ikinci tuşun cinsini ekliyor (taşların yerini değiştiriyor yani)

        ilk_taş_cinsi =[];ilk_konum = []; //artık hamle bittiği için sistemdeki geçiçi konum ve taş cinsi kaydını sıfırlıyor

        document.body.style.backgroundColor ="darkgray"; // ikinci taş seçildiğinde arkaplanı maviye çevirir

        for (a=0;a<64;a++){document.getElementById(koordinatlar[a]+koordinatlar[a][1]).style.backgroundColor="azure";} // hamle yollarını gösteren renk değişimini sıfırlıyor

        if(sayac%2==0){document.getElementById("oyun_sırası").innerHTML= "SIRA BEYAZIN";}else{document.getElementById("oyun_sırası").innerHTML= "SIRA SİYAHIN";} // HAMLE SIRASININ KİMDE OLDUĞUNU SÖYLÜYOR

        
        

    }


    // ilk tuş ile tetiklenenler
    if ((ilk_taş_cinsi.length != 0)&&(ilk_taş_cinsi[0][4] == "K")) { // OLASI KALE HAREKETLERİNİ HESAPLIYOR 
        

        ilk_konum_bilgi(ilk_konum);
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

        hamle_konum_bilgileri (olasi_bütün_konum,ilk_taş_cinsi);
        
    }
    if ((ilk_taş_cinsi.length != 0)&&(ilk_taş_cinsi[0][4] == "A")) { // OLASI AT HAREKETLERİNİ HESAPLIYOR

        
        ilk_konum_bilgi(ilk_konum);
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

        hamle_konum_bilgileri (olasi_bütün_konum,ilk_taş_cinsi);
        
        
    }
    if ((ilk_taş_cinsi.length != 0)&&(ilk_taş_cinsi[0][4] == "F")) { // OLASI FİL HAREKETLERİNİ HESAPLIYOR

        ilk_konum_bilgi(ilk_konum);
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

        hamle_konum_bilgileri (olasi_bütün_konum,ilk_taş_cinsi);
        

    }
    if ((ilk_taş_cinsi.length != 0)&&(ilk_taş_cinsi[0][4] == "P")) { // OLASI PİYON HAREKETERİNİ HESAPLIYOR
        
        ilk_konum_bilgi(ilk_konum);
        console.log("PİYON ALGILANDI");

        harf_indexi = harf_koordinatlar.indexOf(konum_yazisi[0]);
        if (ilk_taş_cinsi[0][0]=="B"){// BEYAZ SIYAH AYRIMI (BEYAZ İÇİN)
            olasi_bütün_konum.push(harf_koordinatlar[harf_indexi]+(konum_yazisi[1]-1+2));// bir sonrası 
            olasi_bütün_konum.push(harf_koordinatlar[harf_indexi]+(konum_yazisi[1]-1+3));// iki sonrası
        }
        if (ilk_taş_cinsi[0][0]=="S"){// BEYAZ SİYAH AYRIMI( SİYAH İÇİN)
            olasi_bütün_konum.push(harf_koordinatlar[harf_indexi]+(konum_yazisi[1]-1));// bir sonrası 
            olasi_bütün_konum.push(harf_koordinatlar[harf_indexi]+(konum_yazisi[1]-2));// iki sonrası

        }
        //console.log(olasi_bütün_konum);
        hamle_konum_bilgileri (olasi_bütün_konum,ilk_taş_cinsi);
        
    }
    if ((ilk_taş_cinsi.length != 0)&&(ilk_taş_cinsi[0][4] == "V")) { // OLASI VEZİR HAREKETLERİNİ HESAPLIYOR 

        ilk_konum_bilgi(ilk_konum);
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

        hamle_konum_bilgileri (olasi_bütün_konum,ilk_taş_cinsi);
        
    }
    if ((ilk_taş_cinsi.length != 0)&&(ilk_taş_cinsi[0][4] == "Ş")) { // OLASI ŞAH HAREKETLERİNİ HESAPLIYOR

        ilk_konum_bilgi(ilk_konum);
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

        hamle_konum_bilgileri (olasi_bütün_konum,ilk_taş_cinsi);
        
    }

    

    // ikinci tuş ile tetiklenenler
    if (((hamle_kayıtları[0][0] == "B")&&(hamle_kayıtları[0][4] == "Ş")&&(hamle_kayıtları[2][2] == "8")) ||
    ((hamle_kayıtları[0][0] == "S")&&(hamle_kayıtları[0][4] == "Ş")&&(hamle_kayıtları[2][2] == "1"))) { // ŞAHIN KONUMUNA GÖRE OYUNU SONLANDIRIYOR
        alert("OYUN BİTTİ ");
    }
    if ((sayac >= 2)&&
    (kalıcı_hamle_kayıtları[sayac-1][1]==kalıcı_hamle_kayıtları[sayac-2][2])&&
    (kalıcı_hamle_kayıtları[sayac-1][2]==kalıcı_hamle_kayıtları[sayac-2][1])){// OYUNU DÖNGÜYE SOKMUYOR VE SON İŞLEMİ GERİ ALIYOR


        alert("bu hareket yasak işlemi geri alıyorum");
        //console.log("son hamle"+kalıcı_hamle_kayıtları[sayac-1][1]);
        //console.log("bir önceki hamle"+kalıcı_hamle_kayıtları[sayac-2][2]);

        document.getElementById(ilk_konum).value = ilk_taş_cinsi[0]; // ilk tuşun konumuna ilk tuşun taş cinsini geri  ekliyor 
        document.getElementById(prm_konum).value = prm_tas_cinsi; // ikinci tuşun konumuna ikinci tuşun cinsini geri  ekliyor (taşların yerini değiştiriyor yani)

    }

    console.log("hareket fonksiyonu bitti");  
}  

function yeni_oyun(){
    window.location.reload();   
}

var saniye=0;var dakika=0;
function zamanlayıcı() {
    saniye = saniye+1;
    if (saniye==60){dakika=dakika+1;saniye=0;}
    if (saniye<=9){document.getElementById("oyun_saati").innerHTML = "0"+dakika+":"+"0"+saniye;}else{document.getElementById("oyun_saati").innerHTML = "0"+dakika+":"+saniye;}
}
setInterval(zamanlayıcı, 1000);






 

