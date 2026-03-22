# LLM Chat 升级为 AI 应用开发项目设计方案

## 一、项目定位

将现有的前端聊天应用升级为**企业级 AI 应用平台**，具备以下核心能力：

- 安全的后端 API 代理
- RAG 知识库问答
- Agent 工具调用
- 多模态支持
- 使用量统计与成本追踪

---

## 二、整体架构设计

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────────┐ │
│  │  Chat   │ │   RAG   │ │  Agent  │ │ Settings│ │ Dashboard │ │
│  │  View   │ │  View   │ │  View   │ │ Panel   │ │   View    │ │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └─────┬─────┘ │
└───────┼───────────┼───────────┼───────────┼─────────────┼───────┘
        │           │           │           │             │
        ▼           ▼           ▼           ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API Gateway                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  /api/chat     /api/rag     /api/agent    /api/auth         ││
│  │  /api/documents            /api/stats     /api/models       ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
        │           │           │           │             │
        ▼           ▼           ▼           ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐
│ LLM Service │ │   Vector    │ │   Tool      │ │    Database     │
│ (SiliconFlow│ │    Store    │ │  Services   │ │   (PostgreSQL)  │
│   OpenAI)   │ │ (ChromaDB)  │ │(Weather,Web)│ │    (MongoDB)    │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────────┘
```

---

## 三、后端服务设计

### 3.1 技术栈选型

| 模块 | 技术选型 | 理由 |
|------|---------|------|
| 运行时 | Node.js 20+ | 与前端技术栈统一，生态丰富 |
| 框架 | Fastify | 高性能，内置 JSON Schema 验证 |
| 数据库 | PostgreSQL + Prisma | 关系型数据，ORM 成熟 |
| 向量库 | ChromaDB | 轻量级，支持本地部署 |
| 认证 | JWT + bcrypt | 标准方案 |
| 缓存 | Redis | 会话管理、限流 |

### 3.2 目录结构

```
backend/
├── src/
│   ├── index.ts                 # 入口文件
│   ├── app.ts                   # Fastify 应用配置
│   ├── config/
│   │   ├── index.ts             # 配置聚合
│   │   └── constants.ts         # 常量定义
│   │
│   ├── routes/
│   │   ├── index.ts             # 路由注册
│   │   ├── chat.ts              # 聊天 API
│   │   ├── auth.ts              # 用户认证
│   │   ├── documents.ts         # 文档管理
│   │   ├── rag.ts               # RAG 检索
│   │   ├── agent.ts             # Agent 工具调用
│   │   ├── models.ts            # 模型列表
│   │   └── stats.ts             # 使用统计
│   │
│   ├── services/
│   │   ├── llm/
│   │   │   ├── index.ts         # LLM 服务入口
│   │   │   ├── openai.ts        # OpenAI 兼容接口
│   │   │   └── stream.ts        # 流式响应处理
│   │   ├── embedding/
│   │   │   ├── index.ts         # Embedding 服务
│   │   │   └── openai.ts        # OpenAI Embedding
│   │   ├── vectorstore/
│   │   │   ├── index.ts         # 向量存储接口
│   │   │   └── chromadb.ts      # ChromaDB 实现
│   │   ├── document/
│   │   │   ├── index.ts         # 文档处理入口
│   │   │   ├── parser.ts        # 文档解析器
│   │   │   └── splitter.ts      # 文本分割器
│   │   └── agent/
│   │       ├── index.ts         # Agent 入口
│   │       ├── tools.ts         # 工具定义
│   │       └── executor.ts      # 执行器
│   │
│   ├── middleware/
│   │   ├── auth.ts              # JWT 认证
│   │   ├── ratelimit.ts         # 请求限流
│   │   └── error.ts             # 错误处理
│   │
│   ├── prisma/
│   │   ├── schema.prisma        # 数据库模型
│   │   └── migrations/          # 迁移文件
│   │
│   └── utils/
│       ├── logger.ts            # 日志工具
│       ├── crypto.ts            # 加密工具
│       └── token-counter.ts     # Token 计数
│
├── package.json
├── tsconfig.json
├── .env.example
└── docker-compose.yml
```

### 3.3 核心 API 设计

#### 聊天 API

```typescript
// POST /api/chat/completions
// 流式聊天请求代理

