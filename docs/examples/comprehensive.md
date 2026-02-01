# 综合示例

本章提供 NucleusX 的综合应用示例，展示如何将各个模块结合使用。

## 完整的电商应用示例

### 应用入口和初始化

```typescript
import { createRuntime, type IKit } from '@nucleusx/core';
import { ConsoleTransport, StorageTransport } from '@nucleusx/core';
import { getLog } from '@nucleusx/core';

// 应用日志记录器
const appLog = getLog('App');

// 1. 定义平台桥接器
const platformBridge = {
  // 消息提示
  showToast: (options: any) => wx.showToast(options),
  showLoading: (options: any) => wx.showLoading(options),
  hideLoading: () => wx.hideLoading(),
  showModal: (options: any) => wx.showModal(options),
  
  // 存储
  getStorageSync: (key: string) => wx.getStorageSync(key),
  setStorageSync: (key: string, data: any) => wx.setStorageSync(key, data),
  removeStorageSync: (key: string) => wx.removeStorageSync(key),
  clearStorageSync: () => wx.clearStorageSync(),
  
  // 系统信息
  getSystemInfo: () => wx.getSystemInfoSync(),
  
  // 导航
  navigateTo: (options: any) => wx.navigateTo(options),
  redirectTo: (options: any) => wx.redirectTo(options),
  navigateBack: (options: any) => wx.navigateBack(options),
};

// 2. 定义请求适配器
const requestAdapter = {
  request: (config: any) => {
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.url,
        method: config.method || 'GET',
        data: config.data,
        header: config.headers,
        timeout: config.timeout,
        success: (res) => {
          appLog.debug('Request successful', {
            url: config.url,
            statusCode: res.statusCode,
            duration: res.profile?.sslConnectionTime
          });
          resolve(res);
        },
        fail: (err) => {
          appLog.error('Request failed', {
            url: config.url,
            error: err.errMsg,
            timestamp: new Date().toISOString()
          });
          reject(err);
        }
      });
    });
  }
};

// 3. 定义状态管理引擎（简化版）
const storeEngine = {
  define: (id: string, options: any) => {
    // 实际项目中会桥接到 Pinia 或 MobX
    return {
      ...options.state(),
      ...options.actions,
      // 添加计算属性
      ...Object.entries(options.getters || {}).reduce((acc: any, [key, getter]) => {
        acc[key] = typeof getter === 'function' ? getter : getter;
        return acc;
      }, {})
    };
  }
};

// 4. 创建 Kit 配置
const createKit = async (): Promise<IKit> => {
  appLog.info('Preparing application kit', {
    timestamp: new Date().toISOString()
  });
  
  // 异步获取配置
  const [pagesConfig, userPermissions] = await Promise.all([
    fetchPagesConfig(),
    fetchUserPermissions()
  ]);
  
  const kit: IKit = {
    platformBridge,
    storeEngine,
    request: {
      baseUrl: process.env.API_BASE_URL || 'https://api.shop.example.com',
      adapter: requestAdapter,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'X-App-Version': '1.0.0',
        'X-Client-Type': 'mini-program'
      },
      isBizSuccess: (response) => {
        return response.statusCode === 200 && 
               response.data && 
               (response.data.code === 0 || response.data.code === 200);
      },
      errorMode: 'wrapped' as const
    },
    router: {
      mode: 'auto' as const,
      pagesFetcher: () => Promise.resolve(pagesConfig),
      userPermissionsProvider: () => userPermissions,
      appConfig: { 
        startPage: 'home',
        defaultTransition: 'slide'
      },
      animation: {
        duration: 300,
        easing: 'ease-in-out',
        enabled: true,
        type: 'slide' as const
      }
    },
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
      transports: [
        new ConsoleTransport(),
        new StorageTransport({ maxEntries: 2000 })
      ],
      defaultContext: 'ShopApp'
    },
    appInfo: {
      appId: process.env.APP_ID || 'shop-app',
      name: 'Shop Application',
      version: '1.0.0',
    }
  };
  
  appLog.info('Application kit prepared successfully', {
    hasPages: !!pagesConfig,
    permissionsCount: userPermissions.length,
    timestamp: new Date().toISOString()
  });
  
  return kit;
};

// 辅助函数
async function fetchPagesConfig() {
  // 实际项目中从服务器获取页面配置
  return [
    { path: '/pages/home/index', name: 'home', component: 'pages/Home' },
    { path: '/pages/products/index', name: 'products', component: 'pages/Products' },
    { path: '/pages/product-detail/index', name: 'product-detail', component: 'pages/ProductDetail' },
    { path: '/pages/cart/index', name: 'cart', component: 'pages/Cart' },
    { path: '/pages/checkout/index', name: 'checkout', component: 'pages/Checkout' },
    { path: '/pages/profile/index', name: 'profile', component: 'pages/Profile' },
    { path: '/pages/login/index', name: 'login', component: 'pages/Login' },
    { path: '/pages/register/index', name: 'register', component: 'pages/Register' }
  ];
}

async function fetchUserPermissions() {
  // 实际项目中从存储或服务器获取用户权限
  return wx.getStorageSync('user_permissions') || [];
}

// 5. 初始化应用
export async function initializeApp() {
  appLog.info('Initializing Shop Application', {
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
  
  try {
    const kit = await createKit();
    const runtime = await createRuntime(kit);
    
    appLog.info('Application initialized successfully', {
      hasRequest: !!runtime.request,
      hasRouter: !!runtime.router,
      hasLogger: !!runtime.logger,
      timestamp: new Date().toISOString()
    });
    
    // 将运行时实例保存到全局
    (globalThis as any).__SHOP_RUNTIME__ = runtime;
    
    // 设置全局错误处理
    setupGlobalErrorHandling(runtime);
    
    return runtime;
  } catch (error: any) {
    appLog.error('Application initialization failed', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    throw error;
  }
}

// 全局错误处理设置
function setupGlobalErrorHandling(runtime: any) {
  const { logger } = runtime;
  
  // 设置未捕获错误处理
  if (typeof wx !== 'undefined' && wx.onError) {
    wx.onError((error) => {
      logger.error('Uncaught error', {
        error: error,
        timestamp: new Date().toISOString()
      });
    });
  }
  
  // 设置 Promise 拒绝处理
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      logger.error('Unhandled promise rejection', {
        reason: event.reason,
        timestamp: new Date().toISOString()
      });
    });
  }
}
```

