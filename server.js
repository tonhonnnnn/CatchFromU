const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn, spawnSync } = require('child_process');
const crypto = require('crypto');
const os = require('os');

// Copy optional server credentials to a private, writable cookie jar.
// Render secret files may be read-only; yt-dlp saves updated cookies on exit.
let youtubeCookiesFile;
if (process.env.YTDLP_COOKIES_FILE) {
  const cookieDir = fs.mkdtempSync(path.join(os.tmpdir(), 'catchfromu-cookies-'));
  youtubeCookiesFile = path.join(cookieDir, 'cookies.txt');
  fs.writeFileSync(youtubeCookiesFile, fs.readFileSync(process.env.YTDLP_COOKIES_FILE), { mode: 0o600 });
  process.on('exit', () => fs.rmSync(cookieDir, { recursive: true, force: true }));
}

function youtubeArgs(platform) {
  if (platform !== 'youtube') return [];
  const args = ['--js-runtimes', 'node'];
  if (youtubeCookiesFile) args.push('--cookies', youtubeCookiesFile);
  return args;
}

const app = express();
const PORT = process.env.PORT || 3000;

// Setup directories
const DOWNLOADS_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve English direct route
app.get('/en', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// In-memory jobs tracking
const jobs = new Map();
const sseClients = new Map();

function broadcastJob(jobId, data) {
  const job = jobs.get(jobId);
  if (job) {
    Object.assign(job, data);
  }
  const clients = sseClients.get(jobId);
  if (clients && clients.length > 0) {
    const payload = `data: ${JSON.stringify(job || data)}\n\n`;
    clients.forEach(res => {
      try {
        res.write(payload);
      } catch (err) {
        // ignore
      }
    });
  }
}

// Format duration in seconds to mm:ss or hh:mm:ss
function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Format view counts
function formatViews(views) {
  if (!views || isNaN(views)) return '0';
  if (views >= 1000000000) return (views / 1000000000).toFixed(1) + 'B';
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toLocaleString();
}

// Format file size
function formatBytes(bytes) {
  if (!bytes || isNaN(bytes)) return '';
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + ' GB';
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
  return (bytes / 1024).toFixed(1) + ' KB';
}

// Clean filename
function sanitizeFilename(name) {
  return (name || 'CatchFromU_Video')
    .replace(/[/\\?%*:|"<>]/g, '_')
    .replace(/[\x00-\x1f\x80-\x9f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 120);
}

// Detect platform from URL
function detectPlatform(url) {
  const u = (url || '').toLowerCase();
  if (/(?:youtube\.com|youtu\.be)/.test(u)) return 'youtube';
  if (/(?:tiktok\.com)/.test(u)) return 'tiktok';
  if (/(?:instagram\.com)/.test(u)) return 'instagram';
  if (/(?:facebook\.com|fb\.watch)/.test(u)) return 'facebook';
  if (/(?:twitter\.com|x\.com)/.test(u)) return 'twitter';
  if (/(?:soundcloud\.com)/.test(u)) return 'soundcloud';
  if (/(?:pinterest\.com|pin\.it)/.test(u)) return 'pinterest';
  return 'general';
}

// Clean time input (e.g. "01:30", "1:30", "90", "00:01:30") to valid yt-dlp section string
function sanitizeTime(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return '';
  const trimmed = timeStr.trim();
  if (/^(\d{1,2}:)?\d{1,2}:\d{2}$/.test(trimmed) || /^\d+(\.\d+)?$/.test(trimmed)) {
    return trimmed;
  }
  return '';
}

// Parse yt-dlp error output
function parseYtDlpError(stderr, lang = 'th') {
  const text = (stderr || '').toLowerCase();
  if (text.includes('http error 429') || text.includes('too many requests')) {
    return lang === 'en' ? 'YouTube is rate-limiting this server connection (HTTP 429). Use the local app or contact the site administrator to resolve the server connection.' : 'YouTube จำกัดคำขอจากการเชื่อมต่อของเซิร์ฟเวอร์นี้ (HTTP 429) กรุณาใช้แอปบนเครื่อง หรือให้ผู้ดูแลเว็บแก้การเชื่อมต่อเซิร์ฟเวอร์';
  }
  if (text.includes('http error 403')) {
    return lang === 'en' ? 'The provider denied access from this server (HTTP 403). The site administrator must check the server connection and session.' : 'ผู้ให้บริการปฏิเสธการเข้าถึงจากเซิร์ฟเวอร์นี้ (HTTP 403) ผู้ดูแลเว็บต้องตรวจสอบการเชื่อมต่อและเซสชัน';
  }
  if (text.includes('private video')) {
    return lang === 'en' ? 'This video is private and cannot be downloaded.' : 'วิดีโอนี้เป็นแบบส่วนตัว (Private Video) ไม่สามารถดาวน์โหลดได้';
  }
  if (text.includes('video unavailable') || text.includes('not available')) {
    return lang === 'en' ? 'Video is unavailable or has been removed.' : 'ไม่พบวิดีโอนี้ หรือวิดีโอถูกลบออกไปแล้ว';
  }
  if (text.includes('not a bot') || text.includes('bot verification') || text.includes('confirm you’re not a bot')) {
    return lang === 'en' ? 'YouTube requires bot verification for this server. The site administrator must check the server connection and YouTube session; retrying may not resolve this.' : 'YouTube ขอให้เซิร์ฟเวอร์ยืนยันว่าไม่ใช่บอต ผู้ดูแลเว็บต้องตรวจสอบการเชื่อมต่อและเซสชัน YouTube การลองใหม่อาจไม่แก้ปัญหานี้';
  }
  if (text.includes('sign in to confirm') || text.includes('login required')) {
    return lang === 'en' ? 'This video requires a signed-in session on the server. Signing in to YouTube in your browser does not sign in this server.' : 'คลิปนี้ต้องใช้เซสชันที่เข้าสู่ระบบบนเซิร์ฟเวอร์ การล็อกอิน YouTube ในเบราว์เซอร์ไม่ได้ล็อกอินให้เซิร์ฟเวอร์';
  }
  if (text.includes('members-only')) {
    return lang === 'en' ? 'This video is for channel members only.' : 'วิดีโอนี้สำหรับสมาชิกเท่านั้น (Members-only)';
  }
  if (text.includes('live event') || text.includes('live stream')) {
    return lang === 'en' ? 'Live streams cannot be downloaded until finished.' : 'ไม่รองรับการดาวน์โหลดการถ่ายทอดสดที่ยังไม่สิ้นสุด';
  }
  return lang === 'en' ? 'Download error occurred. Please verify link and try again.' : 'เกิดข้อผิดพลาดในการตรวจสอบคลิป กรุณาตรวจสอบลิงก์แล้วลองใหม่อีกครั้ง';
}

// 1. GET /api/info - Fetch video info
app.get('/api/info', async (req, res) => {
  const { url, lang = 'th' } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      error: lang === 'en' ? 'Please provide a video URL.' : 'กรุณากรอก URL วิดีโอ'
    });
  }

  const cleanUrl = url.trim();
  const platform = detectPlatform(cleanUrl);

  // Validate URL format
  const isValidUrl = /^https?:\/\//i.test(cleanUrl);
  if (!isValidUrl) {
    return res.status(400).json({
      error: lang === 'en' ? 'Please enter a valid link (e.g. YouTube, TikTok, Instagram, Facebook, X).' : 'กรุณาใส่ลิงก์ที่ถูกต้อง (เช่น YouTube, TikTok, Instagram, Facebook, X)'
    });
  }

  const args = [
    ...youtubeArgs(platform),
    '--dump-single-json',
    '--no-playlist',
    cleanUrl
  ];

  const child = spawn('yt-dlp', args);
  let stdoutData = '';
  let stderrData = '';

  child.stdout.on('data', chunk => {
    stdoutData += chunk;
  });

  child.stderr.on('data', chunk => {
    stderrData += chunk;
  });

  child.on('close', code => {
    if (code !== 0) {
      console.error('yt-dlp error in /api/info:', stderrData);
      return res.status(500).json({
        error: parseYtDlpError(stderrData, lang)
      });
    }

    try {
      const data = JSON.parse(stdoutData);

      // Check if it's a live stream
      if (data.is_live) {
        return res.status(400).json({
          error: lang === 'en' ? 'Live streams are not supported until broadcast ends.' : 'ไม่รองรับการดาวน์โหลดการถ่ายทอดสด (Live Stream)'
        });
      }

      // Collect available video resolutions
      const formats = data.formats || [];
      const videoOptions = [];

      // Sort formats by pixel count or height descending
      const videoFormats = formats.filter(f => f.vcodec && f.vcodec !== 'none');
      videoFormats.sort((a, b) => ((b.height || 0) * (b.width || 0)) - ((a.height || 0) * (a.width || 0)));

      const isTikTok = platform === 'tiktok';
      const standardHeights = [4320, 2160, 1440, 1080, 720, 480, 360];
      
      for (const h of standardHeights) {
        const found = videoFormats.find(f => f.height === h);
        if (found) {
          const fps = found.fps || 30;
          let label = `${h}p`;
          let badge = '';
          if (h >= 4320) { label = '8K (4320p)'; badge = 'Ultra HD'; }
          else if (h >= 2160) { label = '4K (2160p)'; badge = 'Ultra HD'; }
          else if (h >= 1440) { label = '2K (1440p)'; badge = 'QHD'; }
          else if (h >= 1080) { label = fps >= 50 ? '1080p 60fps' : '1080p'; badge = isTikTok ? 'No Watermark' : 'Full HD'; }
          else if (h >= 720) { label = fps >= 50 ? '720p 60fps' : '720p'; badge = isTikTok ? 'No Watermark' : 'HD'; }
          else if (h >= 480) { label = '480p'; badge = 'SD'; }
          else { label = '360p'; badge = 'Data Saver'; }

          // Estimate approximate size
          let estSize = '';
          if (found.filesize || found.filesize_approx) {
            estSize = formatBytes(found.filesize || found.filesize_approx);
          } else if (data.duration && found.tbr) {
            const bytes = (found.tbr * 1024 * data.duration) / 8;
            estSize = `~${formatBytes(bytes)}`;
          }

          videoOptions.push({
            height: h,
            label,
            badge,
            fps,
            estSize,
            formatId: found.format_id
          });
        }
      }

      // If no standard heights found, fallback to highest available format or original
      if (videoOptions.length === 0) {
        if (videoFormats.length > 0) {
          const bestF = videoFormats[0];
          const h = bestF.height || 1080;
          videoOptions.push({
            height: h,
            label: isTikTok ? 'Original HD (No Watermark)' : (h >= 1080 ? 'Full HD (Original)' : `${h}p (Original)`),
            badge: isTikTok ? 'ไร้ลายน้ำ' : 'Original',
            fps: bestF.fps || 30,
            estSize: (bestF.filesize || bestF.filesize_approx) ? formatBytes(bestF.filesize || bestF.filesize_approx) : ''
          });
        } else {
          videoOptions.push({
            height: 1080,
            label: isTikTok ? 'HD (No Watermark)' : 'Best Quality (MP4)',
            badge: isTikTok ? 'ไร้ลายน้ำ' : 'Best',
            fps: 30,
            estSize: ''
          });
        }
      }

      // Audio options
      const audioOptions = [
        { quality: '320', format: 'mp3', label: 'MP3 320 kbps', badge: 'High Quality', ext: 'mp3' },
        { quality: '256', format: 'mp3', label: 'MP3 256 kbps', badge: 'Standard', ext: 'mp3' },
        { quality: '192', format: 'mp3', label: 'MP3 192 kbps', badge: 'Fast', ext: 'mp3' },
        { quality: 'best', format: 'm4a', label: 'Apple M4A (AAC)', badge: 'Lossless AAC', ext: 'm4a' }
      ];

      // Get high quality thumbnail
      let bestThumb = data.thumbnail;
      if (data.thumbnails && data.thumbnails.length > 0) {
        const sortedThumbs = [...data.thumbnails].sort((a, b) => (b.width || 0) - (a.width || 0));
        bestThumb = sortedThumbs[0].url || data.thumbnail;
      }

      // Determine clean creator name based on platform
      let creatorName = data.uploader || data.channel || data.creator || '';
      if (!creatorName) {
        if (platform === 'tiktok') creatorName = 'TikTok Creator';
        else if (platform === 'instagram') creatorName = 'Instagram Creator';
        else if (platform === 'facebook') creatorName = 'Facebook Video';
        else if (platform === 'twitter') creatorName = 'X Creator';
        else creatorName = 'Video Creator';
      }

      const responsePayload = {
        id: data.id,
        platform,
        title: data.title,
        description: data.description ? data.description.substring(0, 150) + '...' : '',
        thumbnail: bestThumb,
        channel: creatorName,
        channelUrl: data.channel_url || data.uploader_url || '',
        duration: data.duration || 0,
        durationFormatted: formatDuration(data.duration),
        views: formatViews(data.view_count),
        uploadDate: data.upload_date ? `${data.upload_date.slice(0, 4)}-${data.upload_date.slice(4, 6)}-${data.upload_date.slice(6, 8)}` : '',
        videoOptions,
        audioOptions
      };

      res.json(responsePayload);
    } catch (parseErr) {
      console.error('JSON parse error in /api/info:', parseErr);
      res.status(500).json({
        error: lang === 'en' ? 'Failed to process video information. Please try again.' : 'เกิดข้อผิดพลาดในการประมวลผลข้อมูลวิดีโอ'
      });
    }
  });
});

// 2. POST /api/download/start - Start download process
app.post('/api/download/start', (req, res) => {
  const { url, type, quality, format, title, startTime, endTime, lang = 'th' } = req.body;

  if (!url) {
    return res.status(400).json({
      error: lang === 'en' ? 'Video URL is required.' : 'กรุณากรอก URL วิดีโอ'
    });
  }

  const cleanUrl = url.trim();
  const platform = detectPlatform(cleanUrl);

  const cleanStart = sanitizeTime(startTime);
  const cleanEnd = sanitizeTime(endTime);
  const hasTrim = Boolean(cleanStart && cleanEnd && cleanStart !== cleanEnd);

  const jobId = crypto.randomUUID();
  const safeTitle = sanitizeFilename(title || 'CatchFromU');
  const targetExt = type === 'audio' ? (format || 'mp3') : 'mp4';
  const outputFileName = `${jobId}.${targetExt}`;
  const finalFilePath = path.join(DOWNLOADS_DIR, outputFileName);

  const initialStage = hasTrim
    ? (lang === 'en' ? `Trimming section (${cleanStart} - ${cleanEnd})...` : `กำลังตัดเฉพาะช่วง (${cleanStart} - ${cleanEnd})...`)
    : (lang === 'en' ? 'Preparing download...' : 'กำลังเตรียมการดาวน์โหลด...');

  const job = {
    id: jobId,
    url: cleanUrl,
    type,
    quality,
    format: targetExt,
    title: safeTitle,
    hasTrim,
    startTime: cleanStart,
    endTime: cleanEnd,
    outputFileName,
    finalFilePath,
    status: 'starting', // starting, downloading, processing, completed, error
    percent: 0,
    speed: '',
    eta: '',
    stage: initialStage,
    error: null,
    streamIndex: 0,
    createdAt: Date.now()
  };

  jobs.set(jobId, job);

  // Build yt-dlp arguments
  let ytArgs = [
    ...youtubeArgs(platform),
    '--newline',
    '--no-playlist'
  ];

  // If trim requested
  if (hasTrim) {
    ytArgs.push('--download-sections', `*${cleanStart}-${cleanEnd}`);
    ytArgs.push('--force-keyframes-at-cuts');
  }

  if (type === 'audio') {
    ytArgs.push('-f', 'ba/b');
    if (format === 'm4a') {
      ytArgs.push('-x');
      ytArgs.push('--audio-format', 'm4a');
      ytArgs.push('-o', path.join(DOWNLOADS_DIR, `${jobId}.%(ext)s`));
    } else {
      ytArgs.push('-x');
      ytArgs.push('--audio-format', 'mp3');
      if (quality && quality !== 'best') {
        ytArgs.push('--audio-quality', `${quality}k`);
      } else {
        ytArgs.push('--audio-quality', '0');
      }
      ytArgs.push('-o', path.join(DOWNLOADS_DIR, `${jobId}.%(ext)s`));
    }
  } else {
    // Video
    const height = parseInt(quality, 10);
    let formatFilter = 'bestvideo+bestaudio/best';
    if (!isNaN(height) && height > 0) {
      formatFilter = `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`;
    }
    ytArgs.push('-f', formatFilter);
    if (!hasTrim) {
      ytArgs.push('--http-chunk-size', '10M');
    }
    ytArgs.push('--merge-output-format', 'mp4');
    ytArgs.push('-o', path.join(DOWNLOADS_DIR, `${jobId}.%(ext)s`));
  }

  ytArgs.push(cleanUrl);

  console.log(`[Job ${jobId}] Starting: yt-dlp ${ytArgs.join(' ')}`);

  const proc = spawn('yt-dlp', ytArgs);
  job.process = proc;
  let stderrBuffer = '';

  proc.stdout.on('data', data => {
    const text = data.toString();

    // Track stream transitions
    if (text.includes('[download] Destination:')) {
      job.streamIndex = (job.streamIndex || 0) + 1;
    }

    // Parse download progress
    // Example: [download]  45.2% of ~120.45MiB at 4.50MiB/s ETA 00:15
    const dlMatch = text.match(/\[download\]\s+([\d.]+)%\s+of\s+~?([\w.]+)\s+at\s+([\w./]+)\s+ETA\s+([\d:]+)/i) ||
                    text.match(/\[download\]\s+([\d.]+)%/i);

    if (dlMatch) {
      const rawPct = parseFloat(dlMatch[1]);
      const speed = dlMatch[3] || job.speed || '';
      const eta = dlMatch[4] || job.eta || '';

      let computedPct = rawPct;
      if (type === 'video') {
        if (job.streamIndex <= 1) {
          computedPct = Math.round(rawPct * 0.85);
        } else {
          computedPct = Math.min(95, 85 + Math.round(rawPct * 0.10));
        }
      } else {
        computedPct = Math.round(rawPct * 0.92);
      }

      // Progress monotonicity: never let percent jump backwards
      if (computedPct < job.percent) {
        computedPct = job.percent;
      }

      const stageDesc = job.hasTrim
        ? (lang === 'en' ? `Trimming & downloading (${job.startTime} - ${job.endTime})...` : `กำลังตัดช่วงและดาวน์โหลด (${job.startTime} - ${job.endTime})...`)
        : (type === 'video'
            ? (job.streamIndex > 1
                ? (lang === 'en' ? 'Downloading audio stream...' : 'กำลังดาวน์โหลดสตรีมเสียง...')
                : (lang === 'en' ? 'Downloading video stream...' : 'กำลังดาวน์โหลดสตรีมวิดีโอ...'))
            : (lang === 'en' ? 'Downloading audio stream...' : 'กำลังดาวน์โหลดสตรีมเสียง...'));

      broadcastJob(jobId, {
        status: 'downloading',
        percent: computedPct,
        speed,
        eta,
        stage: `${stageDesc} ${computedPct}% ${speed ? `(${speed})` : ''}`
      });
      return;
    }

    if (text.includes('[ExtractAudio]') || text.includes('[ffmpeg]') || text.includes('[Merger]')) {
      broadcastJob(jobId, {
        status: 'processing',
        percent: 98,
        stage: type === 'audio'
          ? (lang === 'en' ? 'Encoding high-fidelity audio with FFmpeg...' : 'กำลังแปลงไฟล์เสียงความละเอียดสูงด้วย FFmpeg...')
          : (lang === 'en' ? 'Merging video & audio with FFmpeg...' : 'กำลังผสานภาพและเสียงความละเอียดสูงด้วย FFmpeg...')
      });
    }
  });

  proc.stderr.on('data', data => {
    const text = data.toString();
    stderrBuffer += text;
    console.error(`[Job ${jobId} stderr]:`, text.trim());
  });

  proc.on('close', code => {
    if (job.cancelled) {
      console.log(`[Job ${jobId}] Cleaned up after user cancellation.`);
      return;
    }

    if (code === 0) {
      // Find actual output file (filter out .part and temporary files)
      const files = fs.readdirSync(DOWNLOADS_DIR);
      const matchedFiles = files.filter(f => f.startsWith(jobId) && !f.endsWith('.part') && !f.endsWith('.ytdl'));
      const matchedFile = matchedFiles.find(f => f.endsWith('.' + targetExt)) || matchedFiles[0];

      if (matchedFile) {
        job.finalFilePath = path.join(DOWNLOADS_DIR, matchedFile);
        job.finalFileName = `${safeTitle}.${path.extname(matchedFile).replace('.', '')}`;
        console.log(`[Job ${jobId}] Completed successfully: ${job.finalFileName}`);
        broadcastJob(jobId, {
          status: 'completed',
          percent: 100,
          stage: lang === 'en' ? 'Download and conversion complete!' : 'ดาวน์โหลดและประมวลผลเสร็จสิ้น!',
          downloadUrl: `/api/download/file/${jobId}`
        });
      } else {
        console.error(`[Job ${jobId}] No matching output file found among:`, files);
        broadcastJob(jobId, {
          status: 'error',
          error: lang === 'en' ? 'Output file was not found after processing.' : 'ไม่พบไฟล์หลังจากการประมวลผล กรุณาลองใหม่อีกครั้ง'
        });
      }
    } else {
      console.error(`[Job ${jobId}] Process exited with code ${code}`);
      const friendlyErr = parseYtDlpError(stderrBuffer, lang || 'th');
      broadcastJob(jobId, {
        status: 'error',
        error: friendlyErr
      });
    }
  });

  proc.on('error', err => {
    if (job.cancelled) return;
    console.error(`[Job ${jobId} process error]:`, err);
    broadcastJob(jobId, {
      status: 'error',
      error: lang === 'en' ? 'System process error occurred.' : 'เกิดข้อผิดพลาดในระบบ'
    });
  });

  res.json({ jobId });
});

// 2.1 POST /api/download/cancel - Cancel active download job
app.post('/api/download/cancel', (req, res) => {
  const { jobId } = req.body;
  if (!jobId) {
    return res.status(400).json({ error: 'Job ID is required' });
  }

  const job = jobs.get(jobId);
  if (!job) {
    return res.json({ success: true, message: 'Job already finished or not found' });
  }

  job.cancelled = true;
  console.log(`[Job ${jobId}] User requested cancellation`);

  // Kill child process cleanly
  if (job.process) {
    try {
      job.process.kill('SIGTERM');
      setTimeout(() => {
        try {
          if (job.process && !job.process.killed) {
            job.process.kill('SIGKILL');
          }
        } catch (e) {
          // ignore
        }
      }, 800);
    } catch (err) {
      console.error(`[Job ${jobId}] Error terminating process:`, err);
    }
  }

  // Remove temporary partial files
  try {
    const files = fs.readdirSync(DOWNLOADS_DIR);
    for (const f of files) {
      if (f.startsWith(jobId)) {
        const fullPath = path.join(DOWNLOADS_DIR, f);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`[Job ${jobId}] Deleted cancelled temp file ${f}`);
        }
      }
    }
  } catch (cleanErr) {
    console.warn(`[Job ${jobId}] Clean error on cancel:`, cleanErr);
  }

  broadcastJob(jobId, {
    status: 'cancelled',
    stage: 'Download cancelled'
  });

  jobs.delete(jobId);

  res.json({ success: true, message: 'Download cancelled successfully' });
});

