# 日志示例

本章提供 NucleusX 日志系统的实际应用示例。

## 基础日志使用示例

### 不同模块的日志记录

```typescript
import { getLog } from '@nucleusx/core';

// 为不同模块创建专门的日志记录器
const appLog = getLog('App');
const authLog = getLog('Auth');
const apiLog = getLog('API');
const routerLog = getLog('Router');

// 应用启动日志
appLog.info('Application starting', {
  version: '1.0.0',
  environment: process.env.NODE_ENV,
  timestamp: new Date().toISOString(),
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server'
});

// 认证服务日志
class AuthService {
  private log = getLog('AuthService');
  
  async login(credentials: { username: string; password: string }) {
    this.log.info('Login attempt initiated', { 
      username: credentials.username,
      timestamp: new Date().toISOString()
    });
    
    try {
      // 模拟登录过程
      const result = await this.performLogin(credentials);
      
      this.log.info('Login successful', {
        userId: result.userId,
        sessionId: result.sessionId,
        loginTime: new Date().toISOString()
      });
      
      return result;
    } catch (error: any) {
      this.log.error('Login failed', {
        username: credentials.username,
        error: error.message,
        timestamp: new Date().toISOString(),
        stack: error.stack
      });
      
      throw error;
    }
  }
  
  async logout(sessionId: string) {
    this.log.info('Logout initiated', { sessionId });
    
    try {
      await this.performLogout(sessionId);
      
      this.log.info('Logout completed successfully', { sessionId });
    } catch (error: any) {
      this.log.error('Logout failed', {
        sessionId,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  }
  
  private async performLogin(credentials: any) {
    // 模拟登录逻辑
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.username === 'admin' && credentials.password === 'password') {
          resolve({
            userId: 'user-123',
            sessionId: 'sess-' + Date.now(),
            permissions: ['read', 'write']
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  }
  
  private async performLogout(sessionId: string) {
    // 模拟登出逻辑
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 200);
    });
  }
}
```

### API 请求日志记录

```typescript
// API 服务日志记录
class ApiService {
  private log = getLog('ApiService');
  
  async makeRequest<T>(config: {
    url: string;
    method: string;
    data?: any;
    params?: any;
  }): Promise<T> {
    const requestId = this.generateRequestId();
    
    this.log.info('API request initiated', {
      requestId,
      url: config.url,
      method: config.method,
      params: config.params,
      timestamp: new Date().toISOString()
    });
    
    const startTime = Date.now();
    
    try {
      // 模拟 API 请求
      const response = await this.simulateApiCall(config);
      
      const duration = Date.now() - startTime;
      
      this.log.info('API request completed', {
        requestId,
        statusCode: response.status,
        duration,
        url: config.url,
        method: config.method
      });
      
      return response.data;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      this.log.error('API request failed', {
        requestId,
        url: config.url,
        method: config.method,
        error: error.message,
        duration,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  }
  
  private generateRequestId(): string {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private async simulateApiCall(config: any) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% 成功率
          resolve({
            status: 200,
            data: { 
              id: Math.floor(Math.random() * 1000),
              message: 'Success',
              timestamp: new Date().toISOString()
            }
          });
        } else {
          reject(new Error('Network error'));
        }
      }, 300 + Math.random() * 500);
    });
  }
}
```

## 高级日志功能示例

### 自定义传输器 (Custom Transport)