### 用户认证模块

```typescript
import { defineStore } from '@nucleusx/core';
import { getLog } from '@nucleusx/core';

// 用户认证相关的 Store
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: null as string | null,
    isAuthenticated: false,
    isCheckingAuth: false,
    loginAttempts: 0,
    permissions: [] as string[],
    refreshToken: null as string | null
  }),
  
  getters: {
    displayName(): string {
      return this.user?.name || this.user?.username || 'Guest';
    },
    
    hasPermission: (state) => (permission: string) => {
      return state.permissions.includes(permission);
    },
    
    canAccessAdmin(): boolean {
      return this.isAuthenticated && this.hasPermission('admin');
    },
    
    authStatus(): 'authenticated' | 'unauthenticated' | 'checking' {
      if (this.isCheckingAuth) return 'checking';
      return this.isAuthenticated ? 'authenticated' : 'unauthenticated';
    }
  },
  
  actions: {
    // 登录
    async login(credentials: { username: string; password: string }) {
      const log = getLog('AuthStore');
      log.info('Login initiated', { username: credentials.username });
      
      this.loginAttempts++;
      
      try {
        const { request } = (globalThis as any).__SHOP_RUNTIME__;
        
        const response = await request.post('/auth/login', {
          username: credentials.username,
          password: credentials.password
        });
        
        if (response.data.success) {
          this.user = response.data.user;
          this.token = response.data.token;
          this.refreshToken = response.data.refreshToken;
          this.isAuthenticated = true;
          this.loginAttempts = 0;
          this.permissions = response.data.permissions || [];
          
          // 保存到本地存储
          this.saveAuthToStorage();
          
          log.info('Login successful', { 
            userId: this.user.id,
            permissionsCount: this.permissions.length
          });
          
          return response.data;
        } else {
          throw new Error(response.data.message || 'Login failed');
        }
      } catch (error: any) {
        log.error('Login failed', {
          username: credentials.username,
          error: error.message,
          attemptNumber: this.loginAttempts
        });
        
        throw error;
      }
    },
    
    // 登出
    async logout() {
      const log = getLog('AuthStore');
      log.info('Logout initiated', { userId: this.user?.id });
      
      try {
        const { request } = (globalThis as any).__SHOP_RUNTIME__;
        
        // 通知服务器登出
        await request.post('/auth/logout', {
          token: this.token
        }).catch(() => {
          // 即使登出 API 失败也继续清理本地状态
        });
        
        // 清理本地状态
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        this.permissions = [];
        this.refreshToken = null;
        
        // 清理本地存储
        this.clearAuthFromStorage();
        
        log.info('Logout completed');
      } catch (error: any) {
        log.error('Logout error', { error: error.message });
        // 即使出现错误也要清理本地状态
        this.clearLocalAuthState();
      }
    },
    
    // 检查认证状态
    async checkAuthStatus() {
      const log = getLog('AuthStore');
      log.info('Checking authentication status');
      
      this.isCheckingAuth = true;
      
      try {
        // 首先检查本地存储
        this.loadAuthFromStorage();
        
        if (this.token) {
          // 验证令牌有效性
          const { request } = (globalThis as any).__SHOP_RUNTIME__;
          
          const response = await request.get('/auth/verify', {
            headers: { Authorization: `Bearer ${this.token}` }
          });
          
          if (response.data.valid) {
            this.user = response.data.user;
            this.isAuthenticated = true;
            this.permissions = response.data.permissions || [];
            
            log.info('Authentication verified', { 
              userId: this.user.id,
              permissionsCount: this.permissions.length
            });
          } else {
            // 令牌无效，清理状态
            this.clearLocalAuthState();
            log.info('Stored token invalid, cleared auth state');
          }
        } else {
          log.info('No stored token found');
        }
      } catch (error: any) {
        log.error('Auth status check failed', { error: error.message });
        this.clearLocalAuthState();
      } finally {
        this.isCheckingAuth = false;
      }
    },
    
    // 刷新令牌
    async refreshTokenIfNeeded() {
      const log = getLog('AuthStore');
      
      if (!this.refreshToken) {
        log.debug('No refresh token available');
        return false;
      }
      
      try {
        const { request } = (globalThis as any).__SHOP_RUNTIME__;
        
        const response = await request.post('/auth/refresh', {
          refreshToken: this.refreshToken
        });
        
        if (response.data.success) {
          this.token = response.data.token;
          this.refreshToken = response.data.newRefreshToken;
          
          // 更新本地存储
          this.saveAuthToStorage();
          
          log.info('Token refreshed successfully');
          return true;
        } else {
          log.warn('Token refresh failed', { message: response.data.message });
          return false;
        }
      } catch (error: any) {
        log.error('Token refresh error', { error: error.message });
        return false;
      }
    },
    
    // 私有辅助方法
    private saveAuthToStorage() {
      if (typeof wx !== 'undefined') {
        wx.setStorageSync('auth_user', this.user);
        wx.setStorageSync('auth_token', this.token);
        wx.setStorageSync('auth_refresh_token', this.refreshToken);
        wx.setStorageSync('auth_permissions', this.permissions);
      }
    },
    
    private loadAuthFromStorage() {
      if (typeof wx !== 'undefined') {
        this.user = wx.getStorageSync('auth_user') || null;
        this.token = wx.getStorageSync('auth_token') || null;
        this.refreshToken = wx.getStorageSync('auth_refresh_token') || null;
        this.permissions = wx.getStorageSync('auth_permissions') || [];
        this.isAuthenticated = !!(this.token && this.user);
      }
    },
    
    private clearAuthFromStorage() {
      if (typeof wx !== 'undefined') {
        wx.removeStorageSync('auth_user');
        wx.removeStorageSync('auth_token');
        wx.removeStorageSync('auth_refresh_token');
        wx.removeStorageSync('auth_permissions');
      }
    },
    
    private clearLocalAuthState() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.permissions = [];
      this.refreshToken = null;
      this.clearAuthFromStorage();
    }
  }
});
```

