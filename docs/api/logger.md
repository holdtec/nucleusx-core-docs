# 日志系统 API

## init

初始化日志系统的函数。

### 语法

```typescript
import { init } from '@nucleusx/core';

init(config: ILoggerConfig);
```

### 参数

- `config` (ILoggerConfig): 日志配置对象

### 示例

```typescript
import { init, ConsoleTransport, StorageTransport } from '@nucleusx/core';

init({
  level: 'debug', // 生产环境改为 'warn'
  transports: [
    new ConsoleTransport(),
    new StorageTransport({ maxEntries: 1000 })
  ]
});
```

## ILoggerConfig 接口

日志配置接口。

### 属性

- `level`: LogLevel - 日志级别 ('trace' | 'debug' | 'info' | 'warn' | 'error')
- `transports`: Transport[] - 输出通道数组
- `defaultContext?`: string - 默认上下文（可选）

## 日志级别

- `TRACE`: 最详细的信息，通常只在开发时使用
- `DEBUG`: 详细的诊断信息
- `INFO`: 一般信息消息
- `WARN`: 警告信息
- `ERROR`: 错误事件，但应用程序仍可运行

## getLog

获取带上下文的 Logger 实例。

### 语法

```typescript
import { getLog } from '@nucleusx/core';

const log = getLog(context: string);
```

### 参数

- `context` (string): 日志上下文（如 'PaymentService'）

### 返回值

- `ILogger`: 带有上下文的 Logger 实例

### 示例

```typescript
const log = getLog('PaymentService');
log.debug('Starting payment process', { orderId: '123' });
```

## ILogger 接口

Logger 实例接口。

### 方法

- `trace(message, meta?)`: 记录 TRACE 级别日志
- `debug(message, meta?)`: 记录 DEBUG 级别日志
- `info(message, meta?)`: 记录 INFO 级别日志
- `warn(message, meta?)`: 记录 WARN 级别日志
- `error(message, meta?)`: 记录 ERROR 级别日志

### 参数

- `message` (string): 日志消息
- `meta?` (Object): 元数据（可选的结构化数据）

## Transport 接口

输出通道接口，定义了日志输出的具体实现。

### 内置 Transport

#### ConsoleTransport

开发环境输出带颜色的控制台日志。

```typescript
new ConsoleTransport()
```

#### StorageTransport

生产环境将日志写入本地 Storage。

```typescript
new StorageTransport({ maxEntries: 1000 }) // 本地只存最近 1000 条
```

#### HttpTransport (可扩展)

实时上报到 ELK 或 Sentry。

## 日志结构

每条日志都是标准化的对象：

```typescript
{
  level: string,      // 日志级别
  time: Date,         // 时间戳
  context: string,    // 上下文信息
  message: string,    // 日志消息
  meta: Object        // 元数据
}
```

## 最佳实践

1. **禁用 console.log**: 项目规范中应强制要求使用 NucleusX 的日志系统
2. **结构化 Meta 数据**: meta 参数应该是对象，而不是拼接的字符串
3. **上下文追踪**: 为每个业务模块分配唯一的上下文标识
4. **关键路径打点**: 在重要操作前后记录日志，便于问题追踪
5. **合理设置日志级别**: 生产环境避免过多的 DEBUG 日志