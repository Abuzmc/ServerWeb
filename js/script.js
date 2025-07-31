// Sidebar toggle
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('close-sidebar');

menuToggle.addEventListener('click', () => {
  sidebar.style.left = '0';
});

closeBtn.addEventListener('click', () => {
  sidebar.style.left = '-100%';
});

// Load halaman
const navLinks = document.querySelectorAll('[data-page]');
const contentDiv = document.getElementById('content');

async function loadPage(page) {
  const res = await fetch(`pages/${page}.html`);
  const html = await res.text();
  contentDiv.innerHTML = html;
  window.scrollTo(0, 0);

  // After loading the page, if it's contact, attach form handler
  if (page === 'contact') {
    attachContactFormHandler();
  }
}

// Event klik navbar & sidebar
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.getAttribute('data-page');
    loadPage(page);
    sidebar.style.left = '-100%'; // close sidebar after click
  });
});

// Load default page
loadPage('home');

// Home
window.addEventListener('pageshow', () => {
  const info = document.querySelector('.home-info');
  if (info) {
    info.classList.remove('restart-anim');
    void info.offsetWidth;
    info.classList.add('restart-anim');
  }
});

// Contact form submission handling
function attachContactFormHandler() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Simple validation (HTML5 required attributes already present)
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill in all fields.';
      status.style.color = 'red';
      return;
    }

    // Simulate form submission
    status.textContent = 'Sending...';
    status.style.color = 'white';

    setTimeout(() => {
      status.textContent = 'Thank you for your message!';
      status.style.color = 'lightgreen';
      form.reset();
    }, 1500);
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".dropdown-toggle");
  const dropdown = document.querySelector(".dropdown");

  toggle.addEventListener("click", function (e) {
    e.preventDefault(); // biar gak redirect
    dropdown.classList.toggle("open");
  });

  // Tutup dropdown kalau klik di luar area
  document.addEventListener("click", function (e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });
});

function copyToClipboard() {
  const text = document.getElementById('copyText').innerText;
  navigator.clipboard.writeText(text)
    .then(() => {
      alert('Teks berhasil disalin!');
    })
    .catch(err => {
      console.error('Gagal menyalin teks: ', err);
    });
}



const servers = [
  { ip: "play.overlcraft.my.id" },
  { ip: "play.overlcraft.my.id" },
  { ip: "play.overlcraft.my.id" }
];

function updateServerStatus() {
  servers.forEach((server, index) => {
    // Gunakan minetools.eu
    fetch(`https://api.minetools.eu/ping/${server.ip}/19132`)
      .then(res => res.json())
      .then(data => {
        const statusEl = document.getElementById(`status-${index}`);
        if (data.players && data.players.online != null) {
          statusEl.innerHTML = `<span style="color:rgb(39, 255, 183); font-weight: bold;">${data.players.online}</span> Online Player`;
          statusEl.classList.add("online");
          statusEl.classList.remove("offline");
        } else {
          statusEl.textContent = "Offline";
          statusEl.classList.add("offline");
          statusEl.classList.remove("online");
        }
      })
      .catch(err => {
        const statusEl = document.getElementById(`status-${index}`);
        statusEl.textContent = "Error";
        statusEl.classList.add("offline");
        statusEl.classList.remove("online");
      });
  });
}

// Kurangi beban API: update tiap 15 detik
setInterval(updateServerStatus, 15000); // 15000ms = 15 detik
updateServerStatus();


async function fetchDiscordStats() {
  const DISCORD_SERVER_ID = '1351324870860083321'; // Ganti dengan ID server Discord-mu
  try {
    const response = await fetch(`https://discord.com/api/v9/guilds/${DISCORD_SERVER_ID}/widget.json`);
    const data = await response.json();
    
    // Mengecek apakah presence_count ada, dan jika ada menambahkan HTML span
    const presenceText = data.presence_count 
      ? `<span style="color:rgb(39, 255, 183); font-weight: bold;">${data.presence_count}</span> Online Users`
      : "N/A";

    // Gunakan innerHTML untuk memasukkan HTML ke dalam elemen
    document.getElementById("discordStats").innerHTML = presenceText;
  } catch (error) {
    document.getElementById("discordStats").innerText = "Error"; // Jika ada error, tampilkan Error
    console.error("Error fetching Discord data:", error);
  }
}

// Panggil fungsi fetch saat halaman dimuat
window.onload = fetchDiscordStats;

// Ambil semua elemen <li> di navbar
const navItems = document.querySelectorAll('.nav-links li');

// Looping untuk menambahkan event listener pada setiap item
navItems.forEach(item => {
  item.addEventListener('click', function() {
    // Hapus class 'active' dari semua item
    navItems.forEach(link => link.classList.remove('active'));
    
    // Tambahkan class 'active' pada item yang diklik
    this.classList.add('active');
  });
});

function copyToClipboard() {
  const textElement = document.getElementById("copyText");
  const text = textElement.innerText;

  navigator.clipboard.writeText(text).then(() => {
    createPopup(text);
  }).catch(err => {
    console.error('Gagal menyalin:', err);
  });
}

function createPopup(copiedText) {
  const container = document.getElementById('popup-container');

  const popup = document.createElement('div');
  popup.className = 'popup show';
  popup.innerHTML = `
    <span class="popup-icon"><i class="bi bi-clipboard-check" style="color: #01ff88;"></i></span>
    <span class="popup-text">${copiedText}</span>
    <span class="popup-info">Copied to clipboard</span>
  `;

  container.prepend(popup);

  // Limit maksimal 5 popup
  const popups = container.querySelectorAll('.popup');
  if (popups.length > 5) {
    popups[popups.length - 1].remove(); // hapus paling bawah
  }

  // Timer untuk hilangin popup
  setTimeout(() => {
    popup.classList.remove('show');
    popup.classList.add('hide'); // Tambahkan class hide untuk animasi keluar

    // Hapus dari DOM setelah animasi selesai (0.4 detik)
    setTimeout(() => {
      popup.remove();
    }, 400);
  }, 2000);
}

window.onload = function() {
  // Menampilkan Coin Section dan menyembunyikan Rank Section saat halaman dimuat
  document.getElementById('coin-section').style.display = 'block';
  document.getElementById('rank-section').style.display = 'none';
};

function buyItem(item) {
  alert('Anda membeli: ' + item);
}

function selectOption(option) {
  if (option === 'Coin') {
      document.getElementById('coin-section').style.display = 'block';
      document.getElementById('rank-section').style.display = 'none';
  } else if (option === 'Rank') {
      document.getElementById('rank-section').style.display = 'block';
      document.getElementById('coin-section').style.display = 'none';
  }
}

function toggleFeatures(rank) {
  var featureList = document.getElementById(rank);
  if (featureList.style.display === "none") {
      featureList.style.display = "block";
  } else {
      featureList.style.display = "none";
  }
}