### 产品管理模块

```typescript
import { defineStore } from '@nucleusx/core';
import { getLog } from '@nucleusx/core';
import { useAuthStore } from './auth';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    categories: [] as string[],
    featuredProducts: [] as Product[],
    selectedProduct: null as Product | null,
    isLoading: false,
    error: null as string | null,
    filters: {
      category: '' as string | '',
      minPrice: 0,
      maxPrice: Infinity,
      sortBy: 'name' as 'name' | 'price' | 'rating' | 'createdAt',
      sortOrder: 'asc' as 'asc' | 'desc'
    },
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0
    }
  }),
  
  getters: {
    // 过滤和排序后的产品列表
    filteredProducts(): Product[] {
      let result = [...this.products];
      
      // 应用类别过滤
      if (this.filters.category) {
        result = result.filter(p => p.category === this.filters.category);
      }
      
      // 应用价格范围过滤
      result = result.filter(p => 
        p.price >= this.filters.minPrice && p.price <= this.filters.maxPrice
      );
      
      // 应用排序
      result.sort((a, b) => {
        let compareValue = 0;
        
        switch (this.filters.sortBy) {
          case 'name':
            compareValue = a.name.localeCompare(b.name);
            break;
          case 'price':
            compareValue = a.price - b.price;
            break;
          case 'rating':
            compareValue = b.rating - a.rating; // 评分高的在前
            break;
          case 'createdAt':
            compareValue = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            break;
        }
        
        return this.filters.sortOrder === 'asc' ? compareValue : -compareValue;
      });
      
      return result;
    },
    
    // 分页后的产品列表
    paginatedProducts(): Product[] {
      const start = (this.pagination.page - 1) * this.pagination.pageSize;
      const end = start + this.pagination.pageSize;
      return this.filteredProducts.slice(start, end);
    },
    
    // 产品统计
    productStats(): any {
      return {
        totalProducts: this.products.length,
        totalCategories: new Set(this.products.map(p => p.category)).size,
        avgRating: this.products.length > 0 
          ? this.products.reduce((sum, p) => sum + p.rating, 0) / this.products.length 
          : 0,
        totalStock: this.products.reduce((sum, p) => sum + p.stock, 0),
        featuredCount: this.featuredProducts.length
      };
    },
    
    // 按类别分组的产品
    productsByCategory(): Record<string, Product[]> {
      return this.products.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
      }, {} as Record<string, Product[]>);
    }
  },
  
  actions: {
    // 加载产品列表
    async loadProducts(filters: Partial<typeof this.filters> = {}) {
      const log = getLog('ProductStore');
      log.info('Loading products', { filters });
      
      this.isLoading = true;
      this.error = null;
      
      try {
        // 合并过滤器
        this.filters = { ...this.filters, ...filters };
        
        const { request } = (globalThis as any).__SHOP_RUNTIME__;
        
        const queryParams = new URLSearchParams({
          page: this.pagination.page.toString(),
          pageSize: this.pagination.pageSize.toString(),
          category: this.filters.category,
          minPrice: this.filters.minPrice.toString(),
          maxPrice: this.filters.maxPrice.toString(),
          sortBy: this.filters.sortBy,
          sortOrder: this.filters.sortOrder
        }).toString();
        
        const response = await request.get(`/api/products?${queryParams}`);
        
        this.products = response.data.products || [];
        this.categories = response.data.categories || [];
        this.featuredProducts = response.data.featuredProducts || [];
        this.pagination.total = response.data.total || 0;
        
        log.info('Products loaded successfully', {
          productCount: this.products.length,
          categoryCount: this.categories.length,
          featuredCount: this.featuredProducts.length
        });
      } catch (error: any) {
        this.error = error.message;
        log.error('Failed to load products', { error: error.message });
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // 获取单个产品
    async getProduct(productId: string) {
      const log = getLog('ProductStore');
      log.info('Loading product', { productId });
      
      this.isLoading = true;
      this.error = null;
      
      try {
        const { request } = (globalThis as any).__SHOP_RUNTIME__;
        
        const response = await request.get(`/api/products/${productId}`);
        
        this.selectedProduct = response.data.product;
        
        log.info('Product loaded successfully', { productId });
        return response.data.product;
      } catch (error: any) {
        this.error = error.message;
        log.error('Failed to load product', { productId, error: error.message });
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // 搜索产品
    async searchProducts(query: string) {
      const log = getLog('ProductStore');
      log.info('Searching products', { query });
      
      this.isLoading = true;
      this.error = null;
      
      try {
        const { request } = (globalThis as any).__SHOP_RUNTIME__;
        
        const response = await request.get(`/api/products/search?q=${encodeURIComponent(query)}`);
        
        this.products = response.data.results || [];
        this.pagination.total = response.data.total || 0;
        
        log.info('Search completed', {
          query,
          resultCount: this.products.length,
          total: this.pagination.total
        });
      } catch (error: any) {
        this.error = error.message;
        log.error('Search failed', { query, error: error.message });
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // 添加产品评价
    async addReview(productId: string, review: {
      rating: number;
      comment: string;
      userId: string;
    }) {
      const log = getLog('ProductStore');
      log.info('Adding product review', { productId, ...review });
      
      try {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) {
          throw new Error('User not authenticated');
        }
        
        const { request } = (globalThis as any).__SHOP_RUNTIME__;
        
        const response = await request.post(`/api/products/${productId}/reviews`, {
          ...review,
          userId: authStore.user.id
        });
        
        // 更新本地产品信息
        const productIndex = this.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
          this.products[productIndex] = {
            ...this.products[productIndex],
            rating: response.data.updatedRating,
            reviewsCount: response.data.updatedReviewsCount
          };
        }
        
        if (this.selectedProduct?.id === productId) {
          this.selectedProduct = {
            ...this.selectedProduct,
            rating: response.data.updatedRating,
            reviewsCount: response.data.updatedReviewsCount
          };
        }
        
        log.info('Review added successfully', { 
          productId, 
          newRating: response.data.updatedRating 
        });
        
        return response.data;
      } catch (error: any) {
        log.error('Failed to add review', { productId, error: error.message });
        throw error;
      }
    },
    
    // 更新过滤器
    updateFilters(newFilters: Partial<typeof this.filters>) {
      this.filters = { ...this.filters, ...newFilters };
      this.pagination.page = 1; // 重置到第一页
    },
    
    // 更新分页
    updatePagination(page: number) {
      this.pagination.page = page;
    }
  }
});
```