Request:
{
  "model": "deepseek-ai/DeepSeek-R1",
  "messages": [
    { "role": "user", "content": "你好" }
  ],
  "stream": true,
  "temperature": 0.7,
  "max_tokens": 2048
}

Response (SSE):
data: {"choices":[{"delta":{"content":"你"}}]}
data: {"choices":[{"delta":{"content":"好"}}]}
data: [DONE]
```

#### RAG API

```typescript
// POST /api/documents/upload
// 上传文档到知识库

Request: multipart/form-data
{
  "file": File,
  "collection": "company-docs"
}

Response:
{
  "id": "doc_123",
  "filename": "产品手册.pdf",
  "chunks": 45,
  "status": "indexed"
}

// POST /api/rag/query
// RAG 检索问答

Request:
{
  "query": "公司的退款政策是什么？",
  "collection": "company-docs",
  "top_k": 5
}

Response:
{
  "answer": "根据公司政策，退款需在购买后7天内申请...",
  "sources": [
    { "content": "...", "score": 0.92, "metadata": {...} }
  ]
}
```

#### Agent API

```typescript
// POST /api/agent/execute
// 执行 Agent 任务

Request:
{
  "message": "帮我查询北京明天的天气",
  "tools": ["weather", "web_search"]
}

Response:
{
  "response": "北京明天天气晴朗，气温 15-25°C",
  "tool_calls": [
    {
      "tool": "weather",
      "args": { "city": "北京", "date": "2026-03-20" },
      "result": {...}
    }
  ]
}
```

---

## 四、数据库设计

### 4.1 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  avatar        String?
  apiKey        String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  conversations Conversation[]
  documents     Document[]
  usageRecords  UsageRecord[]
}

model Conversation {
  id        String    @id @default(cuid())
  title     String
  model     String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  messages  Message[]
}

model Message {
  id               String   @id @default(cuid())
  role             String
  content          String   @db.Text
  reasoningContent String?  @db.Text
  promptTokens     Int      @default(0)
  completionTokens Int      @default(0)
  totalTokens      Int      @default(0)
  cost             Float    @default(0)
  createdAt        DateTime @default(now())
  
  conversationId   String
  conversation     Conversation @relation(fields: [conversationId], references: [id])
}

model Document {
  id          String   @id @default(cuid())
  filename    String
  filepath    String
  mimeType    String
  size        Int
  chunkCount  Int
  status      String   @default("pending")
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  chunks      DocumentChunk[]
}

model DocumentChunk {
  id           String   @id @default(cuid())
  content      String   @db.Text
  chunkIndex   Int
  embedding    String?  @db.Text
  
  documentId   String
  document     Document @relation(fields: [documentId], references: [id])
}

model UsageRecord {
  id              String   @id @default(cuid())
  date            DateTime @default(now())
  model           String
  promptTokens    Int
  completionTokens Int
  totalTokens     Int
  cost            Float
  
  userId          String
  user            User     @relation(fields: [userId], references: [id])
}

model PromptTemplate {
  id          String   @id @default(cuid())
  name        String
  description String?
  content     String   @db.Text
  variables   String   @db.Text
  category    String?
  isPublic    Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 五、RAG 模块设计

### 5.1 文档处理流程

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Upload  │───▶│  Parse   │───▶│  Split   │───▶│ Embedding│───▶│  Store   │
│  File    │    │  Doc     │    │  Chunks  │    │  Vector  │    │  Vector  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │               │
     ▼               ▼               ▼               ▼               ▼
  PDF/Word      提取文本      按段落/Token    调用 Embedding   存入 ChromaDB
  TXT/MD        保留元数据     分割成块        API 向量化       关联文档ID
```

### 5.2 文档分割策略

```typescript
// services/document/splitter.ts

interface SplitOptions {
  chunkSize: number
  chunkOverlap: number
  separator: string
}

export class TextSplitter {
  split(text: string, options: SplitOptions): string[] {
    // 1. 按段落分割
    // 2. 处理超长段落
    // 3. 添加重叠部分保持上下文
    // 4. 返回 chunk 数组
  }
}
```

