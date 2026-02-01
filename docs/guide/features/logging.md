# 日志系统

本章详细介绍 NucleusX 日志系统的功能和使用方法。

## 日志系统概述

NucleusX Logger 是一个**结构化、多通道、带上下文**的日志记录系统。它解决了传统 `console.log` 信息零散、无法持久化、无法追踪用户行为链路的痛点。

### 核心特性

- **多通道输出 (Multi-Transports)**：
  - **ConsoleTransport**: 开发环境输出带颜色的控制台日志
  - **StorageTransport**: 生产环境将日志写入本地 Storage，发生崩溃时可上报
  - **HttpTransport** (可扩展): 实时上报到 ELK 或 Sentry
- **上下文追踪 (Context Tracing)**：
  - 每条日志都携带 `context` (如 `Page:Home`, `Service:Auth`)，快速定位日志来源
  - 支持关联 `TraceID`，串联前端行为与后端请求
- **日志分级**：支持 `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR` 五级控制，生产环境可一键屏蔽低优日志

### 架构原理

日志系统采用三层架构：

1. **LogEntry**: 标准化的日志对象 `{ level, time, context, message, meta }`
2. **Logger**: 日志生成器，负责创建 LogEntry 并分发给所有注册的 Transports
3. **Transports**: 具体的消费者，负责将 LogEntry 渲染到控制台或写入文件/网络

## 初始化配置

### 基础初始化

```typescript
import { init } from '@nucleusx/core';
import { ConsoleTransport, StorageTransport } from '@nucleusx/core';

// 基础初始化配置
init({
  level: 'debug', // 日志级别
  transports: [
    new ConsoleTransport(), // 控制台输出
    new StorageTransport({ maxEntries: 1000 }) // 本地存储
  ]
});
```

### 环境特定配置

```typescript
// 根据环境配置不同的日志级别
const getLoggerConfig = () => {
  const baseConfig = {
    transports: [
      new StorageTransport({ maxEntries: 1000 })
    ] as Transport[]
  };

  if (process.env.NODE_ENV === 'development') {
    // 开发环境添加控制台输出
    baseConfig.transports.unshift(new ConsoleTransport());
    return {
      ...baseConfig,
      level: 'debug' // 开发环境输出所有级别日志
    };
  } else if (process.env.NODE_ENV === 'production') {
    // 生产环境只记录警告和错误
    return {
      ...baseConfig,
      level: 'warn',
      transports: [
        new StorageTransport({ maxEntries: 2000 }),
        // 生产环境可添加 HTTP 上报
        new HttpTransport({
          endpoint: 'https://logs.example.com/api/logs',
          batchSize: 10
        })
      ]
    };
  } else {
    return {
      ...baseConfig,
      level: 'info'
    };
  }
};

// 使用环境配置初始化
init(getLoggerConfig());
```

## 日志级别

NucleusX 支持五个标准日志级别：

| 级别 | 说明 | 使用场景 |
|------|------|----------|
| `TRACE` | 最详细的信息 | 开发调试，追踪代码执行路径 |
| `DEBUG` | 详细的诊断信息 | 开发调试，详细状态信息 |
| `INFO` | 一般信息消息 | 正常操作信息，重要事件 |
| `WARN` | 警告信息 | 潜在问题，不影响运行 |
| `ERROR` | 错误事件 | 错误发生，但应用可继续运行 |

### 日志级别使用建议

```typescript
import { getLog } from '@nucleusx/core';

const log = getLog('UserService');

// TRACE - 详细跟踪
log.trace('Entering getUser method', { userId: 123 });

// DEBUG - 诊断信息
log.debug('Fetching user data from API', { 
  userId: 123, 
  apiUrl: 'https://api.example.com/users/123' 
});

// INFO - 重要操作
log.info('User logged in successfully', { 
  userId: 123, 
  timestamp: new Date().toISOString() 
});

// WARN - 潜在问题
log.warn('Using deprecated API endpoint', { 
  endpoint: '/api/v1/users', 
  suggestion: 'Use /api/v2/users instead' 
});

// ERROR - 错误事件
log.error('Failed to update user profile', { 
  userId: 123, 
  error: 'Database connection failed',
  stack: error.stack 
});
```

