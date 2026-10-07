# CatchFromU 

> **The seamless way to capture YouTube video & audio.**
> เว็บแอปพลิเคชันสำหรับดาวน์โหลดวิดีโอและไฟล์เสียงจาก YouTube สไตล์การออกแบบ **Apple Design System** (SF Pro, Frosted Glass, macOS Sonoma / iOS 18 Aesthetic) มินิมอล สง่างาม และทรงพลัง

---

## ✨ ไฮไลท์และฟีเจอร์เด่น (Key Features)

- 🎨 **Apple Design Language**:
  - รองรับทั้ง **Light Mode** (พื้นหลังสีเทาอ่อน `#ECECEE` สไตล์ Apple Grouped Background) และ **Dark Mode** (`#000000` True Black)
  - เอฟเฟกต์ **Frosted Glass (กระจกฝ้า)** ด้วย `backdrop-filter: blur(25px)`
  - ดีไซน์ขอบโค้งมนแบบ **Apple Squircle**
  - Segmented Control สไตล์ macOS / iOS
  - Apple Watch / Safari Style Dynamic Download HUD with smooth GPU-accelerated spinner
- 🌐 **รองรับ 2 ภาษาเต็มรูปแบบ (Bilingual TH / EN)**:
  - สลับภาษาได้ทันทีผ่านปุ่ม `TH | EN` ที่มุมบนขวา หรือเปิดผ่าน Route `/en`
  - รองรับการแปลภาษาทุกจุด: หัวข้อ, เมตาข้อมูลวิดีโอ, สถานะดาวน์โหลด, และประวัติ
- 🎬 **รองรับความละเอียดวิดีโอสูงสุด (Up to 4K Ultra HD)**:
  - ค้นหาความละเอียดจริงครบทุกระดับ: 4K (2160p), 2K (1440p), Full HD 1080p 60fps, 720p, 480p, 360p
  - ระบบ HTTP Chunking ป้องกัน 403 Forbidden และผสานภาพ+เสียงคุณภาพสูงด้วย FFmpeg Engine
- 🎵 **แยกไฟล์เสียงคุณภาพสตูดิโอ (Studio Master Audio)**:
  - รองรับการแปลงเป็น **MP3 320 kbps**, 256 kbps, 192 kbps
  - รองรับการดาวน์โหลดคลิปเสียงยาวพิเศษ (เช่น เพลงผ่อนคลาย / ดนตรีสมาธิความยาว 3+ ชั่วโมง) ได้อย่างราบรื่น
  - รองรับ **Apple M4A (Lossless AAC)** สำหรับฟังบน iPhone, iPad, Apple Watch และ Mac
- ✕ **ปุ่มยกเลิกการดาวน์โหลด (Cancel Download)**:
  - ปุ่มกากบาทมินิมอลบนแถบ HUD สำหรับยกเลิกการดาวน์โหลดทันที ยุติการทำงานของ Process และทำความสะอาดไฟล์ชั่วคราวอัตโนมัติ
- ⚡️ **เรียลไทม์สตรีมมิ่ง (Server-Sent Events & Polling Fallback)**:
  - ติดตามเปอร์เซ็นต์ดาวน์โหลด (Monotonic non-decreasing progress), ความเร็ว (MB/s), และเวลาที่เหลือ (ETA)
  - พร้อมระบบ Polling สำรองอัตโนมัติเมื่อสัญญาณขัดข้อง
  - ดาวน์โหลดเสร็จระบบจะเรียกหน้าต่างบันทึกไฟล์ให้ทันที พร้อมปุ่ม "⬇ บันทึกไฟล์"
- 🕒 **ประวัติการดาวน์โหลด (Recent Downloads)**:
  - บันทึกรายการล่าสุดไว้ในเบราว์เซอร์ (Local Storage) สะดวกต่อการดาวน์โหลดซ้ำ
- 🔒 **ความเป็นส่วนตัว 100%**:
  - ไม่เก็บข้อมูลผู้ใช้ ไร้โฆษณารบกวน และมีระบบ Auto-cleanup ล้างไฟล์ชั่วคราวอัตโนมัติ

---

## 🚀 วิธีเปิดใช้งาน (Getting Started)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

*(เครื่องต้องติดตั้ง Node.js 22 ขึ้นไป, `yt-dlp` รุ่นล่าสุด และ `ffmpeg` เช่น ติดตั้งผ่าน Homebrew: `brew install node yt-dlp ffmpeg`)*

### 2. รันเซิร์ฟเวอร์
```bash
npm start
```
หรือรันแบบ Hot-Reload ในโหมดพัฒนา:
```bash
npm run dev
```

สำหรับใช้บน Mac เมื่อการเชื่อมต่อ Render ถูก YouTube จำกัด ให้รัน `npm run local` แล้วเปิด `http://localhost:3000` คำสั่งนี้รับการเชื่อมต่อเฉพาะเครื่องตัวเอง และดาวน์โหลดผ่านเครือข่ายของ Mac