```typescript
import { Transport, LogEntry } from '@nucleusx/core';

// 自定义日志传输器 - 发送到远程服务器
class RemoteLogTransport implements Transport {
  private endpoint: string;
  private batchSize: number;
  private buffer: LogEntry[] = [];
  private flushTimer: any;
  
  constructor(options: {
    endpoint: string;
    batchSize?: number;
    flushInterval?: number;
  }) {
    this.endpoint = options.endpoint;
    this.batchSize = options.batchSize || 10;
    
    // 定期发送日志
    const flushInterval = options.flushInterval || 5000; // 5秒
    this.flushTimer = setInterval(() => {
      this.flushLogs();
    }, flushInterval);
  }
  
  async log(entry: LogEntry): Promise<void> {
    // 添加到缓冲区
    this.buffer.push(entry);
    
    // 如果达到批次大小，立即发送
    if (this.buffer.length >= this.batchSize) {
      await this.flushLogs();
    }
  }
  
  private async flushLogs(): Promise<void> {
    if (this.buffer.length === 0) return;
    
    const logsToSend = [...this.buffer];
    this.buffer = []; // 清空缓冲区
    
    try {
      // 发送到远程服务器
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ logs: logsToSend })
      });
      
      console.log(`Sent ${logsToSend.length} logs to remote server`);
    } catch (error) {
      console.error('Failed to send logs to remote server:', error);
      
      // 如果发送失败，将日志放回缓冲区（但要限制大小避免无限增长）
      this.buffer = [...logsToSend.slice(-20), ...this.buffer]; // 只保留最新的20条
    }
  }
  
  // 清理资源
  dispose(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    
    // 发送剩余的日志
    this.flushLogs();
  }
}

// 使用自定义传输器
const remoteTransport = new RemoteLogTransport({
  endpoint: 'https://logs.yourserver.com/api/logs',
  batchSize: 5,
  flushInterval: 3000
});
```

### 日志过滤和采样

```typescript
// 日志过滤传输器
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

// 只记录错误和警告
const errorOnlyTransport = new FilteredTransport(
  new ConsoleTransport(),
  (entry) => ['error', 'warn'].includes(entry.level)
);

// 日志采样传输器（只记录一部分日志）
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

// 只记录 10% 的调试日志（用于高频日志）
const sampledDebugTransport = new SamplingTransport(
  new ConsoleTransport(),
  0.1
);
```

### 结构化日志记录