## 获取 Logger 实例

### 带上下文的 Logger

```typescript
import { getLog } from '@nucleusx/core';

// 为不同模块创建专用的 Logger
const authServiceLog = getLog('AuthService');
const paymentServiceLog = getLog('PaymentService');
const routerLog = getLog('Router');

// 使用专用 Logger
authServiceLog.info('User authentication started');
paymentServiceLog.warn('Payment gateway timeout', { 
  retryCount: 2 
});
routerLog.debug('Route transition completed', { 
  from: '/login', 
  to: '/dashboard' 
});
```

### Logger 方法

Logger 实例提供以下方法：

```typescript
const log = getLog('MyModule');

// 各级别日志方法
log.trace(message, meta?);  // 跟踪
log.debug(message, meta?);  // 调试
log.info(message, meta?);   // 信息
log.warn(message, meta?);   // 警告
log.error(message, meta?);  // 错误

// 通用方法
log.log(level, message, meta?); // 通用日志方法
```

## 日志格式

### 标准日志对象

每条日志都是标准化的对象：

```typescript
interface LogEntry {
  level: LogLevel;          // 日志级别
  time: Date;              // 时间戳
  context: string;         // 上下文信息
  message: string;         // 日志消息
  meta: Record<string, any>; // 元数据
  traceId?: string;        // 追踪ID（可选）
}
```

### 元数据使用

```typescript
// 结构化元数据 - 推荐做法
log.info('User created successfully', {
  userId: 123,
  userName: 'john_doe',
  email: 'john@example.com',
  createdAt: new Date().toISOString(),
  source: 'registration_form',
  ip: '192.168.1.100'
});

// 避免字符串拼接 - 不推荐做法
log.info(`User ${userName} created at ${timestamp}`); // 不推荐
```

## 输出通道 (Transports)

### ConsoleTransport

控制台输出通道，主要用于开发环境。

```typescript
import { ConsoleTransport } from '@nucleusx/core';

const consoleTransport = new ConsoleTransport({
  // 自定义格式化函数
  format: (entry) => {
    const colors = {
      debug: '\x1b[36m',  // 青色
      info: '\x1b[32m',   // 绿色
      warn: '\x1b[33m',   // 黄色
      error: '\x1b[31m',  // 红色
      reset: '\x1b[0m'    // 重置
    };
    
    return `${colors[entry.level]}[${entry.level.toUpperCase()}] ${entry.context}: ${entry.message}${colors.reset}`;
  },
  
  // 是否显示时间戳
  showTimestamp: true,
  
  // 是否显示颜色
  useColors: true
});
```

### StorageTransport

本地存储通道，主要用于生产环境。

```typescript
import { StorageTransport } from '@nucleusx/core';

const storageTransport = new StorageTransport({
  // 最大存储条数
  maxEntries: 2000,
  
  // 存储键名
  storageKey: 'app_logs',
  
  // 日志序列化函数
  serialize: (entry) => JSON.stringify({
    ...entry,
    time: entry.time.toISOString()
  }),
  
  // 日志反序列化函数
  deserialize: (str) => {
    const obj = JSON.parse(str);
    obj.time = new Date(obj.time);
    return obj;
  }
});
```

### HttpTransport

HTTP 上报通道，用于日志收集服务。

```typescript
import { HttpTransport } from '@nucleusx/core';

const httpTransport = new HttpTransport({
  // 上报端点
  endpoint: 'https://logs.example.com/api/logs',
  
  // 批量大小
  batchSize: 10,
  
  // 上报间隔（毫秒）
  flushInterval: 5000,
  
  // 最大重试次数
  maxRetries: 3,
  
  // 请求配置
  requestOptions: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getLogToken()}`
    }
  },
  
  // 数据格式化
  format: (entries) => ({
    logs: entries,
    clientInfo: {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    }
  })
});
```

### 自定义 Transport

您可以创建自定义的 Transport：

```typescript
import { Transport, LogEntry } from '@nucleusx/core';

