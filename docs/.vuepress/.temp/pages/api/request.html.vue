<template><div><h1 id="请求模块-api" tabindex="-1"><a class="header-anchor" href="#请求模块-api"><span>请求模块 API</span></a></h1>
<h2 id="createrequest" tabindex="-1"><a class="header-anchor" href="#createrequest"><span>createRequest</span></a></h2>
<p>创建请求引擎实例的核心函数。</p>
<h3 id="语法" tabindex="-1"><a class="header-anchor" href="#语法"><span>语法</span></a></h3>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> createRequest <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@nucleusx/core'</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> request <span class="token operator">=</span> <span class="token function">createRequest</span><span class="token punctuation">(</span>config<span class="token operator">:</span> IRequestConfig<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="参数" tabindex="-1"><a class="header-anchor" href="#参数"><span>参数</span></a></h3>
<ul>
<li><code v-pre>config</code> (IRequestConfig): 请求配置对象</li>
</ul>
<h3 id="返回值" tabindex="-1"><a class="header-anchor" href="#返回值"><span>返回值</span></a></h3>
<ul>
<li><code v-pre>IRequest</code>: 请求实例，提供各种 HTTP 方法</li>
</ul>
<h3 id="示例" tabindex="-1"><a class="header-anchor" href="#示例"><span>示例</span></a></h3>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">const</span> request <span class="token operator">=</span> <span class="token function">createRequest</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">  baseUrl<span class="token operator">:</span> <span class="token string">'https://api.example.com'</span><span class="token punctuation">,</span></span>
<span class="line">  adapter<span class="token operator">:</span> wxAdapter<span class="token punctuation">,</span></span>
<span class="line">  timeout<span class="token operator">:</span> <span class="token number">5000</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="irequestconfig-接口" tabindex="-1"><a class="header-anchor" href="#irequestconfig-接口"><span>IRequestConfig 接口</span></a></h2>
<p>请求配置接口。</p>
<h3 id="属性" tabindex="-1"><a class="header-anchor" href="#属性"><span>属性</span></a></h3>
<ul>
<li><code v-pre>baseUrl</code>: string - 基础 URL</li>
<li><code v-pre>adapter</code>: RequestAdapter - 请求适配器</li>
<li><code v-pre>timeout?</code>: number - 超时时间（毫秒）</li>
<li><code v-pre>headers?</code>: Object - 默认请求头</li>
<li><code v-pre>isBizSuccess?</code>: (response) =&gt; boolean - 业务成功判断函数</li>
<li><code v-pre>errorMode?</code>: 'legacy' | 'wrapped' - 错误处理模式</li>
</ul>
<h2 id="请求方法" tabindex="-1"><a class="header-anchor" href="#请求方法"><span>请求方法</span></a></h2>
<h3 id="get-请求" tabindex="-1"><a class="header-anchor" href="#get-请求"><span>GET 请求</span></a></h3>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">const</span> data <span class="token operator">=</span> <span class="token keyword">await</span> request<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">'/api/user'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> id<span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="post-请求" tabindex="-1"><a class="header-anchor" href="#post-请求"><span>POST 请求</span></a></h3>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token keyword">await</span> request<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token string">'/api/order'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> sku<span class="token operator">:</span> <span class="token string">'123'</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="其他-http-方法" tabindex="-1"><a class="header-anchor" href="#其他-http-方法"><span>其他 HTTP 方法</span></a></h3>
<ul>
<li><code v-pre>request.post(url, data, config)</code></li>
<li><code v-pre>request.put(url, data, config)</code></li>
<li><code v-pre>request.delete(url, config)</code></li>
<li><code v-pre>request.patch(url, data, config)</code></li>
</ul>
<h2 id="配置扩展" tabindex="-1"><a class="header-anchor" href="#配置扩展"><span>配置扩展</span></a></h2>
<h3 id="mergeconfig" tabindex="-1"><a class="header-anchor" href="#mergeconfig"><span>mergeConfig</span></a></h3>
<p>合并配置（推荐用于运行时动态调整）：</p>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line">request<span class="token punctuation">.</span><span class="token function">mergeConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">  headers<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token string-property property">'X-Custom-Header'</span><span class="token operator">:</span> <span class="token string">'value'</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="setconfig" tabindex="-1"><a class="header-anchor" href="#setconfig"><span>setConfig</span></a></h3>
<p>覆盖配置（需要提供完整配置）：</p>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line">request<span class="token punctuation">.</span><span class="token function">setConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">  baseUrl<span class="token operator">:</span> <span class="token string">'https://api.example.com'</span><span class="token punctuation">,</span></span>
<span class="line">  timeout<span class="token operator">:</span> <span class="token number">10000</span><span class="token punctuation">,</span></span>
<span class="line">  adapter<span class="token operator">:</span> wxAdapter</span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="中间件机制" tabindex="-1"><a class="header-anchor" href="#中间件机制"><span>中间件机制</span></a></h2>
<p>请求引擎支持洋葱模型中间件：</p>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code class="language-typescript"><span class="line"><span class="token comment">// 自定义中间件示例：Token刷新</span></span>
<span class="line"><span class="token keyword">const</span> tokenMiddleware<span class="token operator">:</span> <span class="token function-variable function">Middleware</span> <span class="token operator">=</span> <span class="token keyword">async</span> <span class="token punctuation">(</span>context<span class="token punctuation">,</span> next<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// 在请求前添加Token</span></span>
<span class="line">  context<span class="token punctuation">.</span>request<span class="token punctuation">.</span>headers <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token operator">...</span>context<span class="token punctuation">.</span>request<span class="token punctuation">.</span>headers<span class="token punctuation">,</span></span>
<span class="line">    <span class="token string-property property">'Authorization'</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Bearer </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token function">getToken</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">  </span>
<span class="line">  <span class="token keyword">await</span> <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  </span>
<span class="line">  <span class="token comment">// 响应后处理</span></span>
<span class="line">  <span class="token keyword">if</span> <span class="token punctuation">(</span>context<span class="token punctuation">.</span>response<span class="token operator">?.</span>statusCode <span class="token operator">===</span> <span class="token number">401</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// Token过期处理逻辑</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">request<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>tokenMiddleware<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="错误处理" tabindex="-1"><a class="header-anchor" href="#错误处理"><span>错误处理</span></a></h2>
<h3 id="错误模式" tabindex="-1"><a class="header-anchor" href="#错误模式"><span>错误模式</span></a></h3>
<ul>
<li><code v-pre>legacy</code> (默认): 保持向后兼容</li>
<li><code v-pre>wrapped</code>: 启用结构化错误处理</li>
</ul>
<h3 id="requesterror-接口" tabindex="-1"><a class="header-anchor" href="#requesterror-接口"><span>RequestError 接口</span></a></h3>
<p>结构化错误处理接口，支持错误分类和追踪。</p>
<h2 id="requestadapter-接口" tabindex="-1"><a class="header-anchor" href="#requestadapter-接口"><span>RequestAdapter 接口</span></a></h2>
<p>请求适配器接口，用于适配不同平台的网络请求 API。</p>
<h3 id="方法" tabindex="-1"><a class="header-anchor" href="#方法"><span>方法</span></a></h3>
<ul>
<li><code v-pre>request(config)</code>: 发起请求的方法</li>
</ul>
<h2 id="最佳实践" tabindex="-1"><a class="header-anchor" href="#最佳实践"><span>最佳实践</span></a></h2>
<ol>
<li><strong>优先使用中间件</strong>: 通过中间件实现通用逻辑（如 Token 刷新、日志记录）</li>
<li><strong>合理配置超时</strong>: 根据业务场景设置合适的超时时间</li>
<li><strong>自定义错误处理</strong>: 使用 <code v-pre>isBizSuccess</code> 函数定义业务成功标准</li>
<li><strong>避免直接使用平台API</strong>: 使用 NucleusX 的统一接口而非 wx.request 等原生方法</li>
</ol>
</div></template>


