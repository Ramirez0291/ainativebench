# AI 原生双轴诊断 · ainativebench

16 种企业 AI 人格自诊断。纯前端、单文件（`index.html`），不调用任何大模型，零服务器成本。
线上地址：https://rami0291.com/ainativebench/

## 结构

| 路径 | 说明 |
|---|---|
| `index.html` | 工具本体：题库、计分、人格判定、海报与预览图绘制全部在这里 |
| `p/<人格>/index.html` | 静态分享页（生成物）：只放社交平台预览用的 meta，打开后跳回工具 |
| `og/<人格>.png`、`og/default.png` | 1200×630 链接预览图（生成物） |
| `tools/dev-server.mjs` | 本地开发服务器，无依赖；只允许写入上面两类生成物 |
| `tools/build-share.js` | 生成分享页与预览图，直接复用 `index.html` 里的数据和绘图代码 |

## 改了人格文案之后

```bash
node tools/dev-server.mjs
```

浏览器打开 http://localhost:4323/#build-share ，看到 `DONE` 后提交 `p/` 和 `og/` 的变更。