class CustomTransport implements Transport {
  constructor(private options: { 
    threshold?: number, 
    destination?: string 
  } = {}) {}
  
  async log(entry: LogEntry): Promise<void> {
    // 自定义日志处理逻辑
    if (this.shouldLog(entry)) {
      await this.sendToDestination(entry);
    }
  }
  
  private shouldLog(entry: LogEntry): boolean {
    const threshold = this.options.threshold || 3; // 默认为 warn 级别
    const levels = ['trace', 'debug', 'info', 'warn', 'error'];
    return levels.indexOf(entry.level) >= threshold;
  }
  
  private async sendToDestination(entry: LogEntry): Promise<void> {
    // 发送到自定义目的地
    console.log(`Custom transport: [${entry.level}] ${entry.context}: ${entry.message}`);
    
    // 可以发送到文件、数据库或其他服务
  }
}

// 使用自定义 Transport
init({
  level: 'info',
  transports: [
    new CustomTransport({ threshold: 2, destination: 'my-service' })
  ]
});
```

## 高级功能

### 日志追踪 (Trace ID)

```typescript
// 为请求链路添加追踪ID
const createTracedLogger = (traceId?: string) => {
  const baseLogger = getLog('ApiService');
  
  return {
    ...baseLogger,
    // 带追踪ID的日志方法
    infoWithTrace: (message: string, meta: any = {}) => {
      baseLogger.info(message, { 
        ...meta, 
        traceId: traceId || generateTraceId() 
      });
    },
    
    errorWithTrace: (message: string, meta: any = {}) => {
      baseLogger.error(message, { 
        ...meta, 
        traceId: traceId || generateTraceId() 
      });
    }
  };
};

// 使用追踪日志
const tracedLog = createTracedLogger('req-12345-abcde');
tracedLog.infoWithTrace('API request started', { endpoint: '/users' });
```

### 日志过滤

```typescript
// 创建带过滤功能的 Transport
class FilteredTransport implements Transport {
  constructor(
    private transport: Transport,
    private filterFn: (entry: LogEntry) => boolean
  ) {}
  
  async log(entry: LogEntry): Promise<void> {
    if (this.filterFn(entry)) {
      await this.transport.log(entry);
    }
  }
}

// 只记录特定上下文的日志
const contextFilteredTransport = new FilteredTransport(
  new ConsoleTransport(),
  (entry) => entry.context.startsWith('CriticalService')
);
```

### 日志采样

```typescript
// 采样日志 - 只记录一定比例的日志
class SamplingTransport implements Transport {
  constructor(
    private transport: Transport,
    private sampleRate: number // 0.0 - 1.0
  ) {}
  
  async log(entry: LogEntry): Promise<void> {
    if (Math.random() < this.sampleRate) {
      await this.transport.log(entry);
    }
  }
}

// 只记录 10% 的日志（用于高频日志）
const samplingTransport = new SamplingTransport(
  new HttpTransport({ endpoint: '...' }),
  0.1 // 10% 采样率
);
```

## 实际应用示例

### 在服务中使用

```typescript
// services/UserService.ts
import { getLog } from '@nucleusx/core';

class UserService {
  private log = getLog('UserService');
  
  async getUser(userId: string) {
    this.log.info('Getting user', { userId });
    
    try {
      const user = await this.fetchUser(userId);
      this.log.debug('User fetched successfully', { 
        userId, 
        hasProfile: !!user.profile 
      });
      return user;
    } catch (error) {
      this.log.error('Failed to get user', { 
        userId, 
        error: error.message,
        stack: error.stack 
      });
      throw error;
    }
  }
  
