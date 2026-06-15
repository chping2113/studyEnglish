# 小小英语乐园 🌈

面向 4 岁小朋友的英语启蒙网页，通过点击分类卡片进入不同场景，学习动物、水果、蔬菜、车辆和人物关系等常用词汇。

## 功能特点

- **五大分类**：动物（55 种）、水果（20 种）、蔬菜（20 种）、车辆（18 种）、人物关系（15 种）
- **场景化学习**：每个分类都有独立的互动场景页面
- **双语发音**：点击词汇可播放英文发音，支持预录音频与浏览器语音合成
- **纯静态页面**：无需后端，可直接在浏览器中打开使用

## 快速开始

直接用浏览器打开 `index.html` 即可，也可以使用本地静态服务器：

```bash
# Python 3
python -m http.server 8080

# 然后访问 http://localhost:8080
```

## 项目结构

```
studyEnglish/
├── index.html          # 首页
├── animals.html        # 动物
├── fruits.html         # 水果
├── vegetables.html     # 蔬菜
├── vehicles.html       # 车辆
├── family.html         # 人物关系
├── css/style.css       # 样式
├── js/                 # 页面逻辑与语音模块
├── audio/en/           # 英文发音音频
├── images/             # 图片资源
└── scripts/gen_audio.py  # 音频生成脚本（edge-tts）
```

## 生成音频

如需重新生成英文发音音频，可运行：

```bash
pip install edge-tts
python scripts/gen_audio.py
```

## 技术栈

- HTML / CSS / JavaScript（原生，无框架）
- [edge-tts](https://github.com/rany2/edge-tts) 生成预录音频
- Web Speech API 作为语音回退方案

## License

MIT