### 购物车模块

```typescript
import { defineStore } from '@nucleusx/core';
import { getLog } from '@nucleusx/core';
import { useProductStore } from './product';
import { useAuthStore } from './auth';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  attributes?: Record<string, any>;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isSyncing: false,
    lastSyncedAt: null as string | null,
    discountCode: null as string | null,
    appliedDiscountPercent: 0,
    appliedDiscountAmount: 0,
    shippingCost: 0,
    taxRate: 0.08, // 8% 税率
    couponApplied: null as any,
    isCheckoutLoading: false,
    checkoutError: null as string | null
  }),
  
  getters: {
    // 商品数量
    itemCount(): number {
      return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    
    // 商品种类数量
    itemTypesCount(): number {
      return this.items.length;
    },
    
    // 小计
    subtotal(): number {
      return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    // 折扣金额
    discountAmount(): number {
      if (this.discountCode) {
        return this.subtotal * (this.appliedDiscountPercent / 100);
      }
      return this.appliedDiscountAmount;
    },
    
    // 税费
    taxAmount(): number {
      const baseAmount = this.subtotal - this.discountAmount;
      return baseAmount * this.taxRate;
    },
    
    // 含税总额
    totalWithTax(): number {
      const baseAmount = this.subtotal - this.discountAmount;
      return baseAmount + this.taxAmount + this.shippingCost;
    },
    
    // 是否为空
    isEmpty(): boolean {
      return this.items.length === 0;
    },
    
    // 购物车摘要
    cartSummary(): any {
      return {
        itemCount: this.itemCount,
        itemTypesCount: this.itemTypesCount,
        subtotal: this.subtotal,
        discount: this.discountAmount,
        tax: this.taxAmount,
        shipping: this.shippingCost,
        total: this.totalWithTax,
        isEmpty: this.isEmpty
      };
    }
  },
  
  actions: {
    // 添加商品到购物车
    async addItem(productId: string, quantity: number = 1, attributes: Record<string, any> = {}) {
      const log = getLog('CartStore');
      log.info('Adding item to cart', { productId, quantity, attributes });
      
      try {
        const productStore = useProductStore();
        const product = productStore.products.find(p => p.id === productId);
        
        if (!product) {
          // 如果产品不在本地缓存中，尝试获取
          await productStore.getProduct(productId);
          const updatedProduct = productStore.selectedProduct;
          if (!updatedProduct) {
            throw new Error(`Product not found: ${productId}`);
          }
          
          // 添加到购物车
          this.addItemToCart(updatedProduct, quantity, attributes);
        } else {
          this.addItemToCart(product, quantity, attributes);
        }
        
        log.info('Item added to cart successfully', { 
          productId, 
          quantity, 
          newCount: this.itemCount 
        });
        
        await this.syncCart();
      } catch (error: any) {
        log.error('Failed to add item to cart', { productId, error: error.message });
        throw error;
      }
    },
    
    // 内部添加商品方法
    private addItemToCart(product: any, quantity: number, attributes: Record<string, any>) {
      const existingItem = this.items.find(item => 
        item.productId === product.id && 
        JSON.stringify(item.attributes) === JSON.stringify(attributes)
      );
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({
          id: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.images?.[0],
          attributes
        });
      }
    },
    
    // 更新商品数量
    async updateItemQuantity(itemId: string, newQuantity: number) {
      const log = getLog('CartStore');
      log.info('Updating item quantity', { itemId, newQuantity });
      
      if (newQuantity <= 0) {
        await this.removeItem(itemId);
        return;
      }
      
      const item = this.items.find(i => i.id === itemId);
      if (item) {
        item.quantity = newQuantity;
        await this.syncCart();
        log.info('Item quantity updated', { itemId, newQuantity });
      }
    },
    
    // 移除商品
    async removeItem(itemId: string) {
      const log = getLog('CartStore');
      log.info('Removing item from cart', { itemId });
      
      this.items = this.items.filter(item => item.id !== itemId);
      await this.syncCart();
      log.info('Item removed from cart', { itemId });
    },
    
    // 清空购物车
    async clearCart() {
      const log = getLog('CartStore');
      log.info('Clearing cart');
      
      this.items = [];
      this.discountCode = null;
      this.appliedDiscountPercent = 0;
      this.appliedDiscountAmount = 0;
      this.couponApplied = null;
      
      await this.syncCart();
      log.info('Cart cleared');
    },
    
    // 应用折扣码
    async applyDiscountCode(code: string) {
      const log = getLog('CartStore');
      log.info('Applying discount code', { code });
      
      try {
        const { request } = (globalThis as any).__SHOP_RUNTIME__;
        
        const response = await request.post('/api/discounts/validate', {
          code,
          cartSubtotal: this.subtotal
        });
        
        if (response.data.valid) {
          this.discountCode = code;
          this.appliedDiscountPercent = response.data.percent || 0;
          this.appliedDiscountAmount = response.data.amount || 0;
          this.couponApplied = response.data.coupon;
          
          await this.syncCart();
          
          log.info('Discount code applied successfully', {
            code,
            percent: this.appliedDiscountPercent,
            amount: this.appliedDiscountAmount
          });
          
          return { success: true, ...response.data };
        } else {
          log.warn('Invalid discount code', { code });
          return { success: false, message: response.data.message || 'Invalid discount code' };
        }
      } catch (error: any) {
        log.error('Failed to apply discount code', { code, error: error.message });
        return { success: false, message: error.message };
      }
    },
    
    // 移除折扣码
    removeDiscountCode() {
      const log = getLog('CartStore');
      log.info('Removing discount code');
      
      this.discountCode = null;
      this.appliedDiscountPercent = 0;
      this.appliedDiscountAmount = 0;
      this.couponApplied = null;
    },
    
    // 同步购物车到服务器
    async syncCart() {
      const log = getLog('CartStore');
      
      if (!this.items.length && !this.discountCode) {
        // 如果购物车为空，删除服务器上的记录
        await this.clearServerCart();
        return;
      }
      
      this.isSyncing = true;
      
      try {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) {
          // 未登录用户，保存到本地存储
          this.saveCartToLocal();
          return;
        }
        
        const { request } = (globalThis as any).__SHOP_RUNTIME__;
        
        const cartData = {
          items: this.items,
          discountCode: this.discountCode,
          shippingAddress: null // 这将在结账时提供
        };
        
        await request.post('/api/cart/sync', cartData);
        
        this.lastSyncedAt = new Date().toISOString();
        log.info('Cart synced to server', { 
          itemCount: this.itemCount, 
          syncedAt: this.lastSyncedAt 
        });
      } catch (error: any) {
        log.error('Cart sync failed', { error: error.message });
        // 失败时仍保存到本地
        this.saveCartToLocal();
      } finally {
        this.isSyncing = false;
      }
    },
    
    // 从服务器加载购物车
    async loadCart() {
      const log = getLog('CartStore');
      log.info('Loading cart from server');
      
      try {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) {
          // 未登录用户，从本地存储加载
          this.loadCartFromLocal();
          return;
        }
        
        const { request } = (globalThis as any).__SHOP_RUNTIME__;
        
        const response = await request.get('/api/cart');
        
        if (response.data.cart) {
          this.items = response.data.cart.items || [];
          this.discountCode = response.data.cart.discountCode || null;
          this.appliedDiscountPercent = response.data.cart.appliedDiscountPercent || 0;
          this.appliedDiscountAmount = response.data.cart.appliedDiscountAmount || 0;
          this.lastSyncedAt = response.data.cart.lastSyncedAt || null;
        } else {
          // 服务器上没有购物车，尝试从本地加载
          this.loadCartFromLocal();
        }
        
        log.info('Cart loaded successfully', { itemCount: this.items.length });
      } catch (error: any) {
        log.error('Failed to load cart from server', { error: error.message });
        // 加载失败时从本地存储加载
        this.loadCartFromLocal();
      }
    },
    
    // 结账
    async checkout(orderData: {
      shippingAddress: any;
      billingAddress: any;
      paymentMethod: any;
      notes?: string;
    }) {
      const log = getLog('CartStore');
      log.info('Starting checkout process');
      
      if (this.isEmpty) {
        throw new Error('Cannot checkout: cart is empty');
      }
      
      this.isCheckoutLoading = true;
      this.checkoutError = null;
      
      try {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) {
          throw new Error('User must be logged in to checkout');
        }
        
        const { request, router } = (globalThis as any).__SHOP_RUNTIME__;
        
        const checkoutPayload = {
          items: this.items,
          subtotal: this.subtotal,
          discount: this.discountAmount,
          tax: this.taxAmount,
          shipping: this.shippingCost,
          total: this.totalWithTax,
          discountCode: this.discountCode,
          shippingAddress: orderData.shippingAddress,
          billingAddress: orderData.billingAddress,
          paymentMethod: orderData.paymentMethod,
          notes: orderData.notes,
          userId: authStore.user.id
        };
        
        log.info('Sending checkout request', {
          itemCount: this.items.length,
          total: this.totalWithTax
        });
        
        const response = await request.post('/api/orders/create', checkoutPayload);
        
        if (response.data.success) {
          // 结账成功，清空购物车
          await this.clearCart();
          
          log.info('Checkout completed successfully', {
            orderId: response.data.orderId,
            total: this.totalWithTax
          });
          
          // 可以导航到订单确认页面
          // router.to({ url: 'order-confirmation', param: { orderId: response.data.orderId } });
          
          return response.data;
        } else {
          throw new Error(response.data.message || 'Checkout failed');
        }
      } catch (error: any) {
        this.checkoutError = error.message;
        log.error('Checkout failed', { error: error.message });
        throw error;
      } finally {
        this.isCheckoutLoading = false;
      }
    },
    
    // 私有辅助方法
    private saveCartToLocal() {
      if (typeof wx !== 'undefined') {
        wx.setStorageSync('user_cart', {
          items: this.items,
          discountCode: this.discountCode,
          appliedDiscountPercent: this.appliedDiscountPercent,
          appliedDiscountAmount: this.appliedDiscountAmount,
          lastUpdated: new Date().toISOString()
        });
      }
    },
    
    private loadCartFromLocal() {
      if (typeof wx !== 'undefined') {
        const savedCart = wx.getStorageSync('user_cart');
        if (savedCart) {
          this.items = savedCart.items || [];
          this.discountCode = savedCart.discountCode || null;
          this.appliedDiscountPercent = savedCart.appliedDiscountPercent || 0;
          this.appliedDiscountAmount = savedCart.appliedDiscountAmount || 0;
        }
      }
    },
    
    private async clearServerCart() {
      try {
        const { request } = (globalThis as any).__SHOP_RUNTIME__;
        await request.delete('/api/cart');
      } catch (error) {
        // 忽略清除服务器购物车的错误
        console.warn('Failed to clear server cart:', error);
      }
    }
  }
});
```

