# 腾讯地图多边形编辑器

基于 [腾讯位置服务 JavaScript API GL](https://lbs.qq.com/webApi/javascriptGL/glGuide/glOverview) 的多边形坐标可视化编辑工具。在地图上拖拽调整多边形顶点后，可将结果复制为坐标数组或 GeoJSON。

在线使用：<https://yejunweb.github.io/tmap-polygon-editor/>

## 功能

- 将坐标数组或 GeoJSON 绘制到腾讯地图
- 拖拽顶点、边中点调整多边形，支持捕捉
- 输出为数组或 GeoJSON（Polygon / MultiPolygon）
- 复制时可选压缩 JSON 或格式化文本
- 侧栏可收起，地图会自适应尺寸

## 本地使用

用任意静态服务器打开项目根目录即可，例如：

```bash
npx serve .
```

浏览器访问提示的本地地址。也可直接用编辑器的 Live Server 打开 `index.html`。

地图脚本依赖腾讯位置服务 Key。当前页面使用的是官方示例 Key，仅适合本地试用。若地图无法加载，请到 [腾讯位置服务控制台](https://lbs.qq.com/dev/console/application/mine) 申请 Key，并在 `index.html` 中替换：

```html
<script charset="utf-8"
    src="https://map.qq.com/api/gljs?libraries=tools&v=1.exp&key=你的Key"></script>
```

部署到 GitHub Pages 时，请在控制台把 Key 的授权域名加上 `yejunweb.github.io`。

## 输入格式

在右侧「输入」框粘贴 JSON 后点击「确定」。支持：

- 坐标点数组：`[{ "lat": 22.54, "lng": 114.05 }, ...]` 或 `[lat, lng]` / `[lng, lat]`
- GeoJSON `Polygon` / `MultiPolygon`
- GeoJSON `Feature` / `FeatureCollection`（取第一个可用 geometry）

调整完成后，在「输出结果」中选择类型并复制。

## GitHub Pages

本仓库通过 GitHub Actions 将 `index.html` 发布到 GitHub Pages。推送到 `main` 后会自动部署，页面地址：

<https://yejunweb.github.io/tmap-polygon-editor/>

首次启用时，仓库 Settings → Pages → Source 需选择 **GitHub Actions**。
