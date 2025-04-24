document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("settings-form");
    const intervalInput = document.getElementById("interval");
    const snoozeBtn = document.getElementById("snooze-btn");
    const testNotificationBtn = document.getElementById("test-notification-btn");
  
    let notificationIntervalId = null;
  
    // Ambil interval tersimpan
    const savedInterval = localStorage.getItem("notificationInterval");
    if (savedInterval) {
      intervalInput.value = savedInterval;
      startNotification(parseInt(savedInterval)); // Auto-start notifikasi saat load
    }
  
    // Fungsi untuk memulai notifikasi
    function startNotification(seconds) {
      // Hapus interval sebelumnya jika ada
      if (notificationIntervalId) {
        clearInterval(notificationIntervalId);
      }
  
      // Cek apakah browser support
      if ("Notification" in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            notificationIntervalId = setInterval(() => {
              new Notification("💧 Jangan lupa minum air!", {
                body: `Sudah ${seconds} detik berlalu. Minum sebentar yuk!`,
                icon: "/images/glass of water.png" // Ganti sesuai path kamu
              });
            }, seconds * 1000);
          }
        });
      }
    }
  
    // Submit form => simpan & mulai notifikasi
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const seconds = parseInt(intervalInput.value);
  
      if (isNaN(seconds) || seconds < 10) {
        alert("Masukkan angka yang valid (min 10 detik)");
        return;
      }
  
      localStorage.setItem("notificationInterval", seconds);
      alert(`Notifikasi disetel setiap ${seconds} detik`);
      startNotification(seconds);
    });
  
    // Tombol snooze => hentikan notifikasi
    snoozeBtn.addEventListener("click", () => {
      if (notificationIntervalId) {
        clearInterval(notificationIntervalId);
        notificationIntervalId = null;
        alert("Notifikasi dimatikan sementara (Snooze Aktif 🔕)");
      }
    });
  
    // Tombol Uji Coba Notifikasi
    testNotificationBtn.addEventListener("click", () => {
      if ("Notification" in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("💧 Uji Notifikasi", {
              body: "Ini adalah uji notifikasi. Jika muncul, maka notifikasi berfungsi!",
              icon: "/images/glass of water.png" // Ganti sesuai path kamu
            });
          } else {
            alert("Izin notifikasi belum diberikan. Harap izinkan terlebih dahulu.");
          }
        });
      } else {
        alert("Notifikasi tidak didukung di browser ini.");
      }
    });
  });
  