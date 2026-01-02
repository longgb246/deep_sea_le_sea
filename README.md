# 🌊 Deep Sea Relic Hunter (深海遗迹：回响)

<div align="center">

![Deep Sea Theme](https://img.shields.io/badge/Theme-Deep%20Sea-0ea5e9?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.3-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2.0-646cff?style=for-the-badge&logo=vite)

一款神秘的深海主题三消瓦片消除游戏。在这个充满挑战的益智冒险中，从海底回收古老的遗迹。【该项目仅用于学习和娱乐】

[English](#english) | [中文](#中文)

</div>

---

## 📖 中文

### ✨ 游戏特色

- 🎮 **经典三消玩法**：点击可点击的瓦片，将其移动到底部槽位，三个相同的瓦片会自动消除
- 🌊 **深海主题**：14 种不同的深海遗迹，包括古董陶罐、发光珍珠、黄金罗盘等
- 🤖 **AI 助手**：集成 Google Gemini AI，提供幽默的游戏解说和提示
- 🎯 **双难度模式**：
  - **第一关（教学关）**：约 15 片瓦片，简单的 3 层堆叠
  - **第二关（地狱关）**：约 180 片瓦片，复杂的"羊了个羊"式布局
- 🎨 **精美 UI**：使用 Tailwind CSS 和 Lucide React 图标，现代化的深海风格界面
- ⚡ **流畅动画**：线性过渡动画，避免跳跃感，提供流畅的游戏体验

### 🎯 游戏规则

1. **目标**：消除所有瓦片
2. **操作**：点击可点击的瓦片（未被上层瓦片压住的瓦片）
3. **消除**：底部槽位最多容纳 7 个瓦片，三个相同的瓦片会自动消除
4. **失败**：槽位被填满且无法消除时游戏失败
5. **特殊布局**：
   - 左右两侧的长条堆：只有最上层的瓦片可点击
   - 中央塔：严格的层级判定，上层瓦片会压住下层瓦片

### 🚀 快速开始

#### 前置要求

- Node.js 16+
- npm 或 yarn

#### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/deep-sea-relic-hunter.git

# 进入项目目录
cd deep-sea-relic-hunter

# 安装依赖
npm install
```

#### 配置

创建 `.env` 文件并添加你的 Gemini API Key（可选，用于 AI 解说功能）：

```env
GEMINI_API_KEY=your_api_key_here
```

#### 运行

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

访问 `http://localhost:3000` 开始游戏！

### 🛠️ 技术栈

- **前端框架**：React 19.2.3
- **开发语言**：TypeScript 5.8.2
- **构建工具**：Vite 6.2.0
- **样式方案**：Tailwind CSS
- **图标库**：Lucide React
- **AI 集成**：Google Gemini AI (@google/genai)

### 📁 项目结构

```
deep-sea-relic-hunter/
├── components/          # React 组件
│   ├── Dock.tsx        # 底部槽位组件
│   ├── GameBoard.tsx   # 游戏棋盘组件
│   ├── GameHeader.tsx  # 游戏头部组件
│   ├── GameOverModal.tsx # 游戏结束弹窗
│   └── Tile.tsx        # 瓦片组件
├── services/           # 服务层
│   └── geminiService.ts # Gemini AI 服务
├── App.tsx             # 主应用组件
├── constants.tsx       # 游戏常量配置
├── types.ts            # TypeScript 类型定义
├── index.tsx           # 应用入口
├── index.html          # HTML 模板
├── vite.config.ts      # Vite 配置
└── package.json        # 项目依赖
```

### 🎮 游戏机制详解

#### 层级判定系统

游戏使用严格的空间重叠检测：
- 瓦片尺寸：宽 50px，高 60px
- 判定规则：如果上方图层有任何瓦片与当前瓦片在空间上存在重叠（dx < 50 且 dy < 60），则当前瓦片被判定为"被压住"，不可点击

#### 特殊布局

- **中央塔**：10 层高的复杂堆叠，每层 4-5 个瓦片
- **随机散落点**：10 个散落集群，每个集群 3 层
- **左右侧边槽**：各 15 个瓦片的长条堆，只有最上层可点击

### 🤖 AI 助手功能

游戏集成了 Google Gemini AI，提供：
- 游戏开始时的冷酷提醒
- 失败时的幽默嘲讽
- 卡住时的神秘提示

AI 助手"深蓝"使用潜水术语和数据分析的语气，为游戏增添趣味性。

### 🎨 视觉设计

- **深海渐变背景**：从深蓝到黑色的径向渐变
- **扫描线动画**：模拟声呐扫描效果
- **匹配闪光动画**：瓦片消除时的视觉反馈
- **流畅过渡**：使用线性过渡避免跳跃感

### 📝 开发说明

#### 添加新瓦片类型

在 `constants.tsx` 中添加新的瓦片定义：

```typescript
{ 
  id: 'new-item', 
  icon: '🎯', 
  name: '新遗迹', 
  color: 'bg-purple-50' 
}
```

#### 调整难度

修改 `App.tsx` 中的 `initGame` 函数：
- `totalTripletsCount`：控制瓦片总数
- 布局逻辑：调整中央塔、散落点、侧边槽的数量

### 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 📄 许可证

本项目采用 MIT 许可证。

### 🙏 致谢

- 游戏灵感来源于"羊了个羊"
- 使用 Google Gemini AI 提供智能解说
- 图标由 Lucide React 提供

---

## 📖 English

### ✨ Features

- 🎮 **Classic Match-3 Gameplay**: Click clickable tiles to move them to the bottom dock, three identical tiles will be automatically eliminated
- 🌊 **Deep Sea Theme**: 14 different deep-sea relics including ancient amphoras, glowing pearls, golden compasses, etc.
- 🤖 **AI Assistant**: Integrated with Google Gemini AI for humorous game commentary and hints
- 🎯 **Dual Difficulty Modes**:
  - **Level 1 (Tutorial)**: ~15 tiles, simple 3-layer stack
  - **Level 2 (Hell Mode)**: ~180 tiles, complex "Sheep a Sheep" style layout
- 🎨 **Beautiful UI**: Modern deep-sea style interface using Tailwind CSS and Lucide React icons
- ⚡ **Smooth Animations**: Linear transition animations for a fluid gaming experience

### 🎯 Game Rules

1. **Objective**: Eliminate all tiles
2. **Controls**: Click on clickable tiles (tiles not covered by upper layer tiles)
3. **Elimination**: Bottom dock holds up to 7 tiles, three identical tiles will be automatically eliminated
4. **Failure**: Game fails when the dock is full and no elimination is possible
5. **Special Layouts**:
   - Left/Right side piles: Only the topmost tile is clickable
   - Central tower: Strict layer detection, upper tiles block lower tiles

### 🚀 Quick Start

#### Prerequisites

- Node.js 16+
- npm or yarn

#### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/deep-sea-relic-hunter.git

# Navigate to project directory
cd deep-sea-relic-hunter

# Install dependencies
npm install
```

#### Configuration

Create a `.env` file and add your Gemini API Key (optional, for AI commentary):

```env
GEMINI_API_KEY=your_api_key_here
```

#### Run

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit `http://localhost:3000` to start playing!

### 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.3
- **Language**: TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Google Gemini AI (@google/genai)

### 📁 Project Structure

```
deep-sea-relic-hunter/
├── components/          # React components
│   ├── Dock.tsx        # Bottom dock component
│   ├── GameBoard.tsx   # Game board component
│   ├── GameHeader.tsx  # Game header component
│   ├── GameOverModal.tsx # Game over modal
│   └── Tile.tsx        # Tile component
├── services/           # Service layer
│   └── geminiService.ts # Gemini AI service
├── App.tsx             # Main app component
├── constants.tsx       # Game constants
├── types.ts            # TypeScript type definitions
├── index.tsx           # App entry point
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
└── package.json        # Project dependencies
```

### 🎮 Game Mechanics

#### Layer Detection System

The game uses strict spatial overlap detection:
- Tile size: 50px width, 60px height
- Detection rule: If any tile in upper layers overlaps with the current tile (dx < 50 and dy < 60), the current tile is considered "blocked" and not clickable

#### Special Layouts

- **Central Tower**: 10-layer complex stack with 4-5 tiles per layer
- **Random Scatter Points**: 10 scattered clusters, 3 layers each
- **Left/Right Side Piles**: 15 tiles each in long strips, only topmost clickable

### 🤖 AI Assistant

Integrated with Google Gemini AI to provide:
- Cold reminders at game start
- Humorous taunts on failure
- Mysterious hints when stuck

The AI assistant "Deep Blue" uses diving terminology and data analysis tone to add fun to the game.

### 🎨 Visual Design

- **Deep Sea Gradient Background**: Radial gradient from deep blue to black
- **Scanline Animation**: Simulates sonar scanning effect
- **Match Flash Animation**: Visual feedback when tiles are eliminated
- **Smooth Transitions**: Linear transitions to avoid jumping feel

### 📝 Development Notes

#### Adding New Tile Types

Add new tile definitions in `constants.tsx`:

```typescript
{ 
  id: 'new-item', 
  icon: '🎯', 
  name: 'New Relic', 
  color: 'bg-purple-50' 
}
```

#### Adjusting Difficulty

Modify the `initGame` function in `App.tsx`:
- `totalTripletsCount`: Controls total number of tiles
- Layout logic: Adjust central tower, scatter points, and side pile quantities

### 🤝 Contributing

Issues and Pull Requests are welcome!

### 📄 License

This project is licensed under the MIT License.

### 🙏 Acknowledgments

- Game inspired by "Sheep a Sheep"
- Powered by Google Gemini AI for intelligent commentary
- Icons provided by Lucide React

---

<div align="center">

**Made with ❤️ and 🌊**

</div>
