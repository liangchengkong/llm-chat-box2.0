# LLM Chat

一个基于 React 18 + TypeScript 的现代化 AI 聊天应用，支持流式响应、Markdown 渲染、代码高亮以及文件上传预览等功能。

## 🌟 特性

- 💬 多会话管理
- 📝 Markdown 支持
- 🖥️ 代码高亮显示
- 📤 文件和图片上传
- 🌊 流式响应
- 💾 本地数据持久化
- 📱 响应式设计
- 🔍 内联搜索对话框（760+ 预设提示词）
- ⌨️ 快捷键支持（Ctrl/Cmd + K）

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **状态管理**: Zustand
- **路由**: React Router DOM
- **样式处理**: SCSS
- **Markdown 渲染**: markdown-it
- **代码高亮**: Highlight.js
- **动画效果**: Animate.css
- **持久化存储**: Zustand persist middleware

## 📸 项目演示

### 首页展示

首页包含项目介绍和主要功能入口，简洁直观的设计风格。

### 独立对话界面

支持多会话管理、消息历史、代码高亮等功能，提供流畅的对话体验。

### 内联搜索对话框

快捷的内联搜索对话框，支持快速检索和问答，提升使用效率。

## 📦 项目结构

```bash
src/
├── assets/              # 静态资源
│   ├── photo/           # 图标资源
│   ├── sampels/         # 示例图片
│   └── styles/          # 样式变量
├── components/           # 组件
│   ├── ChatInput.tsx     # 聊天输入框组件
│   ├── ChatMessage.tsx   # 消息显示组件
│   ├── DialogEdit.tsx    # 对话编辑弹窗
│   ├── PopupMenu.tsx    # 侧边菜单组件
│   ├── SearchDialog.tsx  # 搜索对话框组件
│   └── SettingsPanel.tsx # 设置面板组件
├── stores/              # Zustand 状态管理
│   ├── chat.ts          # 聊天相关状态
│   └── setting.ts       # 设置相关状态
├── utils/               # 工具函数
│   ├── api.ts           # API 请求封装
│   ├── markdown.ts       # Markdown 处理
│   └── messageHandler.ts # 消息处理
├── views/               # 页面
│   ├── HomePage.tsx      # 首页
│   └── ChatView.tsx     # 主聊天页面
├── router/              # 路由配置
│   └── index.tsx
├── types/               # TypeScript 类型定义
│   ├── index.ts
│   └── markdown-it.d.ts
├── App.tsx              # 根组件
└── main.tsx             # 入口文件
```

## 🚀 功能特点

### 多会话管理
- 创建、切换、编辑和删除会话
- 会话标题自动保存
- 确保至少存在一个会话

### 消息功能
- 支持文本消息发送
- 图片和文件上传预览
- 流式响应显示
- Markdown 实时渲染
- 代码块语法高亮
- 代码复制功能
- 深度思考过程展示

### 搜索功能
- 760+ 预设提示词
- 实时搜索过滤
- 键盘导航（上下箭头）
- 快捷键支持（Ctrl/Cmd + K）
- 点击选择自动跳转

### 用户界面
- 响应式设计适配多种设备
- 简洁现代的界面风格
- 流畅的动画过渡效果

### 设置选项
- 模型选择
- 流式响应开关
- API Key 配置
- 最大 Token 限制
- 温度、Top P、Top K 等参数配置

## 🔧 配置项

### 模型设置
- 支持多种 LLM 模型（默认：deepseek-ai/DeepSeek-R1）
- 可配置 API 密钥
- 自定义模型参数

### 界面设置
- 深色/浅色主题切换
- 流式响应开关

## 💾 数据持久化

使用 Zustand persist 中间件实现：
- 会话历史记录
- 用户设置
- 主题偏好

## 🔨 开发指南

### 安装依赖

```bash
pnpm install
```

### 运行项目

```bash
pnpm dev
```

### 构建项目

```bash
pnpm build
```

### 代码检查

```bash
pnpm lint
```

### 代码格式化

```bash
pnpm format
```

## 📝 使用说明

1. 配置 SiliconFlow API Key
2. 选择合适的模型（推荐：deepseek-ai/DeepSeek-R1）
3. 开始新对话或从历史记录中选择
4. 可以发送文本消息、上传图片或文件
5. 使用 Markdown 语法获得更好的排版效果
6. 使用 `Ctrl + K` / `Cmd + K` 快速打开搜索对话框

## 🔑 API 配置

本项目使用 [SiliconFlow](https://cloud.siliconflow.cn/) 提供的 API 服务：

1. 注册并登录 [SiliconFlow 控制台](https://cloud.siliconflow.cn/)
2. 完成实名认证
3. 获取 API Key
4. 在应用设置中配置 API Key

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 📄 许可证

[MIT License](LICENSE)
