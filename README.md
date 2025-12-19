# chatbox-diselexya

Aplikasi **chatbox-diselexya** merupakan chatbot berbasis web yang dirancang untuk membantu penyandang disleksia dalam memahami teks dengan lebih mudah. Aplikasi ini memanfaatkan Artificial Intelligence (AI) untuk menyederhanakan bahasa, menyoroti kata penting, menyediakan text-to-speech (TTS), serta latihan interaktif.

Proyek ini dikembangkan sebagai bagian dari **Ujian Akhir Semester (UAS)** mata kuliah **Eksperimen Pemrograman**.

---

## ✨ Fitur Utama

- Penyederhanaan teks agar mudah dipahami oleh pengguna disleksia
- Highlight kata penting (konsep, tindakan, kata kunci) dengan tooltip
- Mode jawaban **Ringkasan** dan **Lengkap**
- Text-to-Speech (TTS) bahasa Indonesia dengan pengaturan kecepatan
- Latihan interaktif berbasis kata penting dengan umpan balik otomatis
- Antarmuka ramah disleksia (font mudah dibaca dan tampilan sederhana)

---

## 🛠️ Teknologi yang Digunakan

- **Backend**: Python, Flask
- **Frontend**: HTML, CSS, JavaScript
- **AI**: OpenAI API
- **Text-to-Speech**: gTTS (Google Text-to-Speech)

---

## 📁 Struktur Proyek

```
chatbox-diselexya/
├── app.py
├── requirements.txt
├── .env_example
├── .gitignore
├── templates/
│   └── index.html
├── static/
│   ├── style.css
│   └── script.js
├── venv/
└── README.md
```

---

## ⚙️ Cara Menjalankan Aplikasi

Ikuti langkah-langkah berikut untuk menjalankan aplikasi secara lokal:

### 1. Clone Repository

```bash
git clone https://github.com/hendwunga/chatbox-diselexya.git
cd chatbox-diselexya
```

### 2. Buat dan Aktifkan Virtual Environment (Disarankan)

```bash
python -m venv venv
source venv/bin/activate  # Linux / macOS

venv\Scripts\activate     # Windows
```

### 3. Install Dependency

```bash
pip install -r requirements.txt
```

### 4. Konfigurasi Environment Variable

Salin file `.env_example` menjadi `.env`, lalu isi API Key OpenAI:

```
OPENAI_API_KEY=your_openai_api_key
```

### 5. Jalankan Aplikasi

```bash
python app.py
```

Akses aplikasi melalui browser:

```
http://127.0.0.1:5000
```

---

## 🧪 Cara Menggunakan Aplikasi

1. Masukkan teks atau pertanyaan pada kolom input.
2. Tekan tombol **Kirim** untuk mendapatkan jawaban chatbot.
3. Gunakan tombol **Ringkasan** atau **Lengkap** sesuai kebutuhan.
4. Klik kata yang di-highlight untuk melihat tooltip dan memulai latihan.
5. Gunakan fitur **TTS** untuk mendengarkan jawaban dalam bentuk audio.

---

## 🎓 Konteks Akademik

Proyek ini dikembangkan untuk memenuhi **Ujian Akhir Semester (UAS)** mata kuliah **Eksperimen Pemrograman**.

- **Nama Mahasiswa**: Hendrikus Yohanes Wunga
- **Dosen Pengampu**: Beni Utomo, M.Sc
- **Universitas**: Universitas Sanata Dharma

---

## 📌 Catatan

Proyek ini masih dapat dikembangkan lebih lanjut, seperti:

- Personalisasi tingkat kesulitan latihan
- Penyimpanan riwayat pembelajaran pengguna
- Integrasi dengan platform pembelajaran daring

---

## 📜 Lisensi

Proyek ini dibuat untuk keperluan akademik dan pembelajaran.