### 3. เปิดใช้งานบนเบราว์เซอร์
เปิดเบราว์เซอร์แล้วไปที่:
👉 **[http://localhost:3000](http://localhost:3000)** หรือ **[http://localhost:3000/en](http://localhost:3000/en)**

---

## ☁️ การนำขึ้น Cloud (Cloud Deployment)

โปรเจกต์นี้มี `Dockerfile` และ `render.yaml` พร้อมสำหรับการนำขึ้น Cloud ฟรี:

### ทางเลือกที่ 1: Deploy บน Render (แนะนำ - ฟรี & 1-Click)
1. ไปที่ [Render Dashboard](https://dashboard.render.com/) แล้วเลือก **New > Web Service**
2. เชื่อมต่อกับคลังโค้ด GitHub: `tonhonnnnn/CatchFromU`
3. Render จะตรวจพบ `Dockerfile` และติดตั้ง `Node.js`, `yt-dlp` และ `ffmpeg` ให้โดยอัตโนมัติ
4. กด **Deploy Web Service** รอประมาณ 2–3 นาที จะได้ URL `https://your-app.onrender.com` ใช้งานได้ตลอด 24 ชั่วโมง

### ทางเลือกที่ 2: Deploy บน Railway
1. ไปที่ [Railway Dashboard](https://railway.app/new)
2. เลือก **Deploy from GitHub repo** > `tonhonnnnn/CatchFromU`
3. Railway จะตรวจจับ `Dockerfile` และเปิดใช้งานทันที

---

## แก้ปัญหา YouTube ขอให้ยืนยันว่าไม่ใช่บอต

Docker ใช้ Node.js 22 และเปิด `--js-runtimes node` ทั้งตอนอ่านข้อมูลคลิปและดาวน์โหลด เพื่อรองรับ JavaScript challenges ตาม [เอกสาร yt-dlp](https://github.com/yt-dlp/yt-dlp/wiki/EJS) โดยตัว `yt-dlp` ที่ดาวน์โหลดจาก official release มี EJS scripts รวมอยู่แล้ว ทั้งภาพและเสียงใช้ default clients ของ yt-dlp

1. Push โค้ดที่แก้ไปยัง repository ที่ Render เชื่อมอยู่ แล้ว deploy ใหม่ หาก image ถูก cache ให้ใช้ **Clear build cache & deploy** เพื่อดาวน์โหลด yt-dlp รุ่นล่าสุด
2. ลองคลิปเดิม หากยังถูกขอ bot verification ให้ตรวจ Render logs ข้อผิดพลาดจาก `/api/info` การมี runtime ไม่ได้รับประกันว่าจะผ่านการตรวจสอบ IP หรือเซสชัน
3. หากจำเป็นต้องใช้เซสชัน YouTube ให้ export cookies เฉพาะ YouTube เป็น Netscape format ตาม [คำแนะนำทางการ](https://github.com/yt-dlp/yt-dlp/wiki/Extractors#exporting-youtube-cookies) แล้วเพิ่ม Render Secret File ชื่อ `cookies.txt` และ Environment Variable `YTDLP_COOKIES_FILE=/etc/secrets/cookies.txt` จากนั้น deploy ใหม่ แอปจะคัดลอกไปยังไฟล์ชั่วคราวที่มีสิทธิ์ 0600 และใช้กับคำขอ YouTube ทั้งสองขั้นตอน

Cookies เป็นข้อมูลการเข้าสู่ระบบ อย่า commit ลง Git หรือวางใน `public/` และควรใช้บัญชีแยกหากจำเป็น เพราะเว็บจะใช้เซสชันนี้กับคำขอ YouTube ของผู้ใช้ทุกคน เอกสาร yt-dlp เตือนว่าบัญชีอาจถูกจำกัดหรือระงับได้ Cookies อาจหมดอายุหรือใช้ไม่ได้เมื่อเปลี่ยน IP และไม่ได้รับประกันว่าจะแก้ bot verification ได้

ถ้ายังมีปัญหาบน Render แต่รันบนเครื่องตัวเองได้ ให้ใช้แบบ local (`npm start` แล้วเปิด `http://localhost:3000`) หรือเปลี่ยนสภาพแวดล้อมเซิร์ฟเวอร์หลังตรวจ logs หาก logs ระบุว่าไม่มี PO Token ให้ตรวจ [PO Token Guide](https://github.com/yt-dlp/yt-dlp/wiki/PO-Token-Guide) เพิ่มเติม

## 🛠 โครงสร้างโปรเจกต์ (Project Architecture)

```
CatchfromU/
├── Dockerfile           # คอนเทนเนอร์สำหรับ Deploy (รวม Node.js, yt-dlp และ FFmpeg)
├── render.yaml          # Blueprint สำหรับ Deploy บน Render.com
├── server.js            # Express backend (yt-dlp, FFmpeg, SSE, Cancel endpoint)
├── package.json         # NPM dependencies & scripts
├── .gitignore           # Git ignore configuration
├── public/
│   ├── index.html       # Apple Design System semantic HTML layout
│   ├── styles.css       # Design tokens, frosted glass, Apple dark/light palettes
│   ├── app.js           # Client logic, localization, download progress HUD, history
│   └── favicon.svg      # Apple Squircle Logo
└── downloads/           # ไดเรกทอรีชั่วคราวสำหรับจัดเก็บไฟล์ (ล้างอัตโนมัติ)
```

---

© 2026 CatchFromU. Designed with elegance inspired by Apple.