// 3. GET /api/download/progress/:jobId - SSE endpoint for progress
app.get('/api/download/progress/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  if (!sseClients.has(jobId)) {
    sseClients.set(jobId, []);
  }
  sseClients.get(jobId).push(res);

  // Send current status immediately
  res.write(`data: ${JSON.stringify(job)}\n\n`);

  req.on('close', () => {
    const clients = sseClients.get(jobId);
    if (clients) {
      sseClients.set(jobId, clients.filter(client => client !== res));
    }
  });
});

// 3.1 GET /api/download/status/:jobId - Polling fallback for status
app.get('/api/download/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json({
    status: job.status,
    percent: job.percent,
    speed: job.speed,
    eta: job.eta,
    stage: job.stage,
    error: job.error,
    downloadUrl: job.status === 'completed' ? `/api/download/file/${jobId}` : null
  });
});

// 4. GET /api/download/file/:jobId - Stream completed file to user
app.get('/api/download/file/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);

  if (!job || !job.finalFilePath || !fs.existsSync(job.finalFilePath)) {
    return res.status(404).send('ไฟล์หมดอายุหรือไม่พบ กรุณาดาวน์โหลดใหม่อีกครั้ง / File expired or not found.');
  }

  const finalName = job.finalFileName || `${job.title || 'CatchFromU'}.${job.format}`;
  
  res.download(job.finalFilePath, finalName, (err) => {
    if (err) {
      if (!res.headersSent) {
        console.error(`[Job ${jobId}] Download stream error:`, err);
      }
    }
  });

  // Schedule cleanup 5 minutes after transmission completes or 15 mins max
  res.on('finish', () => {
    setTimeout(() => {
      try {
        if (fs.existsSync(job.finalFilePath)) {
          fs.unlinkSync(job.finalFilePath);
          console.log(`[Cleaned after download] ${job.finalFilePath}`);
        }
        jobs.delete(jobId);
      } catch (e) {
        // ignore
      }
    }, 5 * 60 * 1000);
  });
});

