import{_ as e,o as a,c as t,e as s}from"./app.c83c3e4b.js";const n={},p=s(`<h1 id="model" tabindex="-1"><a class="header-anchor" href="#model" aria-hidden="true">#</a> Model</h1><h2 id="get" tabindex="-1"><a class="header-anchor" href="#get" aria-hidden="true">#</a> get</h2><p><code>get: (this: Flq, row: Data) =&gt; Promise&lt;any&gt;</code></p><p>\u865A\u62DF\u5B57\u6BB5\u83B7\u53D6\u56DE\u8C03</p><p>\u5728\u83B7\u53D6\u865A\u62DF\u5B57\u6BB5\u65F6\u8C03\u7528</p><ul><li><p><strong>this</strong></p><p>this\u6307\u5411<code>flq</code>\u5B9E\u4F8B</p></li><li><p><strong>row</strong></p><p>\u67E5\u8BE2\u540E\u8FD4\u56DE\u7684\u6240\u6709\u5B57\u6BB5</p></li></ul><h2 id="set" tabindex="-1"><a class="header-anchor" href="#set" aria-hidden="true">#</a> set</h2><p><code>set: (this: Flq, value: any, row: Data) =&gt; Promise&lt;void&gt;</code></p><p>\u865A\u62DF\u5B57\u6BB5\u8BBE\u7F6E\u56DE\u8C03</p><p>\u5728\u8BBE\u7F6E\u865A\u62DF\u5B57\u6BB5\u65F6\u8C03\u7528\uFF0C\u8BE5\u51FD\u6570\u4E0D\u63A5\u53D7\u8FD4\u56DE\u503C\uFF0C\u5982\u679C\u9700\u8981\u5BF9\u771F\u5B9E\u5B57\u6BB5\u8FDB\u884C\u64CD\u4F5C\u8BF7\u4F7F\u7528<a href="#pretreat">pretreat</a></p><ul><li><p><strong>this</strong></p><p>this\u6307\u5411<code>flq</code>\u5B9E\u4F8B</p></li><li><p><strong>value</strong></p><p>\u865A\u62DF\u5B57\u6BB5\u8BBE\u7F6E\u65F6\u4F20\u5165\u7684\u503C</p></li><li><p><strong>row</strong></p><p>\u8BBE\u7F6E\u65F6\u4F20\u5165\u7684\u6240\u6709\u771F\u5B9E\u5B57\u6BB5</p></li></ul><h2 id="default" tabindex="-1"><a class="header-anchor" href="#default" aria-hidden="true">#</a> default</h2><p><code>default: ((this: Flq, value: Record&lt;string, any&gt;) =&gt; Promise&lt;any&gt; | any) | any</code></p><p>\u63D2\u5165\u65F6\u9ED8\u8BA4\u503C\uFF0C\u5BF9\u865A\u62DF\u5B57\u6BB5\u65E0\u6548</p><p>\u5F53\u4F20\u5165\u56DE\u8C03\u51FD\u6570\u65F6</p><ul><li><p><strong>this</strong></p><p><code>this</code>\u6307\u5411<code>Flq</code>\u5B9E\u4F8B\u672C\u8EAB</p></li><li><p><strong>value</strong></p><p>\u63D2\u5165\u65F6\u4F20\u5165\u7684\u5176\u4ED6\u5B57\u6BB5\u503C</p></li></ul><h2 id="update" tabindex="-1"><a class="header-anchor" href="#update" aria-hidden="true">#</a> update</h2><p><code>update: ((this: Flq, value: Record&lt;string, any&gt;) =&gt; Promise&lt;any&gt; | any) | any</code></p><p>\u66F4\u65B0\u65F6\u9ED8\u8BA4\u503C\uFF0C\u5BF9\u865A\u62DF\u5B57\u6BB5\u65E0\u6548\u3002\u8BE5\u65B9\u6CD5\u5728\u6570\u636E\u63D2\u5165\u65F6\u4E5F\u4F1A\u89E6\u53D1\uFF0C\u5982\u679C\u60F3\u963B\u6B62\u6B64\u884C\u4E3A\u53EF\u4EE5\u624B\u52A8\u5224\u65AD</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token punctuation">{</span>
  <span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>type <span class="token operator">===</span> <span class="token string">&#39;insert&#39;</span><span class="token punctuation">)</span> <span class="token keyword">return</span>
    <span class="token comment">//...</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u5F53\u4F20\u5165\u56DE\u8C03\u51FD\u6570\u65F6</p><ul><li><p><strong>this</strong></p><p><code>this</code>\u6307\u5411<code>Flq</code>\u5B9E\u4F8B\u672C\u8EAB</p></li><li><p><strong>value</strong></p><p>\u66F4\u65B0\u65F6\u4F20\u5165\u7684\u5176\u4ED6\u5B57\u6BB5\u503C</p></li></ul><h2 id="pretreat" tabindex="-1"><a class="header-anchor" href="#pretreat" aria-hidden="true">#</a> pretreat</h2><p><code>(this: Flq, value: any, data: Data) =&gt; Promise&lt;any&gt;</code></p><p>\u9884\u5904\u7406\u56DE\u8C03</p><p>\u5F53\u63D2\u5165\u6216\u66F4\u65B0\u6570\u636E\u65F6\u8C03\u7528</p><ul><li><p><strong>this</strong></p><p><code>this</code>\u6307\u5411<code>Flq</code>\u5B9E\u4F8B\u672C\u8EAB</p></li><li><p><strong>value</strong></p><p>\u66F4\u65B0\u6216\u63D2\u5165\u65F6\u4F20\u5165\u7684\u503C</p></li><li><p><strong>data</strong></p><p>\u66F4\u65B0\u6216\u63D2\u5165\u65F6\u4F20\u5165\u7684\u6240\u6709\u5B57\u6BB5\u503C</p></li></ul><h2 id="postreat" tabindex="-1"><a class="header-anchor" href="#postreat" aria-hidden="true">#</a> postreat</h2><p><code>(this: Flq, value: any, data: Data) =&gt; Promise&lt;any&gt;</code></p><p>\u540E\u5904\u7406\u56DE\u8C03</p><p>\u5F53\u67E5\u8BE2\u5B8C\u6570\u636E\u5E93\u5373\u5C06\u8FD4\u56DE\u65F6\u8C03\u7528</p><ul><li><p><strong>this</strong></p><p><code>this</code>\u6307\u5411<code>Flq</code>\u5B9E\u4F8B\u672C\u8EAB</p></li><li><p><strong>value</strong></p><p>\u67E5\u8BE2\u540E\u8FD4\u56DE\u7684\u503C</p></li><li><p><strong>data</strong></p><p>\u67E5\u8BE2\u540E\u8FD4\u56DE\u7684\u6240\u6709\u5B57\u6BB5\u503C</p></li></ul><h2 id="rename" tabindex="-1"><a class="header-anchor" href="#rename" aria-hidden="true">#</a> rename</h2><p><code>rename: (( this: Flq, key: string, value: any, row: Data ) =&gt; Promise&lt;string&gt; | string) | string</code></p><p>\u91CD\u547D\u540D\u5B57\u6BB5</p><p>\u63D0\u4F9B\u5E94\u7528\u5C42\u7684\u91CD\u547D\u540D\u65B9\u6848\u3002\u4E0E sql \u7684<code>as</code>\u4E0D\u540C\uFF0C\u8BE5\u9009\u9879\u4E0D\u4F1A\u5F71\u54CD sql \u8BED\u53E5\u7684\u683C\u5F0F\u5316\uFF0C\u5E76\u652F\u6301\u52A8\u6001\u91CD\u547D\u540D</p><p>\u5F53\u4F20\u5165\u51FD\u6570\u65F6\uFF0C\u63A5\u6536\u4EE5\u4E0B\u53C2\u6570</p><ul><li><p><strong>this</strong></p><p>\u51FD\u6570\u7684 this \u6307\u5411<code>Flq</code>\u5B9E\u4F8B</p></li><li><p><strong>value</strong></p><p>\u5B57\u6BB5\u7684\u503C</p></li><li><p><strong>key</strong></p><p>\u5B57\u6BB5\u540D</p></li><li><p><strong>row</strong></p><p>\u6240\u6709\u5B57\u6BB5\u7684\u5BF9\u8C61</p></li></ul><h2 id="toarray" tabindex="-1"><a class="header-anchor" href="#toarray" aria-hidden="true">#</a> toArray</h2><p><code>toArray: boolean</code></p><p>\u8F6C\u6570\u7EC4</p><p>\u63D0\u4F9B\u5B57\u7B26\u4E32\u5230\u6570\u7EC4\u7684\u81EA\u52A8\u8F6C\u6362\uFF0C\u652F\u6301\u81EA\u5B9A\u4E49\u5206\u9694\u7B26 \u4F20\u5165<code>true</code>\u65F6\u9ED8\u8BA4\u4EE5<code>,</code>\u4F5C\u4E3A\u5206\u9694\u7B26 \u5728\u63D2\u5165\u548C\u66F4\u65B0\u65F6\u5C06\u6570\u7EC4\u8F6C\u4E3A\u5B57\u7B26\u4E32 \u5728\u67E5\u8BE2\u65F6\u5C06\u5B57\u7B26\u4E32\u8F6C\u4E3A\u6570\u7EC4</p><h2 id="subjoin-\u672A\u5B8C\u6210" tabindex="-1"><a class="header-anchor" href="#subjoin-\u672A\u5B8C\u6210" aria-hidden="true">#</a> subJoin\uFF08\u672A\u5B8C\u6210\uFF09</h2><p>\`\`</p><p>\u5B9A\u4E49\u5B50\u8868\uFF0C\u7528\u4E8E\u5EFA\u7ACB\u591A\u8868\u8054\u5408</p>`,45),o=[p];function r(i,l){return a(),t("div",null,o)}var c=e(n,[["render",r],["__file","model.html.vue"]]);export{c as default};