```typescript
// 业务服务类，展示结构化日志记录
class OrderService {
  private log = getLog('OrderService');
  
  async createOrder(orderData: {
    userId: string;
    items: Array<{ id: string; quantity: number; price: number }>;
    paymentMethod: string;
  }) {
    const orderId = this.generateOrderId();
    
    this.log.info('Order creation initiated', {
      orderId,
      userId: orderData.userId,
      itemCount: orderData.items.length,
      totalAmount: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      paymentMethod: orderData.paymentMethod,
      timestamp: new Date().toISOString()
    });
    
    try {
      // 验证订单
      await this.validateOrder(orderData);
      
      // 处理支付
      const paymentResult = await this.processPayment(orderData);
      
      // 创建订单记录
      const orderRecord = await this.saveOrder({
        ...orderData,
        orderId,
        paymentId: paymentResult.paymentId,
        status: 'confirmed'
      });
      
      this.log.info('Order created successfully', {
        orderId,
        userId: orderData.userId,
        paymentId: paymentResult.paymentId,
        totalAmount: orderRecord.totalAmount,
        confirmationTime: new Date().toISOString()
      });
      
      return orderRecord;
    } catch (error: any) {
      this.log.error('Order creation failed', {
        orderId,
        userId: orderData.userId,
        error: error.message,
        timestamp: new Date().toISOString(),
        stack: error.stack
      });
      
      throw error;
    }
  }
  
  async processRefund(orderId: string, reason: string) {
    this.log.info('Refund process initiated', {
      orderId,
      reason,
      timestamp: new Date().toISOString()
    });
    
    try {
      const order = await this.getOrder(orderId);
      
      if (order.status !== 'paid') {
        throw new Error(`Cannot refund order with status: ${order.status}`);
      }
      
      // 处理退款
      const refundResult = await this.executeRefund(order);
      
      // 更新订单状态
      await this.updateOrderStatus(orderId, 'refunded');
      
      this.log.info('Refund processed successfully', {
        orderId,
        refundAmount: order.totalAmount,
        refundId: refundResult.refundId,
        processedAt: new Date().toISOString()
      });
      
      return refundResult;
    } catch (error: any) {
      this.log.error('Refund process failed', {
        orderId,
        reason,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  }
  
  private generateOrderId(): string {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }
  
  private async validateOrder(orderData: any) {
    // 模拟验证逻辑
    if (!orderData.userId) {
      throw new Error('User ID is required');
    }
    
    if (orderData.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }
    
    // 模拟异步验证
    return new Promise(resolve => setTimeout(resolve, 100));
  }
  
  private async processPayment(orderData: any) {
    // 模拟支付处理
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.05) { // 95% 成功率
          resolve({
            paymentId: `pay_${Date.now()}`,
            status: 'success',
            amount: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
          });
        } else {
          reject(new Error('Payment failed'));
        }
      }, 500);
    });
  }
  
  private async saveOrder(order: any) {
    // 模拟保存订单
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ...order,
          totalAmount: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          createdAt: new Date().toISOString()
        });
      }, 200);
    });
  }
  
  private async getOrder(orderId: string) {
    // 模拟获取订单
    return {
      orderId,
      status: 'paid',
      totalAmount: 99.99
    };
  }
  
  private async executeRefund(order: any) {
    // 模拟退款执行
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          refundId: `refund_${Date.now()}`,
          amount: order.totalAmount,
          status: 'completed'
        });
      }, 300);
    });
  }
  
  private async updateOrderStatus(orderId: string, status: string) {
    // 模拟更新订单状态
    return new Promise(resolve => {
      setTimeout(resolve, 100);
    });
  }
}

// 使用订单服务
const orderService = new OrderService();

// 创建订单
orderService.createOrder({
  userId: 'user-123',
  items: [
    { id: 'item-1', quantity: 2, price: 29.99 },
    { id: 'item-2', quantity: 1, price: 19.99 }
  ],
  paymentMethod: 'credit_card'
}).then(order => {
  console.log('Order created:', order);
}).catch(error => {
  console.error('Order creation failed:', error);
});
```

## 性能监控日志

### API 性能监控

```typescript
// API 性能监控装饰器
function monitorPerformance(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = async function (...args: any[]) {
    const log = getLog(`${target.constructor.name}.${propertyKey}`);
    const startTime = Date.now();
    const methodName = propertyKey;
    
    log.debug('Method execution started', {
      method: methodName,
      args: args.map(arg => typeof arg === 'object' ? '[Object]' : arg),
      timestamp: new Date().toISOString()
    });
    
    try {
      const result = await originalMethod.apply(this, args);
      const duration = Date.now() - startTime;
      
      log.info('Method execution completed', {
        method: methodName,
        duration,
        success: true,
        timestamp: new Date().toISOString()
      });
      
      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      log.error('Method execution failed', {
        method: methodName,
        duration,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  };
  
  return descriptor;
}

// 使用性能监控的 API 服务
class MonitoredApiService {
  private log = getLog('MonitoredApiService');
  
  @monitorPerformance
  async getData(endpoint: string) {
    // 模拟 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: `Data from ${endpoint}`, timestamp: new Date().toISOString() });
      }, 200 + Math.random() * 300);
    });
  }
  
  @monitorPerformance
  async postData(endpoint: string, data: any) {
    // 模拟 POST 请求
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          id: Math.floor(Math.random() * 1000), 
          timestamp: new Date().toISOString() 
        });
      }, 300 + Math.random() * 400);
    });
  }
}
```

### 系统健康检查日志

