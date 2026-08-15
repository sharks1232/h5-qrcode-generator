'use strict';

// H5 健康证明二维码生成器 —— 服务端
// 负责: 提供静态页面 + 接收照片并上传到 Cloudinary, 返回公网 URL
const path = require('path');
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const app = express();

// ---- Cloudinary 配置(来自 Vercel 环境变量) ----
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---- 静态文件(public/) ----
app.use(express.static(path.join(__dirname, 'public')));

// 根路径兜底
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---- 照片上传 ----
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 最大 5MB
});

app.post('/upload', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: '未收到照片文件' });
  }
  // 缺少 Cloudinary 配置时直接报错, 便于排查
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({ ok: false, error: '服务器端未配置 Cloudinary 环境变量' });
  }
  try {
    // 把 buffer 转成 data URI 再上传(Cloudinary Node SDK 稳定支持)
    const dataUri =
      'data:' + (req.file.mimetype || 'image/jpeg') + ';base64,' + req.file.buffer.toString('base64');
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'health-qr',
      transformation: [{ width: 600, crop: 'limit' }],
    });
    return res.json({ ok: true, url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary 上传失败:', err);
    return res.status(500).json({ ok: false, error: err.message || '上传失败' });
  }
});

// ---- 启动 ----
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('H5 健康证明二维码生成器 已启动: http://localhost:' + port);
});

module.exports = app;
