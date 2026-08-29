# Soli · 夏日奇冰 v2

这是独立于 Rirou 的 Soli 项目。

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

## 如果仍看到旧页面
Safari 可能保留旧的 Service Worker。先关闭旧的主屏幕网页，再在 Safari 中重新打开部署地址；必要时清除该站点的网站数据后重新部署。