```typescript
// 系统健康检查服务
class HealthCheckService {
  private log = getLog('HealthCheckService');
  private checks: Array<{
    name: string;
    checkFn: () => Promise<boolean>;
    interval: number;
    lastChecked: number;
  }> = [];
  
  // 添加健康检查
  addCheck(name: string, checkFn: () => Promise<boolean>, interval: number = 30000) {
    this.checks.push({
      name,
      checkFn,
      interval,
      lastChecked: 0
    });
    
    this.log.info('Health check added', {
      name,
      interval,
      timestamp: new Date().toISOString()
    });
  }
  
  // 执行所有健康检查
  async runAllChecks() {
    this.log.info('Running all health checks', {
      checkCount: this.checks.length,
      timestamp: new Date().toISOString()
    });
    
    const results = await Promise.all(
      this.checks.map(async (check) => {
        const startTime = Date.now();
        
        try {
          const isHealthy = await check.checkFn();
          const duration = Date.now() - startTime;
          
          this.log[isHealthy ? 'info' : 'warn']('Health check completed', {
            name: check.name,
            healthy: isHealthy,
            duration,
            timestamp: new Date().toISOString()
          });
          
          check.lastChecked = Date.now();
          
          return {
            name: check.name,
            healthy: isHealthy,
            duration,
            timestamp: new Date().toISOString()
          };
        } catch (error: any) {
          const duration = Date.now() - startTime;
          
          this.log.error('Health check error', {
            name: check.name,
            error: error.message,
            duration,
            timestamp: new Date().toISOString()
          });
          
          return {
            name: check.name,
            healthy: false,
            duration,
            error: error.message,
            timestamp: new Date().toISOString()
          };
        }
      })
    );
    
    const healthyCount = results.filter(r => r.healthy).length;
    const totalCount = results.length;
    
    this.log.info('Health checks summary', {
      total: totalCount,
      healthy: healthyCount,
      unhealthy: totalCount - healthyCount,
      healthyPercentage: totalCount > 0 ? (healthyCount / totalCount) * 100 : 0,
      timestamp: new Date().toISOString()
    });
    
    return results;
  }
  
  // 开始定期健康检查
  startPeriodicChecks() {
    this.log.info('Starting periodic health checks', {
      checkCount: this.checks.length,
      timestamp: new Date().toISOString()
    });
    
    // 为每个检查设置定时器
    this.checks.forEach(check => {
      setInterval(async () => {
        if (Date.now() - check.lastChecked >= check.interval) {
          await this.runSingleCheck(check.name);
        }
      }, check.interval);
    });
  }
  
  private async runSingleCheck(name: string) {
    const check = this.checks.find(c => c.name === name);
    if (!check) {
      this.log.warn('Health check not found', { name });
      return null;
    }
    
    const startTime = Date.now();
    
    try {
      const isHealthy = await check.checkFn();
      const duration = Date.now() - startTime;
      
      this.log[isHealthy ? 'info' : 'warn']('Periodic health check', {
        name: check.name,
        healthy: isHealthy,
        duration,
        interval: check.interval,
        timestamp: new Date().toISOString()
      });
      
      check.lastChecked = Date.now();
      
      return isHealthy;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      this.log.error('Periodic health check error', {
        name: check.name,
        error: error.message,
        duration,
        timestamp: new Date().toISOString()
      });
      
      return false;
    }
  }
}

// 使用健康检查服务
const healthService = new HealthCheckService();

// 添加各种健康检查
healthService.addCheck('Database Connection', async () => {
  // 模拟数据库连接检查
  return new Promise(resolve => {
    setTimeout(() => resolve(Math.random() > 0.1), 100); // 90% 成功率
  });
}, 60000); // 每分钟检查一次

healthService.addCheck('External API', async () => {
  // 模拟外部 API 检查
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 200);
  });
}, 30000); // 每30秒检查一次

healthService.addCheck('Disk Space', async () => {
  // 模拟磁盘空间检查
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 50);
  });
}, 120000); // 每2分钟检查一次

// 运行一次健康检查
healthService.runAllChecks().then(results => {
  console.log('Health check results:', results);
});

// 开始定期检查
healthService.startPeriodicChecks();
```

## 日志聚合和分析

