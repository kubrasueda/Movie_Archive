// === Basit veri ===
// Film ve dizilerden oluşan liste (her biri: başlık, tür, açıklama, resim yolu içeriyor)
const movies = [
    { title: "Inception", type: "Aksiyon", description: "Rüya içinde rüya ile zihin hırsızlığı.", image: "img/inception.jpg" },
    { title: "The Godfather", type: "Dram", description: "Mafya dünyasında güç ve aile.", image: "img/godfather.jpg" },
    { title: "The Hangover", type: "Komedi", description: "Vegas’ta unutulmaz bir bekarlığa veda gecesi.", image: "img/hangover.jpg" },
    { title: "Avengers", type: "Aksiyon", description: "Süper kahramanlar dünyayı kurtarıyor.", image: "img/avengers.jpg" },
    { title: "Friends", type: "Komedi", description: "New York’ta arkadaşlık ve kahkahalar.", image: "img/friends.jpg" },
    { title: "Mad Max: Fury Road", type: "Aksiyon", description: "Çölde durmaksızın kovalamaca; hayatta kalma ve özgürlük mücadelesi.", image: "img/mad-max-fury-road.jpg" }, 
    { title: "The Office (US)", type: "Komedi", description: "Sıradan bir ofiste 'belgesel' tarzı absürt günlük hayat.", image: "img/the-office-us.jpg" },  
    { title: "The Shawshank Redemption", type: "Dram", description: "Umut ve dostluğun hapishane duvarlarını aşan gücü.", image: "img/shawshank.jpg" },
    { title: "The Dark Knight", type: "Aksiyon", description: "Batman ile Joker’in zeka ve kaos savaşı; suç psikolojisi ve etik ikilemler.", image: "img/the-dark-knight.jpg" },
    { title: "Brooklyn Nine-Nine", type: "Komedi", description: "Bir karakolda sıcak ekip dinamiği ve zeki espriler.", image: "img/brooklyn-nine-nine.jpg" },    
    { title: "Parasite", type: "Dram", description: "Sınıf çatışmasını gerilimle harmanlayan, sürprizli bir aile hikâyesi.", image: "img/parasite.jpg" },
    { title: "John Wick", type: "Aksiyon", description: "Emekli tetikçinin intikamı; yakın dövüş ve aksiyon koreografisi zirvede.", image: "img/john-wick.jpg" },
    { title: "The Grand Budapest Hotel", type: "Komedi", description: "Stilize bir macera; otel konsiyerjinin başına gelen absürt olaylar.", image: "img/grand-budapest-hotel.jpg" },
    { title: "Chernobyl", type: "Dram", description: "Felaketin bedeli ve gerçeklerin örtülmesinin doğurduğu trajedi.", image: "img/chernobyl.jpg" },
    { title: "Mission: Impossible – Fallout", type: "Aksiyon", description: "Ethan Hunt dünyayı kurtarmak için zamana karşı yarışır; nefes kesen sahneler.", image: "img/mi-fallout.jpg" },
    { title: "Superbad", type: "Komedi", description: "Liseli iki arkadaşın unutulmaz ve komik bir gece planı.", image: "img/superbad.jpg" },
    { title: "Interstellar", type: "Dram", description: "Aile, zaman ve fedakârlık temaları eşliğinde yıldızlar arası yolculuk.", image: "img/interstellar.jpg" }
];

// === Elemanlar ===
// HTML içindeki belirli id ve class'ları JS tarafında kullanabilmek için seçiyoruz
const els = {
  grid: document.getElementById("card-container"), // kartların basılacağı yer
  info: document.getElementById("result-info"),    // sonuç sayısı
  empty: document.getElementById("empty"),         // "Sonuç bulunamadı" yazısı
  search: document.getElementById("search"),       // arama kutusu
  buttons: document.querySelectorAll("#buttons button") // filtre butonları
};

// === Durum (state) ===
// Kullanıcının seçtiği filtreler burada tutuluyor
const state = { query: "", type: "all" };

// === Filtre uygula (arama + tür birlikte) ===
// Hem arama kutusunu hem de tür butonlarını dikkate alır
function applyFilters(){
  const q = state.query.trim().toLowerCase(); // aramayı küçük harfe çevir
  return movies.filter(m => {
    // Arama kelimesi başlık + açıklama + tür içinde geçiyor mu?
    const matchQ = !q || (m.title + " " + m.description + " " + m.type).toLowerCase().includes(q);
    // Tür "all" ise hepsi gösterilir, yoksa eşleşen tür filtrelenir
    const matchT = state.type === "all" || m.type === state.type;
    return matchQ && matchT;
  });
}

// === Kartları bas ===
// Filtrelenen listeyi ekrana HTML olarak yazdırır
function render(list){
  // Kartlar HTML'e basılıyor
  els.grid.innerHTML = list.map(m => `
    <article class="card">
      <img src="${m.image}" alt="${m.title}" 
           onerror="this.onerror=null; this.src='img/fallback.jpg';" /> <!-- resim bulunmazsa yedek -->
      <div class="body">
        <h3>${m.title}</h3>
        <small>${m.type}</small>
        <p>${m.description}</p>
      </div>
    </article>
  `).join("");

  // Sonuç sayacı güncelleniyor
  els.info.textContent = `${list.length} sonuç`;

  // Hiç film bulunmadıysa "empty" yazısı görünsün
  els.empty.style.display = list.length ? "none" : "block";
}

// === İlk yükleme ===
// Sayfa açıldığında tüm filmler gözüksün
render(applyFilters());

// === Arama (küçük gecikme ile çalışır) ===
// Kullanıcı yazarken her harfte arama yapmasın, biraz beklesin
let timer;
els.search.addEventListener("input", (e) => {
  clearTimeout(timer); // önceki zamanlayıcıyı iptal et
  timer = setTimeout(() => { // 150ms bekledikten sonra uygula
    state.query = e.target.value;
    render(applyFilters());
  }, 150);
});

// === Tür butonları ===
// Aksiyon, Komedi, Dram gibi filtre butonları
els.buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Önce tüm butonlardan "active" kaldır
    els.buttons.forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    // Tıklanan butonu aktif yap
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");

    // State güncelleniyor
    state.type = btn.dataset.type;   // "all", "Aksiyon", "Komedi", "Dram"
    render(applyFilters());

    // Kullanıcı deneyimi: sayfanın başına kaydır
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
