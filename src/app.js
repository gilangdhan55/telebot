// app.js
import dotenv from "dotenv";
import express from "express";
import TelegramBot from "node-telegram-bot-api";
import multer from "multer";
import sendTelegramMessage from './helper-tele.js';
import { groups, saveGroups } from "./scan-group.js";

dotenv.config(); 

const token = process.env.BOT_TOKEN;

if(!token) {
    console.error('Token tidak ditemukan');
    process.exit(1);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}${ext}`);
  },
});

const app = express(); 
const port = process.env.PORT || 40200; 
  

const bot = new TelegramBot(token, { polling: { autoStart: true } });


const upload = multer({ storage });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- Event Listener Bot Telegram ---
// auto reply bot.sendMessage(msg.chat.id, pesan);
bot.on('message',async  (msg) => { 
    if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
        groups[msg.chat.id] = msg.chat.title;  
        saveGroups(groups); 
    }
    // console.log('Pesan diterima dari:', msg.from.username || msg.from.first_name);
    // console.log('Chat ID:', msg.chat.id);
    // console.log('Pesan:', msg.text);
    
    if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
        const reponseHallo = await sendTelegramMessage(bot, msg.chat.id, `Hallo ${msg.from.username || msg.from.first_name}`, { parse_mode: 'Markdown' });
   
        if (!reponseHallo.success) {
            console.error('Gagal mengirim pesan:', result.error); 
        } else {
            console.log(`Pesan berhasil dikirim ke Chat ID: ${msg.chat.id} ${msg.from.username || msg.from.first_name}`); 
        }   
        const reponseDetail = await sendTelegramMessage(bot, msg.chat.id, `Maaf, ini adalah layanan notifikasi untuk grup. Silakan kirim pesan ke grup untuk mendapatkan notifikasi.`, { parse_mode: 'Markdown' });
   
        if (!reponseDetail.success) {
            console.error('Gagal mengirim pesan:', result.error); 
        } else {
            console.log(`Pesan berhasil dikirim ke Chat ID: ${msg.chat.id} ${msg.from.username || msg.from.first_name}`); 
        }    
    }
});

// Mendengarkan jika bot ditambahkan ke grup
bot.on('my_chat_member', (msg) => { 
    if (msg.new_chat_member.status === 'member' || msg.new_chat_member.status === 'administrator') {
        groups[msg.chat.id] = msg.chat.title; 
        saveGroups(groups);  
        console.log(`Bot ditambahkan ke grup: ${msg.chat.title} dengan ID: ${msg.chat.id}`);
    }
});

// Mendengarkan jika bot dikeluarkan dari grup
bot.on('left_chat_member', (msg) => { 
    if (msg.left_chat_member.id === bot.options.id) {
        delete groups[msg.chat.id];  
        saveGroups(groups);  
        console.log(`Bot dikeluarkan dari grup: ${msg.chat.title} dengan ID: ${msg.chat.id}`);
    }
});

// Mendengarkan error polling
bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

 
app.post('/send_message', async (req, res) => {
    const { chat_id, message } = req.body;  
    
     if (!chat_id || !message) {
        return res.status(400).json({ error: 'chat_id dan message diperlukan' });
    } 
    
    const result = await sendTelegramMessage(bot, chat_id, message, { parse_mode: 'MarkdownV2' });
   
    if (!result.success) {
        res.status(500).json({ error: 'Gagal mengirim pesan', details: result.error });
    } else {
        console.log(`Pesan berhasil dikirim ke Chat ID: ${chat_id}`);
        res.status(200).json({ status: 'Pesan berhasil dikirim', message: result });
    }  
});

app.post('/group-cs-error', async (req, res) => {
    const {message} = req.body;
    const chatId = "-4818416475";
    
    if(!message) {
        return res.status(400).json({ error: 'message diperlukan' });
    }

    const result = await sendTelegramMessage(bot, chatId, message, { parse_mode: 'MarkdownV2' });
   
    if (!result.success) {
        res.status(500).json({ error: 'Gagal mengirim pesan', details: result.error });
    } else {
        console.log(`Pesan berhasil dikirim ke Chat ID: ${chatId}`);
        res.status(200).json({ status: 'Pesan berhasil dikirim', message: result });
    }  
});

app.post('/group-cs-success', async (req, res) => {
    const {message} = req.body;
    const chatId = "-4607091875";
 
    if(!message) {
        return res.status(400).json({ error: 'message diperlukan' });
    }
    const result = await sendTelegramMessage(bot, chatId, message, { parse_mode: 'MarkdownV2' });
   
    if (!result.success) {
        res.status(500).json({ error: 'Gagal mengirim pesan', details: result.error });
    } else {
        console.log(`Pesan berhasil dikirim ke Chat ID: ${chatId}`);
        res.status(200).json({ status: 'Pesan berhasil dikirim', message: result });
    }  
});
 
app.get('/list_groups', (req, res) => {
    res.status(200).json(groups); 
}); 
 
app.listen(port, '0.0.0.0', () => {
    console.log(`Server Express berjalan di http://localhost:${port}`);
});