<template><div><h1 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始"><span>快速开始</span></a></h1>
<p>本指南将帮助您快速上手使用 NucleusX-Core。</p>
<h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装"><span>安装</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> <span class="token function">install</span> @nucleusx/core</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><blockquote>
<p><strong>注意</strong>: 安装不代表获得商业授权。商业使用前请确保已取得合法授权。</p>
</blockquote>
<h2 id="基础使用" tabindex="-1"><a class="header-anchor" href="#基础使用"><span>基础使用</span></a></h2>
<h3 id="_1-定义平台-kit" tabindex="-1"><a class="header-anchor" href="#_1-定义平台-kit"><span>1. 定义平台 Kit</span></a></h3>
<p>首先，您需要根据目标平台（如微信小程序、H5 等）定义一个 <code v-pre>Kit</code>。<code v-pre>Kit</code> 包含了该平台特有的驱动实现。</p>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> createRuntime<span class="token punctuation">,</span> <span class="token keyword">type</span> <span class="token class-name">IKit</span> <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@nucleusx/core'</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> myWxKit<span class="token operator">:</span> IKit <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// 1. 注入平台桥接器（实现 IPlatformBridge 接口）</span></span>
<span class="line">  platformBridge<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function-variable function">showToast</span><span class="token operator">:</span> <span class="token punctuation">(</span>options<span class="token punctuation">)</span> <span class="token operator">=></span> wx<span class="token punctuation">.</span><span class="token function">showToast</span><span class="token punctuation">(</span>options<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token function-variable function">showLoading</span><span class="token operator">:</span> <span class="token punctuation">(</span>options<span class="token punctuation">)</span> <span class="token operator">=></span> wx<span class="token punctuation">.</span><span class="token function">showLoading</span><span class="token punctuation">(</span>options<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token function-variable function">hideLoading</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> wx<span class="token punctuation">.</span><span class="token function">hideLoading</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token function-variable function">showModal</span><span class="token operator">:</span> <span class="token punctuation">(</span>options<span class="token punctuation">)</span> <span class="token operator">=></span> wx<span class="token punctuation">.</span><span class="token function">showModal</span><span class="token punctuation">(</span>options<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token function-variable function">getStorageSync</span><span class="token operator">:</span> <span class="token punctuation">(</span>key<span class="token punctuation">)</span> <span class="token operator">=></span> wx<span class="token punctuation">.</span><span class="token function">getStorageSync</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token function-variable function">setStorageSync</span><span class="token operator">:</span> <span class="token punctuation">(</span>key<span class="token punctuation">,</span> data<span class="token punctuation">)</span> <span class="token operator">=></span> wx<span class="token punctuation">.</span><span class="token function">setStorageSync</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> data<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token function-variable function">removeStorageSync</span><span class="token operator">:</span> <span class="token punctuation">(</span>key<span class="token punctuation">)</span> <span class="token operator">=></span> wx<span class="token punctuation">.</span><span class="token function">removeStorageSync</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token function-variable function">clearStorageSync</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> wx<span class="token punctuation">.</span><span class="token function">clearStorageSync</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token function-variable function">getSystemInfo</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> wx<span class="token punctuation">.</span><span class="token function">getSystemInfoSync</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token function-variable function">navigateTo</span><span class="token operator">:</span> <span class="token punctuation">(</span>url<span class="token punctuation">)</span> <span class="token operator">=></span> wx<span class="token punctuation">.</span><span class="token function">navigateTo</span><span class="token punctuation">(</span><span class="token punctuation">{</span> url <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token comment">// ... 其他平台 API</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token comment">// 2. 注入 Store 引擎（实现 StoreEngine 接口，如 MobX 或 Pinia）</span></span>
<span class="line">  storeEngine<span class="token operator">:</span> myMobxEngine<span class="token punctuation">,</span></span>
<span class="line">  <span class="token comment">// 3. 请求配置</span></span>
<span class="line">  request<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    baseUrl<span class="token operator">:</span> <span class="token string">'https://api.example.com'</span><span class="token punctuation">,</span></span>
<span class="line">    adapter<span class="token operator">:</span> myWxAdapter<span class="token punctuation">,</span> <span class="token comment">// 平台特定的请求适配器</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token comment">// 4. 路由配置</span></span>
<span class="line">  router<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function-variable function">pagesFetcher</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token function">fetchPagesConfig</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token function-variable function">userPermissionsProvider</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token function">getMyPermissions</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    appConfig<span class="token operator">:</span> <span class="token punctuation">{</span> startPage<span class="token operator">:</span> <span class="token string">'home'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token comment">// 5. 日志配置</span></span>
<span class="line">  logger<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    level<span class="token operator">:</span> <span class="token string">'info'</span><span class="token punctuation">,</span></span>
<span class="line">    transports<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token keyword">new</span> <span class="token class-name">ConsoleTransport</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token comment">// 6. 可选的应用信息</span></span>
<span class="line">  appInfo<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    appId<span class="token operator">:</span> <span class="token string">'wx123456'</span><span class="token punctuation">,</span></span>
<span class="line">    name<span class="token operator">:</span> <span class="token string">'我的应用'</span><span class="token punctuation">,</span></span>
<span class="line">    version<span class="token operator">:</span> <span class="token string">'1.0.0'</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-安装与启动运行时" tabindex="-1"><a class="header-anchor" href="#_2-安装与启动运行时"><span>2. 安装与启动运行时</span></a></h3>
<p>在应用入口处（如 <code v-pre>app.ts</code> 的 <code v-pre>onLaunch</code>），通过 <code v-pre>createRuntime</code> 完成注入与启动。</p>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">bootstrap</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> runtime <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">createRuntime</span><span class="token punctuation">(</span>myWxKit<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 现在可以安全地使用运行时实例了</span></span>
<span class="line">    <span class="token keyword">const</span> <span class="token punctuation">{</span> request<span class="token punctuation">,</span> router <span class="token punctuation">}</span> <span class="token operator">=</span> runtime<span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 也可以通过核心注册表获取（用于业务逻辑层解耦）</span></span>
<span class="line">    <span class="token comment">// const request = coreRegistry.getRequest();</span></span>
<span class="line">  <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">'Runtime start failed:'</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token function">bootstrap</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="核心模块简介" tabindex="-1"><a class="header-anchor" href="#核心模块简介"><span>核心模块简介</span></a></h2>
<h3 id="路由器-router" tabindex="-1"><a class="header-anchor" href="#路由器-router"><span>路由器 (Router)</span></a></h3>
<p>管理业务页面/流程的跳转与返回，支持 SPA、MPA、Auto 三种运行模式。</p>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">const</span> <span class="token punctuation">{</span> router <span class="token punctuation">}</span> <span class="token operator">=</span> runtime<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 跳转到详情页</span></span>
<span class="line">router<span class="token punctuation">.</span><span class="token function">to</span><span class="token punctuation">(</span><span class="token punctuation">{</span> url<span class="token operator">:</span> <span class="token string">'detail'</span><span class="token punctuation">,</span> param<span class="token operator">:</span> <span class="token punctuation">{</span> id<span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 返回上一页</span></span>
<span class="line">router<span class="token punctuation">.</span><span class="token function">back</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 重定向</span></span>
<span class="line">router<span class="token punctuation">.</span><span class="token function">redirect</span><span class="token punctuation">(</span><span class="token punctuation">{</span> url<span class="token operator">:</span> <span class="token string">'login'</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="请求模块-request" tabindex="-1"><a class="header-anchor" href="#请求模块-request"><span>请求模块 (Request)</span></a></h3>
<p>带有统一拦截能力的请求访问接口。</p>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">const</span> <span class="token punctuation">{</span> request <span class="token punctuation">}</span> <span class="token operator">=</span> runtime<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// GET 请求</span></span>
<span class="line"><span class="token keyword">const</span> user <span class="token operator">=</span> <span class="token keyword">await</span> request<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">'/api/user'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> id<span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// POST 请求</span></span>
<span class="line"><span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token keyword">await</span> request<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token string">'/api/order'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> sku<span class="token operator">:</span> <span class="token string">'123'</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="状态管理-store" tabindex="-1"><a class="header-anchor" href="#状态管理-store"><span>状态管理 (Store)</span></a></h3>
<p>业务状态管理抽象（具体驱动由使用方决定）。</p>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token comment">// 定义 Store</span></span>
<span class="line"><span class="token keyword">const</span> useCounterStore <span class="token operator">=</span> <span class="token function">defineStore</span><span class="token punctuation">(</span><span class="token string">'counter'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token function-variable function">state</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">    count<span class="token operator">:</span> <span class="token number">0</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">  actions<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">increment</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">this</span><span class="token punctuation">.</span>count<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 使用 Store</span></span>
<span class="line"><span class="token keyword">const</span> counter <span class="token operator">=</span> <span class="token function">useCounterStore</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">counter<span class="token punctuation">.</span><span class="token function">increment</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="日志系统-logger" tabindex="-1"><a class="header-anchor" href="#日志系统-logger"><span>日志系统 (Logger)</span></a></h3>
<p>结构化日志接口，支持多种输出策略。</p>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">const</span> <span class="token punctuation">{</span> logger <span class="token punctuation">}</span> <span class="token operator">=</span> runtime<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 记录信息</span></span>
<span class="line">logger<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">'User logged in'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> userId<span class="token operator">:</span> <span class="token string">'123'</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 记录错误</span></span>
<span class="line">logger<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">'Login failed'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> error<span class="token operator">:</span> <span class="token string">'Invalid credentials'</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="防御性校验" tabindex="-1"><a class="header-anchor" href="#防御性校验"><span>防御性校验</span></a></h2>
<p>为了减少运行期随机崩溃，<code v-pre>Router</code> 会在初始化和导航前自动进行依赖检查：</p>
<ul>
<li><strong><code v-pre>assertRuntimeReady</code></strong>: 检查 <code v-pre>Request</code> 和 <code v-pre>Logger</code> 是否已正确注入。</li>
<li><strong><code v-pre>assertMpaNavigationReady</code></strong>: 在执行 MPA 跳转前，检查 <code v-pre>PlatformBridge</code> 是否具备必要的物理导航能力。</li>
</ul>
</div></template>


