document.addEventListener('DOMContentLoaded', function () {
    const waterAmountDisplay = document.getElementById('waterAmountDisplay');
    const imageQueueContainer = document.getElementById('imageQueueContainer');
    const addButton = document.getElementById('addButton');
    const addOptions = document.getElementById('addOptions');
    const warmModeButton = document.getElementById('warmModeButton');
    const resetButton = document.getElementById('resetButton');
    const container = document.getElementById('mainContainer');

    // Popup utama
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('closePopup');

    // Popup edit volume
    const editPopup = document.getElementById('editPopup');
    const editVolumeInput = document.getElementById('editVolumeInput');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    let currentAmount = 0;
    let targetAmount = 2000;
    let isWarmMode = false;
    let waterData = [];

    // Variabel untuk edit
    let currentEditIndex = null;
    let currentEditImgElement = null;

    function updateDisplay() {
        waterAmountDisplay.textContent = `${currentAmount} / ${targetAmount} ml`;
        if ((!isWarmMode && currentAmount >= 2000) || (isWarmMode && currentAmount >= 2500)) {
            popup.style.display = 'flex';
        }
    }

    function saveToLocal() {
        localStorage.setItem('waterData', JSON.stringify(waterData));
        localStorage.setItem('currentAmount', currentAmount);
        localStorage.setItem('isWarmMode', isWarmMode);
    }

    function loadFromLocal() {
        const savedData = JSON.parse(localStorage.getItem('waterData')) || [];
        const savedAmount = parseInt(localStorage.getItem('currentAmount')) || 0;
        const savedWarmMode = localStorage.getItem('isWarmMode') === 'true';

        waterData = savedData;
        currentAmount = savedAmount;
        isWarmMode = savedWarmMode;

        waterData.forEach(item => {
            const wrapper = createImageWithTimestamp(item.img, item.ml, item.time);
            imageQueueContainer.appendChild(wrapper);
        });

        if (isWarmMode) activateWarmMode();
        updateDisplay();
    }

    function activateWarmMode() {
        isWarmMode = true;
        targetAmount = 2500;
        container.style.backgroundColor = '#fff3e0';
        warmModeButton.textContent = 'Normal Mode 💧';
    }

    function deactivateWarmMode() {
        isWarmMode = false;
        targetAmount = 2000;
        container.style.backgroundColor = 'white';
        warmModeButton.textContent = 'Warm Mode 🔥';
    }

    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Fungsi buat item minuman dengan tombol Edit
    function createImageWithTimestamp(imgSrc, ml, time) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('image-wrapper');

        const img = document.createElement('img');
        img.src = imgSrc;
        img.setAttribute('data-ml', ml);

        const timestamp = document.createElement('div');
        timestamp.classList.add('timestamp');
        timestamp.textContent = time || getCurrentTime();

        // Tombol Edit
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit-btn';

        editBtn.addEventListener('click', () => {
            // Cari indeks item di waterData berdasarkan ml, img, dan waktu
            currentEditIndex = waterData.findIndex(
                (item) => item.ml === ml && item.img === imgSrc && item.time === timestamp.textContent
            );
            if (currentEditIndex === -1) {
                alert('Data tidak ditemukan!');
                return;
            }

            currentEditImgElement = img;

            // Tampilkan popup dan isi input dengan nilai lama
            editVolumeInput.value = waterData[currentEditIndex].ml;
            editPopup.style.display = 'flex';
            editVolumeInput.focus();
        });

        wrapper.appendChild(img);
        wrapper.appendChild(timestamp);
        wrapper.appendChild(editBtn);

        return wrapper;
    }

    addButton.addEventListener('click', () => {
        addOptions.classList.toggle('show');
    });

    warmModeButton.addEventListener('click', () => {
        if (isWarmMode) deactivateWarmMode();
        else activateWarmMode();
        updateDisplay();
        saveToLocal();
    });

    resetButton.addEventListener('click', () => {
        waterData = [];
        currentAmount = 0;
        imageQueueContainer.innerHTML = '';
        updateDisplay();
        saveToLocal();
    });

    document.querySelectorAll('.option').forEach((option) => {
        option.addEventListener('click', function () {
            const ml = parseInt(this.getAttribute('data-ml'));
            const imgSrc = this.getAttribute('data-img');
            const time = getCurrentTime();

            currentAmount += ml;
            updateDisplay();

            const wrapper = createImageWithTimestamp(imgSrc, ml, time);
            imageQueueContainer.appendChild(wrapper);

            waterData.push({ ml, img: imgSrc, time });
            saveToLocal();

            addOptions.classList.remove('show');
        });
    });

    imageQueueContainer.addEventListener('click', function (e) {
        if (e.target.tagName === 'IMG') {
            const ml = parseInt(e.target.getAttribute('data-ml'));
            currentAmount -= ml;

            const wrapper = e.target.parentElement;
            imageQueueContainer.removeChild(wrapper);

            const imgFilename = e.target.src.split('/').pop();
            const index = waterData.findIndex(
                (item) => item.ml == ml && item.img.split('/').pop() === imgFilename
            );
            if (index !== -1) waterData.splice(index, 1);

            updateDisplay();
            saveToLocal();
        }
    });

    // Menutup pop-up utama
    closePopup.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // Tombol Simpan Edit Volume
    document.getElementById('saveEditBtn').addEventListener('click', () => {
        const newMl = parseInt(editVolumeInput.value);
        if (isNaN(newMl) || newMl <= 0) {
            alert('Volume tidak valid!');
            return;
        }
        if (currentEditIndex !== null) {
            // Update total air
            currentAmount -= waterData[currentEditIndex].ml;
            waterData[currentEditIndex].ml = newMl;
            currentAmount += newMl;

            // Update atribut data-ml
            currentEditImgElement.setAttribute('data-ml', newMl);

            saveToLocal();
            updateDisplay();
        }
        // Tutup popup
        document.getElementById('editPopup').style.display = 'none';
        currentEditIndex = null;
        currentEditImgElement = null;
    });

    // Tombol Batal
    document.getElementById('cancelEditBtn').addEventListener('click', () => {
        document.getElementById('editPopup').style.display = 'none';
        currentEditIndex = null;
        currentEditImgElement = null;
    });

    // Notifikasi
    if ('Notification' in window) {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                setInterval(() => {
                    new Notification('💧 Jangan lupa minum air!', {
                        body: 'Sudah 1 jam berlalu. Waktunya minum sedikit air!',
                        icon: '/images/glass of water.png',
                    });
                }, 3600000);
            }
        });
    }

    loadFromLocal();
});