### 5.3 检索流程

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Query   │───▶│ Embedding│───▶│  Vector  │───▶│   LLM    │
│  Input   │    │  Query   │    │  Search  │    │ Response │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │
     ▼               ▼               ▼               ▼
  用户问题      向量化问题      相似度检索      构建上下文
                               Top-K 结果      生成回答
```

### 5.4 Prompt 模板

```typescript
const RAG_SYSTEM_PROMPT = `你是一个智能助手，请根据以下参考资料回答用户问题。
如果参考资料中没有相关信息，请诚实告知用户。

参考资料：
{context}

请基于以上资料回答用户问题。回答时请注明引用来源。`

const RAG_USER_PROMPT = `问题：{question}

请回答：`
```

---

## 六、Agent 工具调用设计

### 6.1 工具定义

```typescript
// services/agent/tools.ts

export const tools = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "获取指定城市的天气信息",
      parameters: {
        type: "object",
        properties: {
          city: { type: "string", description: "城市名称" },
          date: { type: "string", description: "日期，格式 YYYY-MM-DD" }
        },
        required: ["city"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "web_search",
      description: "搜索互联网获取信息",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "搜索关键词" },
          num_results: { type: "number", description: "返回结果数量" }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "execute_code",
      description: "执行 Python 代码",
      parameters: {
        type: "object",
        properties: {
          code: { type: "string", description: "Python 代码" }
        },
        required: ["code"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "query_database",
      description: "查询数据库",
      parameters: {
        type: "object",
        properties: {
          sql: { type: "string", description: "SQL 查询语句" }
        },
        required: ["sql"]
      }
    }
  }
]
```

### 6.2 工具实现

```typescript
// services/agent/tools/weather.ts

