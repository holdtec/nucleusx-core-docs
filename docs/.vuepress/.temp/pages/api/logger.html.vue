<template><div><h1 id="日志系统-api" tabindex="-1"><a class="header-anchor" href="#日志系统-api"><span>日志系统 API</span></a></h1>
<h2 id="init" tabindex="-1"><a class="header-anchor" href="#init"><span>init</span></a></h2>
<p>初始化日志系统的函数。</p>
<h3 id="语法" tabindex="-1"><a class="header-anchor" href="#语法"><span>语法</span></a></h3>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> init <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@nucleusx/core'</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">init</span><span class="token punctuation">(</span>config<span class="token operator">:</span> ILoggerConfig<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="参数" tabindex="-1"><a class="header-anchor" href="#参数"><span>参数</span></a></h3>
<ul>
<li><code v-pre>config</code> (ILoggerConfig): 日志配置对象</li>
</ul>
<h3 id="示例" tabindex="-1"><a class="header-anchor" href="#示例"><span>示例</span></a></h3>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> init<span class="token punctuation">,</span> ConsoleTransport<span class="token punctuation">,</span> StorageTransport <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@nucleusx/core'</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">  level<span class="token operator">:</span> <span class="token string">'debug'</span><span class="token punctuation">,</span> <span class="token comment">// 生产环境改为 'warn'</span></span>
<span class="line">  transports<span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token keyword">new</span> <span class="token class-name">ConsoleTransport</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token keyword">new</span> <span class="token class-name">StorageTransport</span><span class="token punctuation">(</span><span class="token punctuation">{</span> maxEntries<span class="token operator">:</span> <span class="token number">1000</span> <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">  <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="iloggerconfig-接口" tabindex="-1"><a class="header-anchor" href="#iloggerconfig-接口"><span>ILoggerConfig 接口</span></a></h2>
<p>日志配置接口。</p>
<h3 id="属性" tabindex="-1"><a class="header-anchor" href="#属性"><span>属性</span></a></h3>
<ul>
<li><code v-pre>level</code>: LogLevel - 日志级别 ('trace' | 'debug' | 'info' | 'warn' | 'error')</li>
<li><code v-pre>transports</code>: Transport[] - 输出通道数组</li>
<li><code v-pre>defaultContext?</code>: string - 默认上下文（可选）</li>
</ul>
<h2 id="日志级别" tabindex="-1"><a class="header-anchor" href="#日志级别"><span>日志级别</span></a></h2>
<ul>
<li><code v-pre>TRACE</code>: 最详细的信息，通常只在开发时使用</li>
<li><code v-pre>DEBUG</code>: 详细的诊断信息</li>
<li><code v-pre>INFO</code>: 一般信息消息</li>
<li><code v-pre>WARN</code>: 警告信息</li>
<li><code v-pre>ERROR</code>: 错误事件，但应用程序仍可运行</li>
</ul>
<h2 id="getlog" tabindex="-1"><a class="header-anchor" href="#getlog"><span>getLog</span></a></h2>
<p>获取带上下文的 Logger 实例。</p>
<h3 id="语法-1" tabindex="-1"><a class="header-anchor" href="#语法-1"><span>语法</span></a></h3>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> getLog <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@nucleusx/core'</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> log <span class="token operator">=</span> <span class="token function">getLog</span><span class="token punctuation">(</span>context<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="参数-1" tabindex="-1"><a class="header-anchor" href="#参数-1"><span>参数</span></a></h3>
<ul>
<li><code v-pre>context</code> (string): 日志上下文（如 'PaymentService'）</li>
</ul>
<h3 id="返回值" tabindex="-1"><a class="header-anchor" href="#返回值"><span>返回值</span></a></h3>
<ul>
<li><code v-pre>ILogger</code>: 带有上下文的 Logger 实例</li>
</ul>
<h3 id="示例-1" tabindex="-1"><a class="header-anchor" href="#示例-1"><span>示例</span></a></h3>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">const</span> log <span class="token operator">=</span> <span class="token function">getLog</span><span class="token punctuation">(</span><span class="token string">'PaymentService'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">log<span class="token punctuation">.</span><span class="token function">debug</span><span class="token punctuation">(</span><span class="token string">'Starting payment process'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> orderId<span class="token operator">:</span> <span class="token string">'123'</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="ilogger-接口" tabindex="-1"><a class="header-anchor" href="#ilogger-接口"><span>ILogger 接口</span></a></h2>
<p>Logger 实例接口。</p>
<h3 id="方法" tabindex="-1"><a class="header-anchor" href="#方法"><span>方法</span></a></h3>
<ul>
<li><code v-pre>trace(message, meta?)</code>: 记录 TRACE 级别日志</li>
<li><code v-pre>debug(message, meta?)</code>: 记录 DEBUG 级别日志</li>
<li><code v-pre>info(message, meta?)</code>: 记录 INFO 级别日志</li>
<li><code v-pre>warn(message, meta?)</code>: 记录 WARN 级别日志</li>
<li><code v-pre>error(message, meta?)</code>: 记录 ERROR 级别日志</li>
</ul>
<h3 id="参数-2" tabindex="-1"><a class="header-anchor" href="#参数-2"><span>参数</span></a></h3>
<ul>
<li><code v-pre>message</code> (string): 日志消息</li>
<li><code v-pre>meta?</code> (Object): 元数据（可选的结构化数据）</li>
</ul>
<h2 id="transport-接口" tabindex="-1"><a class="header-anchor" href="#transport-接口"><span>Transport 接口</span></a></h2>
<p>输出通道接口，定义了日志输出的具体实现。</p>
<h3 id="内置-transport" tabindex="-1"><a class="header-anchor" href="#内置-transport"><span>内置 Transport</span></a></h3>
<h4 id="consoletransport" tabindex="-1"><a class="header-anchor" href="#consoletransport"><span>ConsoleTransport</span></a></h4>
<p>开发环境输出带颜色的控制台日志。</p>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">new</span> <span class="token class-name">ConsoleTransport</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="storagetransport" tabindex="-1"><a class="header-anchor" href="#storagetransport"><span>StorageTransport</span></a></h4>
<p>生产环境将日志写入本地 Storage。</p>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">new</span> <span class="token class-name">StorageTransport</span><span class="token punctuation">(</span><span class="token punctuation">{</span> maxEntries<span class="token operator">:</span> <span class="token number">1000</span> <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token comment">// 本地只存最近 1000 条</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="httptransport-可扩展" tabindex="-1"><a class="header-anchor" href="#httptransport-可扩展"><span>HttpTransport (可扩展)</span></a></h4>
<p>实时上报到 ELK 或 Sentry。</p>
<h2 id="日志结构" tabindex="-1"><a class="header-anchor" href="#日志结构"><span>日志结构</span></a></h2>
<p>每条日志都是标准化的对象：</p>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  level<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span>      <span class="token comment">// 日志级别</span></span>
<span class="line">  time<span class="token operator">:</span> Date<span class="token punctuation">,</span>         <span class="token comment">// 时间戳</span></span>
<span class="line">  context<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span>    <span class="token comment">// 上下文信息</span></span>
<span class="line">  message<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span>    <span class="token comment">// 日志消息</span></span>
<span class="line">  meta<span class="token operator">:</span> Object        <span class="token comment">// 元数据</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="最佳实践" tabindex="-1"><a class="header-anchor" href="#最佳实践"><span>最佳实践</span></a></h2>
<ol>
<li><strong>禁用 console.log</strong>: 项目规范中应强制要求使用 NucleusX 的日志系统</li>
<li><strong>结构化 Meta 数据</strong>: meta 参数应该是对象，而不是拼接的字符串</li>
<li><strong>上下文追踪</strong>: 为每个业务模块分配唯一的上下文标识</li>
<li><strong>关键路径打点</strong>: 在重要操作前后记录日志，便于问题追踪</li>
<li><strong>合理设置日志级别</strong>: 生产环境避免过多的 DEBUG 日志</li>
</ol>
</div></template>