// 5. GET /api/download/thumbnail - Download HD cover image directly
app.get('/api/download/thumbnail', async (req, res) => {
  const { url, title } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).send('Thumbnail URL is required');
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(response.status).send('Failed to fetch thumbnail image');
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const ext = contentType.includes('png') ? 'png' : (contentType.includes('webp') ? 'webp' : 'jpg');
    const safeTitle = sanitizeFilename(title || 'CatchFromU_Thumbnail');
    const filename = `${safeTitle}_Cover.${ext}`;

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`);

    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('Error in /api/download/thumbnail:', err);
    res.status(500).send('Error downloading thumbnail');
  }
});

// Periodic cleaner for stale files in downloads directory (older than 25 minutes)
setInterval(() => {
  try {
    const now = Date.now();
    const files = fs.readdirSync(DOWNLOADS_DIR);
    for (const f of files) {
      const fullPath = path.join(DOWNLOADS_DIR, f);
      const stat = fs.statSync(fullPath);
      if (now - stat.mtimeMs > 25 * 60 * 1000) {
        fs.unlinkSync(fullPath);
        console.log(`[Auto-Clean] Removed stale download ${f}`);
      }
    }
  } catch (err) {
    console.error('Auto-clean error:', err);
  }
}, 5 * 60 * 1000);

app.listen(PORT, process.env.HOST || '0.0.0.0', () => {
  const engineVersion = spawnSync('yt-dlp', ['--version'], { encoding: 'utf8', timeout: 5000 });
  console.log(`Download engine: yt-dlp ${(engineVersion.stdout || '').trim() || 'unavailable'}, Node ${process.version}, YouTube session ${youtubeCookiesFile ? 'configured' : 'anonymous'}`);
  console.log(`CatchFromU running on http://localhost:${PORT}`);
});