### 订单管理模块

```typescript
import { defineStore } from '@nucleusx/core';
import { getLog } from '@nucleusx/core';
import { useAuthStore } from './auth';
import { useCartStore } from './cart';

export interface Order {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    attributes?: Record<string, any>;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  shippingAddress: any;
  billingAddress: any;
  paymentMethod: any;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as Order[],
    currentOrder: null as Order | null,
    isLoading: false,
    error: null as string | null,
    filters: {
      status: '' as '' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded',
      dateRange: { start: '', end: '' },
      sortBy: 'createdAt' as 'createdAt' | 'total' | 'status',
      sortOrder: 'desc' as 'asc' | 'desc'
    },
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0
    }
  }),
  
  getters: {
    // 过滤后的订单
    filteredOrders(): Order[] {
      let result = [...this.orders];
      
      // 按状态过滤
      if (this.filters.status) {
        result = result.filter(order => order.status === this.filters.status);
      }
      
      // 按日期范围过滤
      if (this.filters.dateRange.start && this.filters.dateRange.end) {
        const startDate = new Date(this.filters.dateRange.start).getTime();
        const endDate = new Date(this.filters.dateRange.end).getTime();
        
        result = result.filter(order => {
          const orderDate = new Date(order.createdAt).getTime();
          return orderDate >= startDate && orderDate <= endDate;
        });
      }
      
      // 排序
      result.sort((a, b) => {
        let compareValue = 0;
        
        switch (this.filters.sortBy) {
          case 'createdAt':
            compareValue = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            break;
          case 'total':
            compareValue = b.total - a.total;
            break;
          case 'status':
            compareValue = a.status.localeCompare(b.status);
            break;
        }
        
        return this.filters.sortOrder === 'asc' ? compareValue : -compareValue;
      });
      
      return result;
    },
    
    // 分页后的订单
    paginatedOrders(): Order[] {
      const start = (this.pagination.page - 1) * this.pagination.pageSize;
      const end = start + this.pagination.pageSize;
      return this.filteredOrders.slice(start, end);
    },
    
    // 订单统计
    orderStats(): any {
      const stats = {
        totalOrders: this.orders.length,
        totalRevenue: this.orders.reduce((sum, order) => sum + order.total, 0),
        statusCounts: {} as Record<string, number>,
        monthlyRevenue: {} as Record<string, number>
      };
      
      // 统计各状态订单数
      this.orders.forEach(order => {
        stats.statusCounts[order.status] = (stats.statusCounts[order.status] || 0) + 1;
        
        // 按月统计收入
        const monthKey = new Date(order.createdAt).toISOString().substring(0, 7); // YYYY-MM
        stats.monthlyRevenue[monthKey] = (stats.monthlyRevenue[monthKey] || 0) + order.total;
      });
      
      return stats;
    }
  },
  
  actions: {
    // 获取用户订单列表
    async getUserOrders() {
      const log = getLog('OrderStore');
      log.info('Loading user orders');
      
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        throw new Error('User not authenticated');
      }
      
      this.isLoading = true;
      this.error = null;
      
      try {
        const { request } = (globalThis as any).__SHOP_RUNTIME__;
        
        const response = await request.get('/api/orders', {
          params: {
            userId: authStore.user.id,
            page: this.pagination.page,
            pageSize: this.pagination.pageSize,
            status: this.filters.status,
            sortBy: this.filters.sortBy,
            sortOrder: this.filters.sortOrder
          }
        });
        
        this.orders = response.data.orders || [];
        this.pagination.total = response.data.total || 0;
        
        log.info('User orders loaded successfully', {
          orderCount: this.orders.length,
          total: this.pagination.total
        });
      } catch (error: any) {
        this.error = error.message;
        log.error('Failed to load user orders', { error: error.message });
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // 获取单个订单
    async getOrder(orderId: string) {
      const log = getLog('OrderStore');
      log.info('Loading order', { orderId });
      
      this.isLoading = true;
      this.error = null;
      
      try {
        const { request } = (globalThis as any).__SHOP_RUNTIME__;
        
        const response = await request.get(`/api/orders/${orderId}`);
        
        const order = response.data.order;
        this.currentOrder = order;
        
        // 如果订单不在列表中，添加到列表
        const existingIndex = this.orders.findIndex(o => o.id === orderId);
        if (existingIndex === -1) {
          this.orders.unshift(order);
        } else {
          this.orders[existingIndex] = order;
        }
        
        log.info('Order loaded successfully', { orderId });
        return order;
      } catch (error: any) {
        this.error = error.message;
        log.error('Failed to load order', { orderId, error: error.message });
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // 创建订单（从购物车）
    async createOrderFromCart(orderData: {
      shippingAddress: any;
      billingAddress: any;
      paymentMethod: any;
      notes?: string;
    }) {
      const log = getLog('OrderStore');
      log.info('Creating order from cart');
      
      const authStore = useAuthStore();
      const cartStore = useCartStore();
      
      if (!authStore.isAuthenticated) {
        throw new Error('User not authenticated');
      }
      
      if (cartStore.isEmpty) {
        throw new Error('Cannot create order: cart is empty');
      }
      
      this.isLoading = true;
      this.error = null;
      
      try {
        const { request } = (globalThis as any).__SHOP_RUNTIME__;
        
        // 准备订单数据
        const orderPayload = {
          items: cartStore.items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            attributes: item.attributes
          })),
          subtotal: cartStore.subtotal,
          discount: cartStore.discountAmount,
          tax: cartStore.taxAmount,
          shipping: cartStore.shippingCost,
          total: cartStore.totalWithTax,
          shippingAddress: orderData.shippingAddress,
          billingAddress: orderData.billingAddress,
          paymentMethod: orderData.paymentMethod,
          notes: orderData.notes,
          userId: authStore.user.id,
          discountCode: cartStore.discountCode
        };
        
        log.info('Sending order creation request', {
          itemCount: cartStore.items.length,
          total: cartStore.totalWithTax
        });
        
        const response = await request.post('/api/orders', orderPayload);
        
        if (response.data.success) {
          const newOrder: Order = response.data.order;
          
          // 添加到订单列表
          this.orders.unshift(newOrder);
          this.pagination.total += 1;
          this.currentOrder = newOrder;
          
          // 清空购物车
          await cartStore.clearCart();
          
          log.info('Order created successfully', {
            orderId: newOrder.id,
            total: newOrder.total
          });
          
          return newOrder;
        } else {
          throw new Error(response.data.message || 'Order creation failed');
        }
      } catch (error: any) {
        this.error = error.message;
        log.error('Order creation failed', { error: error.message });
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // 取消订单
    async cancelOrder(orderId: string, reason?: string) {
      const log = getLog('OrderStore');
      log.info('Cancelling order', { orderId, reason });
      
      try {
        const { request } = (globalThis as any).__SHOP_RUNTIME__;
        
        const response = await request.post(`/api/orders/${orderId}/cancel`, {
          reason
        });
        
        if (response.data.success) {
          // 更新本地订单状态
          const orderIndex = this.orders.findIndex(o => o.id === orderId);
          if (orderIndex !== -1) {
            this.orders[orderIndex] = {
              ...this.orders[orderIndex],
              status: 'cancelled',
              updatedAt: new Date().toISOString()
            };
          }
          
          if (this.currentOrder?.id === orderId) {
            this.currentOrder = {
              ...this.currentOrder,
              status: 'cancelled',
              updatedAt: new Date().toISOString()
            };
          }
          
          log.info('Order cancelled successfully', { orderId });
          return response.data;
        } else {
          throw new Error(response.data.message || 'Order cancellation failed');
        }
      } catch (error: any) {
        log.error('Order cancellation failed', { orderId, error: error.message });
        throw error;
      }
    },
    
    // 跟踪订单物流
    async trackOrder(orderId: string) {
      const log = getLog('OrderStore');
      log.info('Tracking order', { orderId });
      
      try {
        const { request } = (globalThis as any).__SHOP_RUNTIME__;
        
        const response = await request.get(`/api/orders/${orderId}/tracking`);
        
        if (response.data.tracking) {
          log.info('Order tracking info retrieved', { 
            orderId, 
            status: response.data.tracking.status 
          });
          return response.data.tracking;
        } else {
          throw new Error('No tracking information available');
        }
      } catch (error: any) {
        log.error('Order tracking failed', { orderId, error: error.message });
        throw error;
      }
    },
    
    // 更新订单过滤器
    updateFilters(newFilters: Partial<typeof this.filters>) {
      this.filters = { ...this.filters, ...newFilters };
      this.pagination.page = 1; // 重置到第一页
    },
    
    // 更新分页
    updatePagination(page: number) {
      this.pagination.page = page;
    }
  }
});
```

