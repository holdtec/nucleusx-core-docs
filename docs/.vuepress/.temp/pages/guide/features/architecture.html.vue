<template><div><h1 id="架构详解" tabindex="-1"><a class="header-anchor" href="#架构详解"><span>架构详解</span></a></h1>
<p>本章深入探讨 NucleusX-Core 的架构设计和实现原理。</p>
<h2 id="整体架构" tabindex="-1"><a class="header-anchor" href="#整体架构"><span>整体架构</span></a></h2>
<p>NucleusX-Core 采用分层架构设计，各层职责明确，松耦合高内聚。</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">┌─────────────────┐</span>
<span class="line">│   Business      │  ← 业务逻辑层</span>
<span class="line">│   Logic         │</span>
<span class="line">├─────────────────┤</span>
<span class="line">│   Core API      │  ← 统一核心接口</span>
<span class="line">├─────────────────┤</span>
<span class="line">│   Abstraction   │  ← 抽象层（Kit模式）</span>
<span class="line">│   Layer         │</span>
<span class="line">├─────────────────┤</span>
<span class="line">│   Platform      │  ← 平台适配层</span>
<span class="line">│   Adapters      │</span>
<span class="line">├─────────────────┤</span>
<span class="line">│   Native APIs   │  ← 原生平台API</span>
<span class="line">└─────────────────┘</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="核心模块架构" tabindex="-1"><a class="header-anchor" href="#核心模块架构"><span>核心模块架构</span></a></h2>
<h3 id="_1-运行时管理模块" tabindex="-1"><a class="header-anchor" href="#_1-运行时管理模块"><span>1. 运行时管理模块</span></a></h3>
<p>运行时管理模块是整个框架的入口和核心协调者。</p>
<h4 id="架构组成" tabindex="-1"><a class="header-anchor" href="#架构组成"><span>架构组成</span></a></h4>
<ul>
<li><strong>Runtime Context</strong>: 统一的运行时上下文</li>
<li><strong>Dependency Injector</strong>: 依赖注入管理器</li>
<li><strong>Lifecycle Manager</strong>: 生命周期管理器</li>
<li><strong>Configuration Loader</strong>: 配置加载器</li>
</ul>
<h4 id="实现原理" tabindex="-1"><a class="header-anchor" href="#实现原理"><span>实现原理</span></a></h4>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">class</span> <span class="token class-name">RuntimeManager</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">private</span> registry<span class="token operator">:</span> CoreRegistry<span class="token punctuation">;</span></span>
<span class="line">  <span class="token keyword">private</span> kit<span class="token operator">:</span> IKit<span class="token punctuation">;</span></span>
<span class="line">  </span>
<span class="line">  <span class="token keyword">async</span> <span class="token function">initialize</span><span class="token punctuation">(</span>kit<span class="token operator">:</span> IKit<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>IRuntime<span class="token operator">></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">this</span><span class="token punctuation">.</span>kit <span class="token operator">=</span> kit<span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 1. 注册平台桥接器</span></span>
<span class="line">    <span class="token keyword">this</span><span class="token punctuation">.</span>registry<span class="token punctuation">.</span><span class="token function">setPlatformBridge</span><span class="token punctuation">(</span>kit<span class="token punctuation">.</span>platformBridge<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 2. 注册状态管理引擎</span></span>
<span class="line">    <span class="token keyword">this</span><span class="token punctuation">.</span>registry<span class="token punctuation">.</span><span class="token function">setStoreEngine</span><span class="token punctuation">(</span>kit<span class="token punctuation">.</span>storeEngine<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 3. 初始化请求模块</span></span>
<span class="line">    <span class="token keyword">const</span> request <span class="token operator">=</span> <span class="token function">createRequest</span><span class="token punctuation">(</span>kit<span class="token punctuation">.</span>request<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">this</span><span class="token punctuation">.</span>registry<span class="token punctuation">.</span><span class="token function">setRequest</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 4. 初始化路由模块</span></span>
<span class="line">    <span class="token keyword">const</span> router <span class="token operator">=</span> <span class="token function">createRouter</span><span class="token punctuation">(</span>kit<span class="token punctuation">.</span>router<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">await</span> router<span class="token punctuation">.</span><span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 初始化路由</span></span>
<span class="line">    <span class="token keyword">this</span><span class="token punctuation">.</span>registry<span class="token punctuation">.</span><span class="token function">setRouter</span><span class="token punctuation">(</span>router<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 5. 初始化日志模块</span></span>
<span class="line">    <span class="token keyword">const</span> logger <span class="token operator">=</span> <span class="token function">createLogger</span><span class="token punctuation">(</span>kit<span class="token punctuation">.</span>logger<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">this</span><span class="token punctuation">.</span>registry<span class="token punctuation">.</span><span class="token function">setLogger</span><span class="token punctuation">(</span>logger<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 6. 返回运行时实例</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token punctuation">{</span></span>
<span class="line">      request<span class="token punctuation">,</span></span>
<span class="line">      router<span class="token punctuation">,</span></span>
<span class="line">      logger<span class="token punctuation">,</span></span>
<span class="line">      kit</span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-虚拟路由引擎架构" tabindex="-1"><a class="header-anchor" href="#_2-虚拟路由引擎架构"><span>2. 虚拟路由引擎架构</span></a></h3>
<p>虚拟路由引擎是 NucleusX 的核心技术之一，实现了 SPA 和 MPA 的无缝融合。</p>
<h4 id="双栈架构" tabindex="-1"><a class="header-anchor" href="#双栈架构"><span>双栈架构</span></a></h4>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">interface</span> <span class="token class-name">IRouterStore</span> <span class="token punctuation">{</span></span>
<span class="line">  stacks<span class="token operator">:</span> Route<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>        <span class="token comment">// 虚拟历史栈</span></span>
<span class="line">  renderStack<span class="token operator">:</span> Route<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>   <span class="token comment">// 渲染栈（双缓冲）</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><strong>Virtual Stack</strong>: 维护逻辑上的页面历史</li>
<li><strong>Render Stack</strong>: 控制实际渲染的页面</li>
</ul>
<h4 id="三种运行模式" tabindex="-1"><a class="header-anchor" href="#三种运行模式"><span>三种运行模式</span></a></h4>
<table>
<thead>
<tr>
<th>模式</th>
<th>特点</th>
<th>适用场景</th>
</tr>
</thead>
<tbody>
<tr>
<td>SPA</td>
<td>纯虚拟栈，无限制</td>
<td>需要突破原生栈限制</td>
</tr>
<tr>
<td>MPA</td>
<td>纯物理跳转</td>
<td>保持原生导航行为</td>
</tr>
<tr>
<td>Auto</td>
<td>自动判定</td>
<td>混合场景</td>
</tr>
</tbody>
</table>
<h4 id="模式切换逻辑" tabindex="-1"><a class="header-anchor" href="#模式切换逻辑"><span>模式切换逻辑</span></a></h4>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">class</span> <span class="token class-name">ModeResolver</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token function">resolve</span><span class="token punctuation">(</span>targetRoute<span class="token operator">:</span> Route<span class="token punctuation">,</span> currentMode<span class="token operator">:</span> RouterMode<span class="token punctuation">)</span><span class="token operator">:</span> NavigationMode <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>currentMode <span class="token operator">!==</span> <span class="token string">'auto'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">return</span> currentMode<span class="token punctuation">;</span> <span class="token comment">// 固定模式</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 自动判定逻辑</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">isSPAFriendly</span><span class="token punctuation">(</span>targetRoute<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token string">'spa'</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token string">'mpa'</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-请求引擎架构" tabindex="-1"><a class="header-anchor" href="#_3-请求引擎架构"><span>3. 请求引擎架构</span></a></h3>
<p>请求引擎采用洋葱模型中间件架构，支持灵活的请求/响应处理流程。</p>
<h4 id="中间件链" tabindex="-1"><a class="header-anchor" href="#中间件链"><span>中间件链</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">Request → [Auth Middleware] → [Logging Middleware] → [Adapter] → Response</span>
<span class="line">   ↓                           ↓                        ↓              ↓</span>
<span class="line">[Pre-processing]         [Pre-processing]        [Execution]  [Post-processing]</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="执行流程" tabindex="-1"><a class="header-anchor" href="#执行流程"><span>执行流程</span></a></h4>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">class</span> <span class="token class-name">RequestEngine</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">private</span> middlewareChain<span class="token operator">:</span> Middleware<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">  </span>
<span class="line">  <span class="token keyword">async</span> <span class="token function">execute</span><span class="token punctuation">(</span>context<span class="token operator">:</span> RequestContext<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>ResponseContext<span class="token operator">></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">let</span> index <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">const</span> dispatch <span class="token operator">=</span> <span class="token keyword">async</span> <span class="token punctuation">(</span>i<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token operator">></span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">&lt;=</span> index<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">'next() called multiple times'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">      index <span class="token operator">=</span> i<span class="token punctuation">;</span></span>
<span class="line">      </span>
<span class="line">      <span class="token keyword">let</span> fn <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>middlewareChain<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">===</span> <span class="token keyword">this</span><span class="token punctuation">.</span>middlewareChain<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        fn <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>executeAdapter<span class="token punctuation">;</span> <span class="token comment">// 最终执行适配器</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">      </span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>fn<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span></span>
<span class="line">      </span>
<span class="line">      <span class="token keyword">await</span> <span class="token function">fn</span><span class="token punctuation">(</span>context<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token function">dispatch</span><span class="token punctuation">(</span>i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">await</span> <span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> context<span class="token punctuation">.</span>response<span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-状态管理适配层" tabindex="-1"><a class="header-anchor" href="#_4-状态管理适配层"><span>4. 状态管理适配层</span></a></h3>
<p>状态管理适配层实现了不同状态管理库的统一接口。</p>
<h4 id="适配器模式" tabindex="-1"><a class="header-anchor" href="#适配器模式"><span>适配器模式</span></a></h4>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">interface</span> <span class="token class-name">StoreEngine</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token generic-function"><span class="token function">define</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span></span></span><span class="token punctuation">(</span>id<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> options<span class="token operator">:</span> StoreOptions<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span><span class="token punctuation">)</span><span class="token operator">:</span> StoreInstance<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">PiniaEngine</span> <span class="token keyword">implements</span> <span class="token class-name">StoreEngine</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token generic-function"><span class="token function">define</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span></span></span><span class="token punctuation">(</span>id<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> options<span class="token operator">:</span> StoreOptions<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span><span class="token punctuation">)</span><span class="token operator">:</span> StoreInstance<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token function">definePiniaStore</span><span class="token punctuation">(</span>id<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">MobXEngine</span> <span class="token keyword">implements</span> <span class="token class-name">StoreEngine</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token generic-function"><span class="token function">define</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span></span></span><span class="token punctuation">(</span>id<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> options<span class="token operator">:</span> StoreOptions<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span><span class="token punctuation">)</span><span class="token operator">:</span> StoreInstance<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token function">defineMobXStore</span><span class="token punctuation">(</span>id<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="依赖注入系统" tabindex="-1"><a class="header-anchor" href="#依赖注入系统"><span>依赖注入系统</span></a></h2>
<p>NucleusX-Core 的依赖注入系统确保了各模块之间的松耦合。</p>
<h3 id="核心注册表" tabindex="-1"><a class="header-anchor" href="#核心注册表"><span>核心注册表</span></a></h3>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">class</span> <span class="token class-name">CoreRegistry</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">private</span> <span class="token keyword">static</span> instance<span class="token operator">:</span> CoreRegistry<span class="token punctuation">;</span></span>
<span class="line">  <span class="token keyword">private</span> dependencies<span class="token operator">:</span> Map<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token builtin">any</span><span class="token operator">></span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  </span>
<span class="line">  <span class="token keyword">static</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> CoreRegistry <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>CoreRegistry<span class="token punctuation">.</span>instance<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      CoreRegistry<span class="token punctuation">.</span>instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">CoreRegistry</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">return</span> CoreRegistry<span class="token punctuation">.</span>instance<span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  </span>
<span class="line">  <span class="token generic-function"><span class="token function">set</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span></span></span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> instance<span class="token operator">:</span> <span class="token constant">T</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">this</span><span class="token punctuation">.</span>dependencies<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> instance<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  </span>
<span class="line">  <span class="token generic-function"><span class="token function">get</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span></span></span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token constant">T</span> <span class="token operator">|</span> <span class="token keyword">undefined</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>dependencies<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span> <span class="token keyword">as</span> <span class="token constant">T</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  </span>
<span class="line">  <span class="token comment">// 便捷方法</span></span>
<span class="line">  <span class="token function">setPlatformBridge</span><span class="token punctuation">(</span>bridge<span class="token operator">:</span> IPlatformBridge<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token string">'platformBridge'</span><span class="token punctuation">,</span> bridge<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  </span>
<span class="line">  <span class="token function">getPlatformBridge</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> IPlatformBridge <span class="token operator">|</span> <span class="token keyword">undefined</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">'platformBridge'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  </span>
<span class="line">  <span class="token comment">// ... 其他便捷方法</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="平台适配机制" tabindex="-1"><a class="header-anchor" href="#平台适配机制"><span>平台适配机制</span></a></h2>
<p>NucleusX-Core 通过平台适配机制实现跨平台支持。</p>
<h3 id="适配器接口" tabindex="-1"><a class="header-anchor" href="#适配器接口"><span>适配器接口</span></a></h3>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">interface</span> <span class="token class-name">IPlatformBridge</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// 消息提示</span></span>
<span class="line">  <span class="token function">showToast</span><span class="token punctuation">(</span>options<span class="token operator">:</span> ToastOptions<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token function">showLoading</span><span class="token punctuation">(</span>options<span class="token operator">:</span> LoadingOptions<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token function">hideLoading</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token function">showModal</span><span class="token punctuation">(</span>options<span class="token operator">:</span> ModalOptions<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></span>
<span class="line">  </span>
<span class="line">  <span class="token comment">// 存储</span></span>
<span class="line">  <span class="token function">getStorageSync</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token function">setStorageSync</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> data<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token function">removeStorageSync</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token function">clearStorageSync</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></span>
<span class="line">  </span>
<span class="line">  <span class="token comment">// 系统信息</span></span>
<span class="line">  <span class="token function">getSystemInfo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> SystemInfo<span class="token punctuation">;</span></span>
<span class="line">  </span>
<span class="line">  <span class="token comment">// 导航</span></span>
<span class="line">  <span class="token function">navigateTo</span><span class="token punctuation">(</span>options<span class="token operator">:</span> NavigateOptions<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token function">redirectTo</span><span class="token punctuation">(</span>options<span class="token operator">:</span> NavigateOptions<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token function">navigateBack</span><span class="token punctuation">(</span>options<span class="token operator">?</span><span class="token operator">:</span> BackOptions<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="适配器实现" tabindex="-1"><a class="header-anchor" href="#适配器实现"><span>适配器实现</span></a></h3>
<p>不同平台提供相应的适配器实现：</p>
<ul>
<li><strong>WeChat Mini Program</strong>: <code v-pre>WxPlatformBridge</code></li>
<li><strong>Alipay Mini Program</strong>: <code v-pre>AlipayPlatformBridge</code></li>
<li><strong>H5</strong>: <code v-pre>H5PlatformBridge</code></li>
<li><strong>React Native</strong>: <code v-pre>RNPlatformBridge</code></li>
</ul>
<h2 id="安全与防护机制" tabindex="-1"><a class="header-anchor" href="#安全与防护机制"><span>安全与防护机制</span></a></h2>
<p>NucleusX-Core 内置了多层安全防护机制。</p>
<h3 id="fail-fast-防护" tabindex="-1"><a class="header-anchor" href="#fail-fast-防护"><span>Fail-Fast 防护</span></a></h3>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">class</span> <span class="token class-name">Guard</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">static</span> <span class="token function">assertRuntimeReady</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> request <span class="token operator">=</span> coreRegistry<span class="token punctuation">.</span><span class="token function">getRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">const</span> logger <span class="token operator">=</span> coreRegistry<span class="token punctuation">.</span><span class="token function">getLogger</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>request<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">'Request not injected. Please call createRuntime() first.'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>logger<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">'Logger not injected. Please call createRuntime() first.'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  </span>
<span class="line">  <span class="token keyword">static</span> <span class="token function">assertMpaNavigationReady</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> bridge <span class="token operator">=</span> coreRegistry<span class="token punctuation">.</span><span class="token function">getPlatformBridge</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>bridge<span class="token operator">?.</span>navigateTo<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">'PlatformBridge does not support navigateTo. MPA navigation unavailable.'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="类型安全" tabindex="-1"><a class="header-anchor" href="#类型安全"><span>类型安全</span></a></h3>
<p>通过 TypeScript 的强类型系统确保类型安全：</p>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">interface</span> <span class="token class-name">IRuntime</span> <span class="token punctuation">{</span></span>
<span class="line">  request<span class="token operator">:</span> IRequest<span class="token punctuation">;</span></span>
<span class="line">  router<span class="token operator">:</span> IRouter<span class="token punctuation">;</span></span>
<span class="line">  logger<span class="token operator">:</span> ILogger<span class="token punctuation">;</span></span>
<span class="line">  kit<span class="token operator">:</span> IKit<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 严格类型约束</span></span>
<span class="line"><span class="token keyword">function</span> <span class="token function">useRuntime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> IRuntime <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">const</span> runtime <span class="token operator">=</span> coreRegistry<span class="token punctuation">.</span><span class="token function">getRuntime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>runtime<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">'Runtime not initialized'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  <span class="token keyword">return</span> runtime<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="性能优化策略" tabindex="-1"><a class="header-anchor" href="#性能优化策略"><span>性能优化策略</span></a></h2>
<h3 id="路由性能优化" tabindex="-1"><a class="header-anchor" href="#路由性能优化"><span>路由性能优化</span></a></h3>
<ul>
<li><strong>路径解析缓存</strong>: 缓存路径解析结果，避免重复计算</li>
<li><strong>页面预加载</strong>: 根据用户行为预测可能的导航路径</li>
<li><strong>虚拟DOM优化</strong>: 减少不必要的重新渲染</li>
</ul>
<h3 id="请求性能优化" tabindex="-1"><a class="header-anchor" href="#请求性能优化"><span>请求性能优化</span></a></h3>
<ul>
<li><strong>请求缓存</strong>: 支持响应缓存，减少重复请求</li>
<li><strong>并发控制</strong>: 限制并发请求数量，避免服务器压力</li>
<li><strong>连接复用</strong>: 复用底层网络连接，提高效率</li>
</ul>
<h3 id="状态管理优化" tabindex="-1"><a class="header-anchor" href="#状态管理优化"><span>状态管理优化</span></a></h3>
<ul>
<li><strong>按需加载</strong>: 支持 Store 的懒加载</li>
<li><strong>批量更新</strong>: 批量处理状态变更，减少渲染次数</li>
<li><strong>内存管理</strong>: 及时清理未使用的 Store 实例</li>
</ul>
<h2 id="扩展性设计" tabindex="-1"><a class="header-anchor" href="#扩展性设计"><span>扩展性设计</span></a></h2>
<p>NucleusX-Core 通过多个扩展点支持功能扩展。</p>
<h3 id="钩子系统" tabindex="-1"><a class="header-anchor" href="#钩子系统"><span>钩子系统</span></a></h3>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">interface</span> <span class="token class-name">IRouterHooks</span> <span class="token punctuation">{</span></span>
<span class="line">  beforeEach<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">(</span>to<span class="token operator">:</span> Route<span class="token punctuation">,</span> from<span class="token operator">:</span> Route<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token builtin">boolean</span> <span class="token operator">|</span> <span class="token keyword">void</span><span class="token punctuation">;</span></span>
<span class="line">  afterEach<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">(</span>to<span class="token operator">:</span> Route<span class="token punctuation">,</span> from<span class="token operator">:</span> Route<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span><span class="token punctuation">;</span></span>
<span class="line">  onError<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">(</span>error<span class="token operator">:</span> Error<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="插件机制" tabindex="-1"><a class="header-anchor" href="#插件机制"><span>插件机制</span></a></h3>
<p>支持插件机制，允许第三方扩展框架功能：</p>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">interface</span> <span class="token class-name">IPlugin</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token function">install</span><span class="token punctuation">(</span>runtime<span class="token operator">:</span> IRuntime<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></span>
<span class="line">  uninstall<span class="token operator">?</span><span class="token punctuation">(</span>runtime<span class="token operator">:</span> IRuntime<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种架构设计确保了 NucleusX-Core 既能满足当前需求，又具备良好的扩展性和维护性。</p>
</div></template>


