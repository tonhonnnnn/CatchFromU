// CatchFromU - Apple-style YouTube Downloader Client Logic & Localization

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const langThBtn = document.getElementById('langThBtn');
  const langEnBtn = document.getElementById('langEnBtn');

  const urlInput = document.getElementById('urlInput');
  const pasteBtn = document.getElementById('pasteBtn');
  const clearBtn = document.getElementById('clearBtn');
  const catchBtn = document.getElementById('catchBtn');
  const alertContainer = document.getElementById('alertContainer');
  const loadingCapsule = document.getElementById('loadingCapsule');
  const videoStudioCard = document.getElementById('videoStudioCard');
  const downloadHud = document.getElementById('downloadHud');
  const historySection = document.getElementById('historySection');
  const historyList = document.getElementById('historyList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');

  // Video Studio Elements
  const videoThumb = document.getElementById('videoThumb');
  const durationBadge = document.getElementById('durationBadge');
  const videoTitle = document.getElementById('videoTitle');
  const channelLink = document.getElementById('channelLink');
  const channelName = document.getElementById('channelName');
  const viewCountBadge = document.getElementById('viewCountBadge');
  const dateBadge = document.getElementById('dateBadge');
  const segmentVideo = document.getElementById('segmentVideo');
  const segmentAudio = document.getElementById('segmentAudio');
  const formatGrid = document.getElementById('formatGrid');
  const btnStartDownload = document.getElementById('btnStartDownload');
  const downloadLabel = document.getElementById('downloadLabel');

  // HUD Elements
  const hudSpinner = document.getElementById('hudSpinner');
  const hudStage = document.getElementById('hudStage');
  const hudPercent = document.getElementById('hudPercent');
  const hudProgressFill = document.getElementById('hudProgressFill');
  const hudSpeed = document.getElementById('hudSpeed');
  const hudEta = document.getElementById('hudEta');
  const btnCancelDownload = document.getElementById('btnCancelDownload');

  // New Features Elements
  const txtTiktokTag = document.getElementById('txtTiktokTag');
  const btnDownloadThumb = document.getElementById('btnDownloadThumb');
  const txtDownloadThumb = document.getElementById('txtDownloadThumb');
  const platformBadge = document.getElementById('platformBadge');
  const trimToggle = document.getElementById('trimToggle');
  const txtTrimToggle = document.getElementById('txtTrimToggle');
  const txtTrimHint = document.getElementById('txtTrimHint');
  const trimInputsRow = document.getElementById('trimInputsRow');
  const txtTrimStartLabel = document.getElementById('txtTrimStartLabel');
  const trimStartInput = document.getElementById('trimStartInput');
  const btnSetStartCurrent = document.getElementById('btnSetStartCurrent');
  const txtTrimEndLabel = document.getElementById('txtTrimEndLabel');
  const trimEndInput = document.getElementById('trimEndInput');
  const btnSetEndMax = document.getElementById('btnSetEndMax');

  // i18n Elements
  const txtEngineStatus = document.getElementById('txtEngineStatus');
  const txtHeroTitle = document.getElementById('txtHeroTitle');
  const txtHeroSubtitle = document.getElementById('txtHeroSubtitle');
  const txtPasteBtn = document.getElementById('txtPasteBtn');
  const txtCatchBtn = document.getElementById('txtCatchBtn');
  const txtLoadingTitle = document.getElementById('txtLoadingTitle');
  const txtLoadingSubtitle = document.getElementById('txtLoadingSubtitle');
  const txtSegmentVideo = document.getElementById('txtSegmentVideo');
  const txtSegmentAudio = document.getElementById('txtSegmentAudio');
  const txtHistoryTitle = document.getElementById('txtHistoryTitle');
  const txtBentoHeading = document.getElementById('txtBentoHeading');
  const txtBentoSubheading = document.getElementById('txtBentoSubheading');
  const txtBento1Title = document.getElementById('txtBento1Title');
  const txtBento1Desc = document.getElementById('txtBento1Desc');
  const txtBento2Title = document.getElementById('txtBento2Title');
  const txtBento2Desc = document.getElementById('txtBento2Desc');
  const txtBento3Title = document.getElementById('txtBento3Title');
  const txtBento3Desc = document.getElementById('txtBento3Desc');
  const txtBento4Title = document.getElementById('txtBento4Title');
  const txtBento4Desc = document.getElementById('txtBento4Desc');
  const txtFooterNav1 = document.getElementById('txtFooterNav1');
  const txtFooterNav2 = document.getElementById('txtFooterNav2');
  const txtFooterNav3 = document.getElementById('txtFooterNav3');
  const txtFooterCopy = document.getElementById('txtFooterCopy');
  const txtFooterDisclaimer = document.getElementById('txtFooterDisclaimer');

  // Translations Dictionary
  const translations = {
    th: {
      pageTitle: "CatchFromU — ดาวน์โหลดวิดีโอ YouTube, TikTok, Reels และเสียง MP3",
      engineStatus: "Engine Active",
      heroBadge: "Apple-Engineered Experience",
      heroTitle: "จับทุกช่วงเวลาที่คุณชื่นชอบ",
      heroSubtitle: "ดาวน์โหลดวิดีโอจาก YouTube, TikTok (ไร้ลายน้ำ), IG Reels, Facebook และ X คมชัดสูงสุดถึง 4K พร้อมแยกไฟล์เสียง MP3 รวดเร็ว ปลอดภัย ไร้โฆษณา",
      searchPlaceholder: "วางลิงก์ YouTube, TikTok, Instagram, Facebook หรือ X...",
      pasteBtn: "วาง",
      catchBtn: "ค้นหาคลิป",
      tiktokTag: "ไร้ลายน้ำ",
      downloadThumbBtn: "ดาวน์โหลดรูปปก HD",
      trimToggle: "ตัดเฉพาะช่วงเวลา (Trim & Cut)",
      trimHint: "ดาวน์โหลดเฉพาะท่อนที่ต้องการ",
      trimStartLabel: "เริ่ม (Start):",
      trimEndLabel: "สิ้นสุด (End):",
      btnSetEndMax: "จบคลิป",
      loadingTitle: "กำลังตรวจสอบและดึงความละเอียดสูงสุด...",
      loadingSubtitle: "เชื่อมต่อกับระบบเครือข่ายความเร็วสูง",
      segmentVideo: "วิดีโอพร้อมเสียง (MP4)",
      segmentAudio: "ไฟล์เสียงอย่างเดียว (MP3 / AAC)",
      downloadVideoPrefix: "ดาวน์โหลดวิดีโอ",
      downloadAudioPrefix: "ดาวน์โหลดไฟล์เสียง",
      btnProcessing: "กำลังเตรียมการดาวน์โหลดและผสานข้อมูล...",
      hudStartingAudio: "กำลังดึงสตรีมเสียงและแปลงเป็น MP3...",
      hudStartingVideo: "กำลังเตรียมการดาวน์โหลดและผสานข้อมูล...",
      hudConnecting: "กำลังเชื่อมต่อ...",
      hudProcessingFfmpeg: "กำลังผสานและแปลงข้อมูลด้วย FFmpeg...",
      hudDoneTitle: "ดาวน์โหลดและแปลงไฟล์เสร็จสมบูรณ์!",
      saveFileBtn: "⬇ บันทึกไฟล์",
      downloadSuccess: "✓ ดาวน์โหลดสำเร็จ!",
      historyTitle: "ประวัติการดาวน์โหลดล่าสุด",
      clearHistory: "ล้างประวัติ",
      historyBtn: "ดาวน์โหลด",
      bentoHeading: "ประสิทธิภาพระดับมาสเตอร์พีซ",
      bentoSubheading: "ออกแบบมาเพื่อให้ทุกการดาวน์โหลดง่ายดาย สง่างาม และได้คุณภาพสูงสุด",
      bento1Title: "คมชัดสูงสุดระดับ 4K 60fps",
      bento1Desc: "ผสานสตรีมภาพความละเอียดสูงกับสตรีมเสียงความคมชัดสูงสุดด้วย FFmpeg Engine อัตโนมัติ ให้ภาพสวยสมจริงไร้รอยต่อ",
      bento2Title: "Studio Master Audio",
      bento2Desc: "แปลงเป็นไฟล์เสียง MP3 บิตเรตสูงถึง 320 kbps หรือต้นฉบับ Apple AAC (.m4a) สำหรับฟังบน iPhone, iPad และ Mac",
      bento3Title: "เทคโนโลยีสปีดเทอร์โบ",
      bento3Desc: "ขับเคลื่อนด้วย yt-dlp รองรับ YouTube, TikTok ไร้ลายน้ำ, IG Reels, FB, X พร้อมติดตามความคืบหน้าแบบ Real-time",
      bento4Title: "ความเป็นส่วนตัว 100%",
      bento4Desc: "ไม่เก็บข้อมูล ไม่ต้องการการลงทะเบียน และระบบทำความสะอาดไฟล์ชั่วคราวจะลบไฟล์ทิ้งอัตโนมัติอย่างปลอดภัย",
      footerNav1: "ดาวน์โหลด",
      footerNav2: "ประวัติ",
      footerNav3: "ช่วยเหลือ",
      footerCopy: "© 2026 CatchFromU. สไตล์การออกแบบที่ได้แรงบันดาลใจจากปรัชญา Apple Design.",
      footerDisclaimer: "เครื่องมือนี้สร้างขึ้นเพื่อการศึกษาและการใช้งานส่วนบุคคลตามข้อกำหนดสิทธิของเนื้อหา",
      alertEmptyUrl: "กรุณากรอกหรือวางลิงก์วิดีโอที่ต้องการ",
      pasteHint: "กรุณากดปุ่ม ⌘ + V (หรือ Ctrl + V) เพื่อวางลิงก์",
      cancelBtnTitle: "ยกเลิกการดาวน์โหลด",
      cancelToast: "ยกเลิกการดาวน์โหลดเรียบร้อยแล้ว"
    },
    en: {
      pageTitle: "CatchFromU — 4K Video & MP3 Downloader (YouTube, TikTok, Reels, X)",
      engineStatus: "Engine Active",
      heroBadge: "Apple-Engineered Experience",
      heroTitle: "Capture Every Moment You Love.",
      heroSubtitle: "Download videos from YouTube, TikTok (No Watermark), IG Reels, Facebook, and X up to 4K Ultra HD, plus studio MP3 audio. Fast, clean, ad-free.",
      searchPlaceholder: "Paste YouTube, TikTok, Instagram, Facebook or X link...",
      pasteBtn: "Paste",
      catchBtn: "Catch Video",
      tiktokTag: "No Watermark",
      downloadThumbBtn: "Download HD Cover",
      trimToggle: "Trim & Cut Section",
      trimHint: "Download only the selected section",
      trimStartLabel: "Start:",
      trimEndLabel: "End:",
      btnSetEndMax: "End",
      loadingTitle: "Inspecting & retrieving highest resolutions...",
      loadingSubtitle: "Connecting to High-Speed Delivery Network",
      segmentVideo: "Video with Audio (MP4)",
      segmentAudio: "Audio Only (MP3 / AAC)",
      downloadVideoPrefix: "Download Video",
      downloadAudioPrefix: "Download Audio",
      btnProcessing: "Preparing download and audio merge...",
      hudStartingAudio: "Extracting audio stream and encoding to MP3...",
      hudStartingVideo: "Preparing download and combining streams...",
      hudConnecting: "Connecting...",
      hudProcessingFfmpeg: "Merging and converting with FFmpeg...",
      hudDoneTitle: "Download & Conversion Completed!",
      saveFileBtn: "⬇ Save File",
      downloadSuccess: "✓ Download Completed!",
      historyTitle: "Recent Downloads",
      clearHistory: "Clear History",
      historyBtn: "Download",
      bentoHeading: "Masterpiece Performance",
      bentoSubheading: "Engineered to make every download effortless, elegant, and of the highest fidelity.",
      bento1Title: "Up to 4K 60fps Ultra HD",
      bento1Desc: "Seamlessly pairs peak-resolution video streams with crystal-clear audio via automated FFmpeg processing for true-to-life playback.",
      bento2Title: "Studio Master Audio",
      bento2Desc: "Extract crisp MP3 audio up to 320 kbps, or preserve native Apple Lossless AAC (.m4a) for iPhone, iPad, Apple Watch, and Mac.",
      bento3Title: "Turbo Speed Multi-Platform",
      bento3Desc: "Powered by modern yt-dlp protocols supporting YouTube, TikTok (no watermark), IG Reels, FB & X with live SSE progress tracking.",
      bento4Title: "100% Private & Clean",
      bento4Desc: "Zero tracking, no registration, and automated cleanup removes temporary files after transmission.",
      footerNav1: "Download",
      footerNav2: "History",
      footerNav3: "Support",
      footerCopy: "© 2026 CatchFromU. Design philosophy inspired by Apple.",
      footerDisclaimer: "This tool is built for personal and educational use in compliance with content rights.",
      alertEmptyUrl: "Please paste or enter a valid video link",
      pasteHint: "Press ⌘ + V (or Ctrl + V) to paste link into the search box",
      cancelBtnTitle: "Cancel download",
      cancelToast: "Download cancelled."
    }
  };

  // State
  let currentLang = 'th';
  let currentVideoData = null;
  let currentMode = 'video'; // 'video' | 'audio'
  let selectedQuality = null;
  let activeEventSource = null;
  let currentJobId = null;

  // 1. Language Localization Engine
  function initLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const path = window.location.pathname;
    const savedLang = localStorage.getItem('catchfromu_lang');

    if (urlParams.get('lang') === 'en' || path.startsWith('/en')) {
      currentLang = 'en';
    } else if (savedLang === 'en' || savedLang === 'th') {
      currentLang = savedLang;
    } else {
      // Auto-detect browser language
      const userLang = navigator.language || navigator.userLanguage || '';
      currentLang = userLang.startsWith('th') ? 'th' : 'en';
    }

    applyLanguage(currentLang);
  }

  function applyLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem('catchfromu_lang', lang);

    const t = translations[lang];

    // Navbar & Toggle
    if (lang === 'en') {
      langEnBtn.classList.add('active');
      langThBtn.classList.remove('active');
    } else {
      langThBtn.classList.add('active');
      langEnBtn.classList.remove('active');
    }

    document.title = t.pageTitle;
    txtEngineStatus.textContent = t.engineStatus;
    txtHeroTitle.textContent = t.heroTitle;
    txtHeroSubtitle.textContent = t.heroSubtitle;

    urlInput.placeholder = t.searchPlaceholder;
    txtPasteBtn.textContent = t.pasteBtn;
    pasteBtn.title = lang === 'en' ? 'Paste from clipboard' : 'วางจากคลิปบอร์ด';
    txtCatchBtn.textContent = t.catchBtn;
    clearBtn.title = lang === 'en' ? 'Clear' : 'ล้าง';

    txtLoadingTitle.textContent = t.loadingTitle;
    txtLoadingSubtitle.textContent = t.loadingSubtitle;

    txtSegmentVideo.textContent = t.segmentVideo;
    txtSegmentAudio.textContent = t.segmentAudio;

    if (txtTiktokTag) txtTiktokTag.textContent = t.tiktokTag;
    if (txtDownloadThumb) txtDownloadThumb.textContent = t.downloadThumbBtn;
    if (txtTrimToggle) txtTrimToggle.textContent = t.trimToggle;
    if (txtTrimHint) txtTrimHint.textContent = t.trimHint;
    if (txtTrimStartLabel) txtTrimStartLabel.textContent = t.trimStartLabel;
    if (txtTrimEndLabel) txtTrimEndLabel.textContent = t.trimEndLabel;
    if (btnSetEndMax) btnSetEndMax.textContent = t.btnSetEndMax;

    txtHistoryTitle.textContent = t.historyTitle;
    clearHistoryBtn.textContent = t.clearHistory;

    txtBentoHeading.textContent = t.bentoHeading;
    txtBentoSubheading.textContent = t.bentoSubheading;
    txtBento1Title.textContent = t.bento1Title;
    txtBento1Desc.textContent = t.bento1Desc;
    txtBento2Title.textContent = t.bento2Title;
    txtBento2Desc.textContent = t.bento2Desc;
    txtBento3Title.textContent = t.bento3Title;
    txtBento3Desc.textContent = t.bento3Desc;
    txtBento4Title.textContent = t.bento4Title;
    txtBento4Desc.textContent = t.bento4Desc;

    txtFooterNav1.textContent = t.footerNav1;
    txtFooterNav2.textContent = t.footerNav2;
    txtFooterNav3.textContent = t.footerNav3;
    txtFooterCopy.textContent = t.footerCopy;
    txtFooterDisclaimer.textContent = t.footerDisclaimer;

    hudSpeed.textContent = lang === 'en' ? 'Speed: -- MB/s' : 'ความเร็ว: -- MB/s';
    hudEta.textContent = lang === 'en' ? 'Time remaining: --:--' : 'เหลือเวลา: --:--';
    hudStage.textContent = lang === 'en' ? 'Preparing download...' : 'กำลังเตรียมการดาวน์โหลด...';
    if (btnCancelDownload) {
      btnCancelDownload.title = t.cancelBtnTitle;
      btnCancelDownload.setAttribute('aria-label', t.cancelBtnTitle);
    }

    // Update video studio card elements
    if (currentVideoData) {
      viewCountBadge.textContent = lang === 'en' ? `${currentVideoData.views} views` : `${currentVideoData.views} วิว`;
      dateBadge.textContent = currentVideoData.uploadDate || (lang === 'en' ? 'YouTube' : 'วันที่');
      renderFormatGrid();
    } else {
      videoTitle.textContent = lang === 'en' ? 'Video Title' : 'ชื่อวิดีโอ';
      channelName.textContent = lang === 'en' ? 'Channel Name' : 'ชื่อช่อง';
      viewCountBadge.textContent = lang === 'en' ? '0 views' : '0 วิว';
      dateBadge.textContent = lang === 'en' ? 'Date' : 'วันที่';
      downloadLabel.textContent = lang === 'en' ? 'Download Video (MP4)' : 'ดาวน์โหลดวิดีโอ (MP4)';
    }

    // Refresh history list labels
    loadHistory();
  }

  langThBtn.addEventListener('click', (e) => {
    e.preventDefault();
    applyLanguage('th');
  });

  langEnBtn.addEventListener('click', (e) => {
    e.preventDefault();
    applyLanguage('en');
  });

  initLanguage();

  // 2. Theme Management (System aware & localStorage)
  function initTheme() {
    const savedTheme = localStorage.getItem('catchfromu_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(activeTheme);
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.innerHTML = `
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path>
        <path d="m19.07 4.93-1.41 1.41"></path>
      `;
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeIcon.innerHTML = `
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
      `;
    }
    localStorage.setItem('catchfromu_theme', theme);
  }

  themeToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  });

  initTheme();

  // 3. Input Handling
  urlInput.addEventListener('input', () => {
    const val = urlInput.value.trim();
    clearBtn.style.display = val ? 'flex' : 'none';

    // Auto-detect supported platforms (YouTube, TikTok, IG Reels, FB, X)
    if (/(youtube\.com\/(watch\?|shorts\/|live\/)|youtu\.be\/|tiktok\.com\/|instagram\.com\/(reel|p)\/|facebook\.com\/|fb\.watch\/|twitter\.com\/|x\.com\/)/i.test(val)) {
      fetchVideoDetails();
    }
  });

  urlInput.addEventListener('paste', () => {
    setTimeout(() => {
      const val = urlInput.value.trim();
      clearBtn.style.display = val ? 'flex' : 'none';
      if (val) {
        fetchVideoDetails();
      }
    }, 50);
  });

  clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    urlInput.value = '';
    clearBtn.style.display = 'none';
    urlInput.focus();
  });

  pasteBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const t = translations[currentLang];
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          urlInput.value = text.trim();
          clearBtn.style.display = 'flex';
          fetchVideoDetails();
          return;
        }
      }
      urlInput.focus();
      showToast(t.pasteHint);
    } catch (err) {
      console.warn('Clipboard read permission:', err);
      urlInput.focus();
      showToast(t.pasteHint);
    }
  });

  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fetchVideoDetails();
    }
  });

  catchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    fetchVideoDetails();
  });

  // 4. Alerts
  function showError(msg) {
    alertContainer.innerHTML = `
      <div class="alert-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>${escapeHtml(msg)}</span>
      </div>
    `;
    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function clearError() {
    alertContainer.innerHTML = '';
  }

  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'alert-box';
    toast.style.borderColor = 'rgba(0, 113, 227, 0.4)';
    toast.style.background = 'var(--accent-light)';
    toast.style.color = 'var(--accent)';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <span>${escapeHtml(msg)}</span>
    `;
    alertContainer.innerHTML = '';
    alertContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 4000);
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m]);
  }

  // 5. Fetch Video Details
  async function fetchVideoDetails() {
    const t = translations[currentLang];
    const rawUrl = urlInput.value.trim();
    if (!rawUrl) {
      showError(t.alertEmptyUrl);
      return;
    }

    clearError();
    loadingCapsule.style.display = 'flex';
    catchBtn.disabled = true;

    try {
      const res = await fetch(`/api/info?url=${encodeURIComponent(rawUrl)}&lang=${encodeURIComponent(currentLang)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch video information');
      }

      currentVideoData = data;
      renderVideoCard(data);
    } catch (err) {
      console.error(err);
      showError(err.message || 'Connection error occurred');
    } finally {
      loadingCapsule.style.display = 'none';
      catchBtn.disabled = false;
    }
  }

  // 6. Render Video Studio Card
  function renderVideoCard(data) {
    const t = translations[currentLang];
    videoThumb.src = data.thumbnail;
    videoThumb.alt = data.title;
    durationBadge.textContent = data.durationFormatted || '0:00';
    videoTitle.textContent = data.title;
    channelName.textContent = data.channel;
    channelLink.href = data.channelUrl || '#';
    viewCountBadge.textContent = currentLang === 'en' ? `${data.views} views` : `${data.views} วิว`;
    dateBadge.textContent = data.uploadDate || 'Online';

    if (platformBadge) {
      const p = (data.platform || 'youtube').toUpperCase();
      platformBadge.textContent = p === 'YOUTUBE' ? 'YouTube' : (p === 'TIKTOK' ? 'TikTok' : (p === 'INSTAGRAM' ? 'Instagram' : p));
    }

    // Reset and initialize trim controls
    if (trimToggle) {
      trimToggle.checked = false;
    }
    if (trimInputsRow) {
      trimInputsRow.style.display = 'none';
    }
    if (trimStartInput) {
      trimStartInput.value = '00:00';
    }
    if (trimEndInput) {
      trimEndInput.value = data.durationFormatted || '00:00';
    }

    // Set default mode and render format choices
    currentMode = 'video';
    updateSegmentButtons();
    renderFormatGrid();

    // Reset download HUD if any
    downloadHud.style.display = 'none';
    resetDownloadButton();

    videoStudioCard.style.display = 'block';
    videoStudioCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Segment Switching
  segmentVideo.addEventListener('click', (e) => {
    e.preventDefault();
    if (btnStartDownload.disabled && downloadHud.style.display !== 'none') return;
    if (currentMode !== 'video') {
      currentMode = 'video';
      updateSegmentButtons();
      downloadHud.style.display = 'none';
      renderFormatGrid();
    }
  });

  segmentAudio.addEventListener('click', (e) => {
    e.preventDefault();
    if (btnStartDownload.disabled && downloadHud.style.display !== 'none') return;
    if (currentMode !== 'audio') {
      currentMode = 'audio';
      updateSegmentButtons();
      downloadHud.style.display = 'none';
      renderFormatGrid();
    }
  });

  function updateSegmentButtons() {
    if (currentMode === 'video') {
      segmentVideo.classList.add('active');
      segmentAudio.classList.remove('active');
    } else {
      segmentAudio.classList.add('active');
      segmentVideo.classList.remove('active');
    }
  }

  // 7. Render Format Grid
  function renderFormatGrid() {
    formatGrid.innerHTML = '';
    const t = translations[currentLang];

    if (currentMode === 'video') {
      const options = (currentVideoData && currentVideoData.videoOptions) || [];
      if (options.length === 0) {
        options.push({ height: 1080, label: '1080p', badge: 'Full HD', fps: 30, estSize: '' });
      }

      // Preserve previously selected height or default to first
      if (!selectedQuality || !options.some(o => o.height === selectedQuality.height)) {
        selectedQuality = options[0];
      }

      options.forEach(opt => {
        const card = document.createElement('div');
        card.className = `format-card ${opt.height === selectedQuality.height ? 'selected' : ''}`;
        card.innerHTML = `
          <div class="format-top">
            <span class="format-label">${opt.label}</span>
            <span class="format-badge">${opt.badge || 'MP4'}</span>
          </div>
          <div class="format-details">
            <span>MP4 ${opt.fps ? `• ${opt.fps}fps` : ''}</span>
            <span>${opt.estSize || ''}</span>
          </div>
        `;

        card.addEventListener('click', () => {
          if (btnStartDownload.disabled && downloadHud.style.display !== 'none') return;
          document.querySelectorAll('.format-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          selectedQuality = opt;
          downloadHud.style.display = 'none';
          resetDownloadButton();
        });

        formatGrid.appendChild(card);
      });
    } else {
      // Audio options
      const options = (currentVideoData && currentVideoData.audioOptions) || [
        { quality: '320', format: 'mp3', label: 'MP3 320 kbps', badge: 'High Quality', ext: 'mp3' },
        { quality: '256', format: 'mp3', label: 'MP3 256 kbps', badge: 'Standard', ext: 'mp3' },
        { quality: '192', format: 'mp3', label: 'MP3 192 kbps', badge: 'Fast', ext: 'mp3' },
        { quality: 'best', format: 'm4a', label: 'Apple M4A (AAC)', badge: 'Lossless AAC', ext: 'm4a' }
      ];
      
      if (!selectedQuality || !options.some(o => o.quality === selectedQuality.quality)) {
        selectedQuality = options[0];
      }

      options.forEach(opt => {
        const card = document.createElement('div');
        card.className = `format-card ${opt.quality === selectedQuality.quality ? 'selected' : ''}`;
        card.innerHTML = `
          <div class="format-top">
            <span class="format-label">${opt.label}</span>
            <span class="format-badge">${opt.badge}</span>
          </div>
          <div class="format-details">
            <span>${opt.ext.toUpperCase()}</span>
            <span>${currentLang === 'en' ? 'Studio Quality' : 'คุณภาพสูง'}</span>
          </div>
        `;

        card.addEventListener('click', () => {
          if (btnStartDownload.disabled && downloadHud.style.display !== 'none') return;
          document.querySelectorAll('.format-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          selectedQuality = opt;
          downloadHud.style.display = 'none';
          resetDownloadButton();
        });

        formatGrid.appendChild(card);
      });
    }

    resetDownloadButton();
  }

  function resetDownloadButton() {
    if (hudSpinner) hudSpinner.style.display = 'none';
    if (btnCancelDownload) btnCancelDownload.style.display = 'none';
    if (!selectedQuality) return;
    const t = translations[currentLang];
    btnStartDownload.disabled = false;
    btnStartDownload.style.background = 'var(--accent)';
    formatGrid.style.pointerEvents = 'auto';
    formatGrid.style.opacity = '1';

    let trimSuffix = '';
    if (trimToggle && trimToggle.checked && trimStartInput && trimEndInput) {
      const s = trimStartInput.value.trim() || '00:00';
      const e = trimEndInput.value.trim();
      if (e) {
        trimSuffix = ` [${s} - ${e}]`;
      }
    }

    if (currentMode === 'video') {
      downloadLabel.textContent = `${t.downloadVideoPrefix} ${selectedQuality.label}${trimSuffix} (MP4)`;
    } else {
      downloadLabel.textContent = `${t.downloadAudioPrefix} ${selectedQuality.label}${trimSuffix}`;
    }
  }

  // Thumbnail Downloader Listener
  if (btnDownloadThumb) {
    btnDownloadThumb.addEventListener('click', (e) => {
      e.preventDefault();
      if (!currentVideoData || !currentVideoData.thumbnail) return;
      const dlUrl = `/api/download/thumbnail?url=${encodeURIComponent(currentVideoData.thumbnail)}&title=${encodeURIComponent(currentVideoData.title || 'Cover')}`;
      window.location.href = dlUrl;
    });
  }

  // Trim Controls Listeners
  if (trimToggle) {
    trimToggle.addEventListener('change', () => {
      if (trimInputsRow) {
        trimInputsRow.style.display = trimToggle.checked ? 'flex' : 'none';
      }
      resetDownloadButton();
    });
  }

  if (btnSetStartCurrent) {
    btnSetStartCurrent.addEventListener('click', (e) => {
      e.preventDefault();
      if (trimStartInput) {
        trimStartInput.value = '00:00';
        resetDownloadButton();
      }
    });
  }

  if (btnSetEndMax) {
    btnSetEndMax.addEventListener('click', (e) => {
      e.preventDefault();
      if (trimEndInput && currentVideoData && currentVideoData.durationFormatted) {
        trimEndInput.value = currentVideoData.durationFormatted;
        resetDownloadButton();
      }
    });
  }

  if (trimStartInput) {
    trimStartInput.addEventListener('input', resetDownloadButton);
  }
  if (trimEndInput) {
    trimEndInput.addEventListener('input', resetDownloadButton);
  }

  // 8. Start Download Engine
  btnStartDownload.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!currentVideoData || !selectedQuality) return;
    const t = translations[currentLang];

    clearError();
    downloadHud.style.display = 'block';
    if (hudSpinner) hudSpinner.style.display = 'inline-block';
    if (btnCancelDownload) btnCancelDownload.style.display = 'inline-flex';
    hudPercent.textContent = '0%';
    hudProgressFill.style.width = '0%';
    hudStage.textContent = currentMode === 'audio' ? t.hudStartingAudio : t.hudStartingVideo;
    hudSpeed.textContent = t.hudConnecting;
    hudEta.textContent = '';
    
    btnStartDownload.disabled = true;
    formatGrid.style.pointerEvents = 'none';
    formatGrid.style.opacity = '0.65';
    downloadLabel.textContent = t.btnProcessing;

    downloadHud.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
      const payload = {
        url: urlInput.value.trim(),
        type: currentMode,
        quality: currentMode === 'video' ? selectedQuality.height : selectedQuality.quality,
        format: currentMode === 'video' ? 'mp4' : selectedQuality.ext,
        title: currentVideoData.title,
        lang: currentLang
      };

      if (trimToggle && trimToggle.checked) {
        const startVal = trimStartInput ? trimStartInput.value.trim() : '';
        const endVal = trimEndInput ? trimEndInput.value.trim() : '';
        if (startVal && endVal && startVal !== endVal) {
          payload.startTime = startVal;
          payload.endTime = endVal;
          hudStage.textContent = currentLang === 'en'
            ? `Trimming section (${startVal} - ${endVal})...`
            : `กำลังตัดเฉพาะช่วง (${startVal} - ${endVal})...`;
        }
      }

      const startRes = await fetch('/api/download/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const startData = await startRes.json();
      if (!startRes.ok) {
        throw new Error(startData.error || 'Failed to start download');
      }

      currentJobId = startData.jobId;
      trackProgress(currentJobId, payload);
    } catch (err) {
      console.error(err);
      showError(err.message || 'Download error occurred');
      downloadHud.style.display = 'none';
      if (btnCancelDownload) btnCancelDownload.style.display = 'none';
      resetDownloadButton();
    }
  });

  // Cancel Download Action
  if (btnCancelDownload) {
    btnCancelDownload.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!currentJobId) return;

      const t = translations[currentLang];
      const jobIdToCancel = currentJobId;

      stopAllTracking();
      downloadHud.style.display = 'none';
      btnCancelDownload.style.display = 'none';
      resetDownloadButton();
      showToast(t.cancelToast);

      try {
        await fetch('/api/download/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId: jobIdToCancel })
        });
      } catch (err) {
        console.warn('Cancel request error:', err);
      }
    });
  }

  // 9. Track Progress via SSE with Polling Fallback
  let fallbackPollTimer = null;

  function stopAllTracking() {
    if (activeEventSource) {
      activeEventSource.close();
      activeEventSource = null;
    }
    if (fallbackPollTimer) {
      clearInterval(fallbackPollTimer);
      fallbackPollTimer = null;
    }
  }

  function handleJobProgress(job, jobInfo) {
    const t = translations[currentLang];

    if (job.status === 'downloading') {
      const pct = Math.min(Math.round(job.percent || 0), 99);
      hudPercent.textContent = `${pct}%`;
      hudProgressFill.style.width = `${pct}%`;

      const isAudioTrack = (jobInfo.type === 'video' && job.streamIndex > 1) || jobInfo.type === 'audio';
      let stageDesc = '';
      if (currentLang === 'en') {
        stageDesc = isAudioTrack ? 'Downloading audio stream...' : 'Downloading video stream...';
      } else {
        stageDesc = isAudioTrack ? 'กำลังดาวน์โหลดสตรีมเสียง...' : 'กำลังดาวน์โหลดสตรีมวิดีโอ...';
      }
      const stageFull = `${stageDesc} ${pct}% ${job.speed ? `(${job.speed})` : ''}`;

      if (hudSpinner) hudSpinner.style.display = 'inline-block';
      hudStage.textContent = stageFull;
      hudSpeed.textContent = job.speed ? (currentLang === 'en' ? `Speed: ${job.speed}` : `ความเร็ว: ${job.speed}`) : '';
      hudEta.textContent = job.eta ? (currentLang === 'en' ? `ETA: ${job.eta}` : `เหลือเวลา: ${job.eta}`) : '';
      downloadLabel.textContent = `${currentLang === 'en' ? 'Downloading' : 'กำลังดาวน์โหลด'} ${pct}% ${job.speed ? `(${job.speed})` : ''}`;
    } else if (job.status === 'processing') {
      hudPercent.textContent = '99%';
      hudProgressFill.style.width = '99%';
      const procDesc = currentLang === 'en'
        ? (jobInfo.type === 'audio' ? 'Encoding high-fidelity audio with FFmpeg...' : 'Merging high-quality streams with FFmpeg...')
        : (jobInfo.type === 'audio' ? 'กำลังแปลงไฟล์เสียงความละเอียดสูงด้วย FFmpeg...' : 'กำลังผสานภาพและเสียงความละเอียดสูงด้วย FFmpeg...');
      if (hudSpinner) hudSpinner.style.display = 'inline-block';
      hudStage.textContent = procDesc;
      hudSpeed.textContent = 'FFmpeg Processing';
      hudEta.textContent = currentLang === 'en' ? 'Almost ready...' : 'ใกล้เสร็จแล้ว...';
      downloadLabel.textContent = currentLang === 'en' ? 'Merging high quality streams...' : 'กำลังบันทึกไฟล์คุณภาพสูงสุด...';
    } else if (job.status === 'completed') {
      stopAllTracking();
      if (hudSpinner) hudSpinner.style.display = 'none';
      if (btnCancelDownload) btnCancelDownload.style.display = 'none';
      hudPercent.textContent = '100%';
      hudProgressFill.style.width = '100%';
      formatGrid.style.pointerEvents = 'auto';
      formatGrid.style.opacity = '1';
      
      const fileUrl = `/api/download/file/${job.id || currentJobId}`;
      const fileDisplayName = `${jobInfo.title}.${jobInfo.format}`;

      hudStage.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; flex-wrap: wrap; gap: 8px;">
          <span style="color: #34C759; font-weight: 600; display: flex; align-items: center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34C759" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            ${escapeHtml(t.hudDoneTitle)}
          </span>
          <a href="${fileUrl}" class="btn-catch-primary" style="padding: 6px 14px; font-size: 13px; text-decoration: none; border-radius: var(--radius-full);" download="${escapeHtml(fileDisplayName)}">
            ${escapeHtml(t.saveFileBtn)} ${escapeHtml(jobInfo.format.toUpperCase())}
          </a>
        </div>
      `;
      hudSpeed.textContent = currentLang === 'en' ? 'Completed' : 'เสร็จสิ้นเรียบร้อย';
      hudEta.textContent = '';

      // Update Download Button to Success state
      btnStartDownload.disabled = false;
      btnStartDownload.style.background = '#34C759';
      downloadLabel.textContent = `${t.downloadSuccess} (${jobInfo.format.toUpperCase()})`;

      // Trigger browser direct download
      triggerBrowserDownload(fileUrl, fileDisplayName);

      // Save to history
      saveToHistory({
        title: jobInfo.title,
        thumbnail: currentVideoData ? currentVideoData.thumbnail : '',
        format: (jobInfo.format || 'MP4').toUpperCase(),
        quality: currentMode === 'video' ? `${jobInfo.quality}p` : `${jobInfo.quality}kbps`,
        date: new Date().toLocaleTimeString(currentLang === 'en' ? 'en-US' : 'th-TH', { hour: '2-digit', minute: '2-digit' }),
        downloadUrl: fileUrl
      });
    } else if (job.status === 'error') {
      stopAllTracking();
      if (hudSpinner) hudSpinner.style.display = 'none';
      resetDownloadButton();
      downloadHud.style.display = 'none';
      showError(job.error || (currentLang === 'en' ? 'An error occurred during download. Please try again.' : 'เกิดข้อผิดพลาดในการดาวน์โหลด กรุณาลองใหม่อีกครั้ง'));
    }
  }

  function startPollingFallback(jobId, jobInfo) {
    if (fallbackPollTimer) return;
    console.log(`[CatchFromU] Switching to status polling for job ${jobId}`);
    fallbackPollTimer = setInterval(async () => {
      try {
        const res = await fetch(`/api/download/status/${jobId}`);
        if (!res.ok) {
          if (res.status === 404) {
            stopAllTracking();
            resetDownloadButton();
            downloadHud.style.display = 'none';
          }
          return;
        }
        const data = await res.json();
        data.id = jobId;
        handleJobProgress(data, jobInfo);
      } catch (pollErr) {
        console.warn('Poll error:', pollErr);
      }
    }, 1200);
  }

  function trackProgress(jobId, jobInfo) {
    stopAllTracking();

    try {
      const evtSource = new EventSource(`/api/download/progress/${jobId}`);
      activeEventSource = evtSource;

      evtSource.onmessage = (event) => {
        try {
          const job = JSON.parse(event.data);
          handleJobProgress(job, jobInfo);
        } catch (e) {
          console.error('Error handling SSE message:', e);
        }
      };

      evtSource.onerror = (err) => {
        console.warn('SSE connection interrupted, starting fallback polling:', err);
        if (evtSource.readyState === EventSource.CLOSED || evtSource.readyState === 2) {
          activeEventSource = null;
          evtSource.close();
          startPollingFallback(jobId, jobInfo);
        }
      };
    } catch (e) {
      console.warn('SSE init failed, using polling fallback directly:', e);
      startPollingFallback(jobId, jobInfo);
    }
  }

  // Trigger browser download via dynamic download anchor
  function triggerBrowserDownload(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    if (filename) a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (a.parentNode) a.parentNode.removeChild(a);
    }, 1000);
  }

  // 10. History Management
  function loadHistory() {
    try {
      const items = JSON.parse(localStorage.getItem('catchfromu_history') || '[]');
      const t = translations[currentLang];
      if (items.length > 0) {
        historySection.style.display = 'block';
        historyList.innerHTML = '';
        items.slice(0, 5).forEach((item) => {
          const div = document.createElement('div');
          div.className = 'history-item';
          div.innerHTML = `
            <div class="history-item-left">
              <img src="${item.thumbnail}" class="history-item-thumb" alt="${escapeHtml(item.title)}">
              <div>
                <div class="history-item-title">${escapeHtml(item.title)}</div>
                <div class="history-item-meta">${item.format} • ${item.quality} • ${item.date}</div>
              </div>
            </div>
            <a href="${item.downloadUrl}" class="btn-secondary-pill history-redownload-btn" style="text-decoration: none;" download>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>${escapeHtml(t.historyBtn)}</span>
            </a>
          `;
          historyList.appendChild(div);
        });
      } else {
        historySection.style.display = 'none';
      }
    } catch (e) {
      console.warn('History load error:', e);
    }
  }

  function saveToHistory(entry) {
    try {
      const items = JSON.parse(localStorage.getItem('catchfromu_history') || '[]');
      items.unshift(entry);
      localStorage.setItem('catchfromu_history', JSON.stringify(items.slice(0, 10)));
      loadHistory();
    } catch (e) {
      // ignore
    }
  }

  clearHistoryBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('catchfromu_history');
    loadHistory();
  });

  loadHistory();
});