### 日志聚合服务

```typescript
// 日志聚合和分析服务
class LogAggregationService {
  private log = getLog('LogAggregator');
  private logBuffer: LogEntry[] = [];
  private aggregationRules: Array<{
    name: string;
    condition: (entry: LogEntry) => boolean;
    action: (entries: LogEntry[]) => void;
  }> = [];
  
  // 添加聚合规则
  addRule(name: string, condition: (entry: LogEntry) => boolean, action: (entries: LogEntry[]) => void) {
    this.aggregationRules.push({ name, condition, action });
    this.log.info('Aggregation rule added', { name });
  }
  
  // 处理日志条目
  processLogEntry(entry: LogEntry) {
    // 添加到缓冲区
    this.logBuffer.push(entry);
    
    // 限制缓冲区大小
    if (this.logBuffer.length > 1000) {
      this.logBuffer = this.logBuffer.slice(-500); // 保留最新的500条
    }
    
    // 检查是否符合任何聚合规则
    this.aggregationRules.forEach(rule => {
      if (rule.condition(entry)) {
        const matchingEntries = this.logBuffer.filter(rule.condition);
        rule.action(matchingEntries);
      }
    });
  }
  
  // 获取统计信息
  getStats(period: 'hour' | 'day' | 'week' = 'day') {
    const now = Date.now();
    const periodMs = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000
    }[period];
    
    const cutoffTime = now - periodMs;
    const recentLogs = this.logBuffer.filter(log => new Date(log.time).getTime() > cutoffTime);
    
    const stats = {
      total: recentLogs.length,
      byLevel: {} as Record<string, number>,
      byContext: {} as Record<string, number>,
      errors: recentLogs.filter(log => log.level === 'error').length,
      warnings: recentLogs.filter(log => log.level === 'warn').length
    };
    
    // 按级别统计
    recentLogs.forEach(log => {
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
      stats.byContext[log.context] = (stats.byContext[log.context] || 0) + 1;
    });
    
    this.log.info('Log statistics generated', {
      period,
      stats,
      timestamp: new Date().toISOString()
    });
    
    return stats;
  }
  
  // 错误率检测规则
  setupErrorRateMonitoring() {
    this.addRule(
      'High Error Rate Detection',
      (entry) => entry.level === 'error',
      (errorEntries) => {
        const recentErrors = errorEntries.filter(
          entry => Date.now() - new Date(entry.time).getTime() < 5 * 60 * 1000 // 5分钟内
        );
        
        if (recentErrors.length > 10) { // 5分钟内超过10个错误
          this.log.error('HIGH ERROR RATE ALERT', {
            errorCount: recentErrors.length,
            timeframe: '5 minutes',
            lastErrors: recentErrors.slice(-5).map(e => ({
              message: e.message,
              context: e.context,
              time: e.time
            }))
          });
        }
      }
    );
  }
}

// 使用日志聚合服务
const logAggregator = new LogAggregationService();
logAggregator.setupErrorRateMonitoring();

// 模拟处理日志条目
const sampleLogEntries: LogEntry[] = [
  {
    level: 'info',
    time: new Date(),
    context: 'UserService',
    message: 'User logged in',
    meta: { userId: '123', ip: '192.168.1.1' }
  },
  {
    level: 'error',
    time: new Date(),
    context: 'PaymentService',
    message: 'Payment failed',
    meta: { userId: '456', amount: 99.99, error: 'Insufficient funds' }
  }
];

sampleLogEntries.forEach(entry => logAggregator.processLogEntry(entry));

// 获取统计信息
const stats = logAggregator.getStats('day');
console.log('Log statistics:', stats);
```

这些日志示例展示了如何在实际项目中使用 NucleusX 日志系统的各种功能，包括基础日志记录、高级传输器、结构化日志、性能监控和日志聚合分析等。通过这些示例，您可以构建出功能完善、可扩展的日志系统。