### 应用初始化和路由守卫

```typescript
import { getLog } from '@nucleusx/core';
import { useAuthStore } from './stores/auth';
import { useCartStore } from './stores/cart';

// 应用初始化完成后设置路由守卫
export function setupRouteGuards() {
  const { router } = (globalThis as any).__SHOP_RUNTIME__;
  const log = getLog('RouteGuards');
  
  // 全局前置守卫 - 权限检查
  router.beforeEach(async (to, from) => {
    log.info('Route guard checking', {
      from: from.path,
      to: to.path,
      timestamp: new Date().toISOString()
    });
    
    // 检查目标页面是否需要认证
    if (to.meta?.requiresAuth) {
      const authStore = useAuthStore();
      
      // 如果尚未检查认证状态，先检查
      if (!authStore.isAuthenticated && !authStore.isCheckingAuth) {
        await authStore.checkAuthStatus();
      }
      
      if (!authStore.isAuthenticated) {
        log.warn('Access denied - authentication required', {
          attemptedRoute: to.path,
          userId: authStore.user?.id || 'anonymous'
        });
        
        // 重定向到登录页
        router.redirect({ 
          url: 'login', 
          param: { redirect: to.path } 
        });
        
        return false;
      }
    }
    
    // 检查管理员权限
    if (to.meta?.requiresAdmin) {
      const authStore = useAuthStore();
      
      if (!authStore.canAccessAdmin) {
        log.warn('Access denied - admin privileges required', {
          attemptedRoute: to.path,
          userId: authStore.user?.id,
          permissions: authStore.permissions
        });
        
        // 重定向到无权限页面
        router.redirect({ url: 'unauthorized' });
        return false;
      }
    }
    
    log.info('Route guard passed', { target: to.path });
    return true;
  });
  
  // 全局后置钩子 - 页面埋点
  router.afterEach((to, from) => {
    log.info('Page viewed', {
      from: from.path || 'unknown',
      to: to.path,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    });
    
    // 发送页面浏览统计
    trackPageView({
      page: to.path,
      referrer: from.path,
      timestamp: new Date().toISOString(),
      userId: useAuthStore().user?.id || 'anonymous'
    });
  });
}

// 页面浏览追踪函数
function trackPageView(data: any) {
  // 这里可以发送数据到分析服务
  console.log('Page view tracked:', data);
  
  // 实际项目中可能会发送到 GA 或其他分析服务
  // analytics.track('page_view', data);
}

// 应用启动时的初始化任务
export async function runAppStartupTasks() {
  const log = getLog('StartupTasks');
  log.info('Running startup tasks');
  
  try {
    // 加载用户认证状态
    const authStore = useAuthStore();
    await authStore.checkAuthStatus();
    
    // 如果用户已认证，加载购物车
    if (authStore.isAuthenticated) {
      const cartStore = useCartStore();
      await cartStore.loadCart();
    }
    
    // 设置路由守卫
    setupRouteGuards();
    
    log.info('Startup tasks completed successfully');
  } catch (error: any) {
    log.error('Startup tasks failed', { error: error.message });
    throw error;
  }
}
```

这个综合示例展示了一个完整的电商应用如何使用 NucleusX 的各个模块：

1. **应用初始化**: 包括 Kit 配置、运行时创建和全局错误处理
2. **用户认证模块**: 完整的登录、登出、权限管理功能
3. **产品管理模块**: 产品列表、搜索、筛选和评价功能
4. **购物车模块**: 完整的购物车操作、折扣码和结账功能
5. **订单管理模块**: 订单创建、查询、跟踪和管理功能
6. **路由守卫**: 权限控制和页面埋点功能

这个示例涵盖了 NucleusX 的核心功能，包括状态管理、路由管理、请求处理和日志记录，展示了如何在实际项目中综合运用这些功能来构建一个功能完整、结构清晰的应用。