export async function getWeather(city: string, date?: string) {
  const apiKey = process.env.WEATHER_API_KEY
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`
  )
  const data = await response.json()
  
  return {
    city: data.location.name,
    temperature: data.current.temp_c,
    condition: data.current.condition.text,
    humidity: data.current.humidity,
    forecast: data.forecast.forecastday
  }
}

// services/agent/tools/web_search.ts

export async function webSearch(query: string, numResults = 5) {
  const apiKey = process.env.SERP_API_KEY
  const response = await fetch(
    `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${apiKey}`
  )
  const data = await response.json()
  
  return data.organic_results.slice(0, numResults).map((r: any) => ({
    title: r.title,
    link: r.link,
    snippet: r.snippet
  }))
}
```

### 6.3 执行器

```typescript
// services/agent/executor.ts

export class AgentExecutor {
  async execute(message: string, availableTools: string[]) {
    // 1. 发送消息给 LLM，带上工具定义
    const response = await this.llm.chat({
      messages: [{ role: "user", content: message }],
      tools: this.getToolDefinitions(availableTools)
    })
    
    // 2. 检查是否需要调用工具
    if (response.tool_calls) {
      for (const call of response.tool_calls) {
        // 3. 执行工具
        const result = await this.executeTool(call.function.name, call.function.arguments)
        // 4. 将结果发回 LLM
        // 5. 获取最终回答
      }
    }
    
    return response
  }
}
```

---

## 七、前端升级设计

### 7.1 新增页面

```
src/
├── views/
│   ├── ChatView.tsx        # 现有聊天页面
│   ├── HomePage.tsx        # 现有首页
│   ├── KnowledgeView.tsx   # 新增：知识库管理
│   ├── AgentView.tsx       # 新增：Agent 工作台
│   ├── StatsView.tsx       # 新增：使用统计
│   └── SettingsView.tsx    # 新增：设置页面
│
├── components/
│   ├── DocumentUploader.tsx    # 文档上传组件
│   ├── KnowledgeList.tsx       # 知识库列表
│   ├── ToolSelector.tsx        # 工具选择器
│   ├── UsageChart.tsx          # 使用量图表
│   ├── CostTracker.tsx         # 成本追踪
│   └── PromptEditor.tsx        # Prompt 编辑器
```

### 7.2 状态管理扩展

```typescript
// stores/user.ts
interface UserState {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// stores/knowledge.ts
interface KnowledgeState {
  documents: Document[]
  uploadDocument: (file: File) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  queryRAG: (query: string) => Promise<RAGResponse>
}

// stores/stats.ts
interface StatsState {
  usage: UsageRecord[]
  totalCost: number
  fetchStats: (period: string) => Promise<void>
}
```

---

## 八、部署架构

### 8.1 Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/llmchat
      - REDIS_URL=redis://redis:6379
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - postgres
      - redis
      - chromadb

  postgres:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=llmchat

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  chromadb:
    image: chromadb/chroma:latest
    volumes:
      - chroma_data:/chroma/chroma
    ports:
      - "8001:8000"

volumes:
  postgres_data:
  redis_data:
  chroma_data:
```

### 8.2 环境变量

```bash
# .env.example

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/llmchat

# Redis
REDIS_URL=redis://localhost:6379

# LLM API
OPENAI_API_KEY=sk-xxx
SILICONFLOW_API_KEY=sk-xxx

# Embedding
EMBEDDING_MODEL=text-embedding-3-small

# Vector Store
CHROMA_HOST=localhost
CHROMA_PORT=8001

# Tools
WEATHER_API_KEY=xxx
SERP_API_KEY=xxx

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Rate Limit
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000
```

---

## 九、开发计划

### Phase 1: 后端基础 (Week 1-2)

| 任务 | 预计时间 |
|------|---------|
| 搭建 Fastify 项目骨架 | 2h |
| Prisma 数据库模型 + 迁移 | 3h |
| JWT 认证中间件 | 2h |
| 聊天 API 代理 | 4h |
| 请求限流中间件 | 2h |
| 错误处理统一 | 2h |

### Phase 2: RAG 能力 (Week 3-4)

| 任务 | 预计时间 |
|------|---------|
| ChromaDB 集成 | 3h |
| 文档解析器 (PDF/Word/TXT) | 4h |
| 文本分割器 | 2h |
| Embedding 服务 | 3h |
| RAG 检索 API | 4h |
| 前端知识库页面 | 6h |

### Phase 3: Agent 能力 (Week 5-6)

| 任务 | 预计时间 |
|------|---------|
| 工具定义框架 | 3h |
| 天气工具 | 2h |
| 网页搜索工具 | 2h |
| Agent 执行器 | 4h |
| 前端 Agent 页面 | 4h |

### Phase 4: 统计与优化 (Week 7-8)

| 任务 | 预计时间 |
|------|---------|
| Token 计数服务 | 2h |
| 成本计算逻辑 | 2h |
| 使用统计 API | 3h |
| 前端统计图表 | 4h |
| Docker 部署配置 | 3h |
| 性能优化 | 4h |

---

## 十、技术亮点总结

完成升级后，项目将具备以下技术亮点：

1. **全栈能力** - 前后端分离架构，展示完整的工程能力
2. **RAG 技术** - 文档向量化、语义检索、知识库问答
3. **Agent 架构** - Function Calling、工具编排、任务规划
4. **工程化实践** - Docker 容器化、CI/CD、监控告警
5. **安全意识** - API Key 保护、请求限流、用户认证

---

## 十一、面试展示建议

### 项目介绍话术

> "这是一个企业级 AI 应用平台，我独立完成了从架构设计到核心功能实现的全过程。
> 
> 技术亮点包括：
> - 实现了基于 ChromaDB 的 RAG 知识库问答，支持多格式文档上传
> - 设计了 Agent 工具调用框架，支持天气查询、网页搜索等工具
> - 实现了流式响应代理，支持 SSE 协议
> - 使用 Docker Compose 实现一键部署
> 
> 通过这个项目，我深入理解了 LLM 应用的核心技术栈，包括 Prompt Engineering、RAG、Agent 等。"

### 可能的面试问题

1. **RAG 如何解决幻觉问题？**
   - 通过检索相关文档作为上下文，约束 LLM 的回答范围
   - 添加引用来源，提高可追溯性

2. **为什么选择 ChromaDB？**
   - 轻量级，支持本地部署
   - Python/JS SDK 完善
   - 支持多种 Embedding 模型

3. **Agent 的工具调用流程？**
   - LLM 判断是否需要调用工具
   - 解析工具名称和参数
   - 执行工具获取结果
   - 将结果注入上下文，生成最终回答

---

*文档版本: v1.0*
*创建日期: 2026-03-19*
