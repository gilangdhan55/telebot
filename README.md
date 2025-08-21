# Telebot

Bot Telegram sederhana untuk kebutuhan notifikasi dan otomatisasi.

## 🚀 Fitur
- Kirim notifikasi ke grup Telegram
- Support parsing mode (Markdown / HTML)
- Konfigurasi via file `.env`

## 📂 Struktur Folder

```bash
.
telebot/
├── src/ # kode sumber tambahan
├── server.js # main entry point
├── scan-group.js # script scan group telegram
├── coba.js # script percobaan
├── groups.json # konfigurasi grup
├── package.json # dependencies project
├── .env # konfigurasi environment
└── .gitignore # file gitignore
```

## ⚙️ Instalasi
```bash
git clone <repo-url>
cd telebot
npm install