  async updateUser(userId: string, updates: any) {
    this.log.info('Updating user', { 
      userId, 
      fields: Object.keys(updates) 
    });
    
    try {
      const result = await this.api.updateUser(userId, updates);
      this.log.info('User updated successfully', { 
        userId, 
        updatedAt: new Date().toISOString() 
      });
      return result;
    } catch (error) {
      this.log.error('Failed to update user', { 
        userId, 
        error: error.message,
        updates 
      });
      throw error;
    }
  }
}
```

### 在路由中使用

```typescript
// 在路由守卫中记录导航日志
router.beforeEach((to, from) => {
  const log = getLog('Router');
  log.info('Navigation started', {
    from: from.path,
    to: to.path,
    timestamp: Date.now(),
    userAgent: navigator.userAgent
  });
});

router.afterEach((to, from) => {
  const log = getLog('Router');
  log.info('Navigation completed', {
    from: from.path,
    to: to.path,
    duration: Date.now() - startTime,
    timestamp: Date.now()
  });
});
```

### 在请求中使用

```typescript
// 请求中间件中的日志记录
const loggingMiddleware: Middleware = async (context, next) => {
  const log = getLog('Request');
  
  const requestId = generateRequestId();
  const startTime = Date.now();
  
  log.info('Request started', {
    requestId,
    method: context.request.method,
    url: context.request.url,
    timestamp: startTime
  });
  
  await next();
  
  const duration = Date.now() - startTime;
  
  if (context.response) {
    log.info('Request completed', {
      requestId,
      statusCode: context.response.statusCode,
      duration,
      timestamp: Date.now()
    });
  } else if (context.error) {
    log.error('Request failed', {
      requestId,
      error: context.error.message,
      duration,
      timestamp: Date.now()
    });
  }
};
```

## 最佳实践

### 1. 禁止使用 console.log

项目规范中应强制要求使用 NucleusX 的日志系统：

```typescript
// ❌ 避免使用
console.log('Something happened');
console.error('An error occurred');

// ✅ 推荐使用
const log = getLog('MyModule');
log.info('Something happened');
log.error('An error occurred');
```

### 2. 结构化 Meta 数据

Meta 参数应该是对象，而不是拼接的字符串：

```typescript
// ✅ 正确：结构化数据
log.info('User action', {
  userId: 123,
  action: 'click',
  element: 'button',
  timestamp: new Date().toISOString()
});

// ❌ 错误：字符串拼接
log.info(`User 123 clicked button at ${new Date().toISOString()}`);
```

### 3. 合理设置日志级别

根据不同环境设置合适的日志级别：

- **开发环境**: `debug` - 记录详细调试信息
- **测试环境**: `info` - 记录重要操作信息
- **生产环境**: `warn` - 只记录警告和错误

### 4. 上下文追踪

为每个业务模块分配唯一的上下文标识：

```typescript
// 在不同模块中使用不同的上下文
const authService = getLog('AuthService');
const paymentService = getLog('PaymentService');
const notificationService = getLog('NotificationService');
```

### 5. 关键路径打点

在重要操作前后记录日志，便于问题追踪：

```typescript
const performCriticalOperation = async () => {
  log.info('Starting critical operation');
  
  try {
    const result = await doWork();
    log.info('Critical operation completed successfully');
    return result;
  } catch (error) {
    log.error('Critical operation failed', { error: error.message });
    throw error;
  }
};
```

### 6. 敏感信息处理

避免在日志中记录敏感信息：

```typescript
// ❌ 错误：记录密码
log.info('User login attempt', {
  username: 'john',
  password: 'secret123' // 绝不这样做！
});

// ✅ 正确：脱敏处理
log.info('User login attempt', {
  username: 'john',
  hasPassword: true // 只记录存在性
});
```

通过合理使用 NucleusX 日志系统的各项功能，您可以构建出完善的日志记录和监控体系，大大提高应用的可观测性和可维护性。