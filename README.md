# H5 健康证明二维码生成器

填写从业者信息 → 自动生成二维码 → 微信扫一扫即可在 H5 页面查看健康证明（含照片）。

## 技术栈
- 前端：纯静态 `public/index.html` + `public/qrcode.min.js`（二维码在浏览器本地生成）
- 后端：Express（`server.js`），提供 `/upload` 接口
- 照片存储：Cloudinary（上传后返回公网 URL，编入二维码）
- 托管：Vercel（Git 集成，永久免费域名，国内可直连）

## 本地运行
```bash
npm install
export CLOUDINARY_CLOUD_NAME=xxx
export CLOUDINARY_API_KEY=xxx
export CLOUDINARY_API_SECRET=xxx
npm start
# 打开 http://localhost:3000
```

## 部署（Vercel）
1. 推送到 GitHub 仓库 `h5-qrcode-generator`
2. Vercel 导入该仓库
3. 配置环境变量：`CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
4. 点 Deploy

部署后 `https://你的项目.vercel.app` 即为永久访问地址。
