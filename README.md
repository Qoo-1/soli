# Soli · 夏日奇冰 v2.1

这是独立于 Rirou 的 Soli 项目。

## 本版重点

v2.1 不改变原有视觉设计，主要修复启动与 Safari/PWA 更新问题：
- 启动失败时显示真实诊断状态，而不是笼统要求重新部署
- Service Worker 使用新版本缓存并清理旧缓存
- Service Worker 使用 `skipWaiting()` + `clients.claim()` 尽快接管更新
- 注册 Service Worker 时使用 `updateViaCache: "none"`
- 页面导航采用 network-first，避免部署更新后长期读取旧 HTML
- API / 跨域请求不进入 Soli 静态缓存
- 本机数据存储增加容错，避免旧数据结构导致启动失败

这些更新遵循 Service Worker 的标准更新/激活流程。参考 MDN：
https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

## 部署结构

请把整个 `Soli_Summer_Ice_v2` 文件夹中的内容作为网站根目录部署：
- index.html
- manifest.json
- service-worker.js
- css/
- js/
- icons/

不要只上传 index.html。

## Safari 添加到主屏幕

在 Safari 打开部署地址后，使用“共享”菜单中的“添加到主屏幕”。
项目已经包含 Apple Touch Icon，并设置了 iOS PWA 所需的 meta。

## 如果仍然看到加载错误

v2.1 会显示诊断信息。

如果看到：
- `HTML OK`
- `CSS OK`
- `Store OK`
- `Icons OK`
- `Engine OK`
- `App ERROR`

说明静态文件已经加载，问题在应用初始化。

如果出现 `Store / Icons / Engine ERROR` 或 `TIMEOUT`，请把整个诊断区域截图给我，我可以继续定位。

“清除本机缓存并重试”按钮会尝试注销 Soli 的 Service Worker、删除 Soli 的 Cache Storage，然后重新加载。
