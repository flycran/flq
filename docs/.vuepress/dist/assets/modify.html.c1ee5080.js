import{_ as l,r as c,o as p,c as u,d as e,w as a,e as i,a as n,b as s}from"./app.cd4cbc0d.js";const r={},d=i(`<h1 id="\u589E\u5220\u6539" tabindex="-1"><a class="header-anchor" href="#\u589E\u5220\u6539" aria-hidden="true">#</a> \u589E\u5220\u6539</h1><h2 id="\u63D2\u5165" tabindex="-1"><a class="header-anchor" href="#\u63D2\u5165" aria-hidden="true">#</a> \u63D2\u5165</h2><p>\u4F7F\u7528<code>flq.add</code>\u65B9\u6CD5\u63D2\u5165\u6570\u636E</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">const</span> db <span class="token operator">=</span> flq<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token string">&#39;student&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token string">&#39;\u65B0\u540C\u5B66&#39;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token keyword">await</span> db<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>db<span class="token punctuation">.</span>sql<span class="token punctuation">)</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>result<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u7ED3\u679C</p>`,5),k=n("div",{class:"language-sql ext-sql line-numbers-mode"},[n("pre",{class:"language-sql"},[n("code",null,[n("span",{class:"token keyword"},"INSERT"),s(),n("span",{class:"token keyword"},"INTO"),s(),n("span",{class:"token identifier"},[n("span",{class:"token punctuation"},"`"),s("student"),n("span",{class:"token punctuation"},"`")]),s(),n("span",{class:"token punctuation"},"("),n("span",{class:"token identifier"},[n("span",{class:"token punctuation"},"`"),s("name"),n("span",{class:"token punctuation"},"`")]),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token keyword"},"VALUES"),s(),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'\u65B0\u540C\u5B66'"),n("span",{class:"token punctuation"},")"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"})])],-1),m=n("div",{class:"language-json5 ext-json5 line-numbers-mode"},[n("pre",{class:"language-json5"},[n("code",null,[n("span",{class:"token punctuation"},"{"),s(`
  `),n("span",{class:"token property unquoted"},"fieldCount"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"0"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token property unquoted"},"affectedRows"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"1"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token property unquoted"},"insertId"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"11"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token property unquoted"},"info"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token string"},"''"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token property unquoted"},"serverStatus"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"2"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token property unquoted"},"warningStatus"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"0"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),b=n("h2",{id:"\u4FEE\u6539",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#\u4FEE\u6539","aria-hidden":"true"},"#"),s(" \u4FEE\u6539")],-1),v=n("p",null,[s("\u4F7F\u7528"),n("code",null,"flq.update"),s("\u65B9\u6CD5\u4FEE\u6539\u6570\u636E")],-1),h=n("div",{class:"language-typescript ext-ts line-numbers-mode"},[n("pre",{class:"language-typescript"},[n("code",null,[n("span",{class:"token keyword"},"const"),s(" db "),n("span",{class:"token operator"},"="),s(` flq
  `),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"from"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'student'"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"where"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(`
    id`),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"11"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"set"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(`
    name`),n("span",{class:"token operator"},":"),s(),n("span",{class:"token string"},"'\u5C0F\u660E'"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`
`),n("span",{class:"token keyword"},"const"),s(" result "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"await"),s(" db"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"update"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(`
`),n("span",{class:"token builtin"},"console"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),s("db"),n("span",{class:"token punctuation"},"."),s("sql"),n("span",{class:"token punctuation"},")"),s(`
`),n("span",{class:"token builtin"},"console"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),s("result"),n("span",{class:"token punctuation"},")"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),f=n("h4",{id:"\u7ED3\u679C",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#\u7ED3\u679C","aria-hidden":"true"},"#"),s(" \u7ED3\u679C")],-1),g=n("div",{class:"language-sql ext-sql line-numbers-mode"},[n("pre",{class:"language-sql"},[n("code",null,[n("span",{class:"token keyword"},"UPDATE"),s(),n("span",{class:"token identifier"},[n("span",{class:"token punctuation"},"`"),s("student"),n("span",{class:"token punctuation"},"`")]),s(),n("span",{class:"token keyword"},"SET"),s(),n("span",{class:"token identifier"},[n("span",{class:"token punctuation"},"`"),s("name"),n("span",{class:"token punctuation"},"`")]),s(),n("span",{class:"token operator"},"="),s(),n("span",{class:"token string"},"'\u5C0F\u660E'"),s(),n("span",{class:"token keyword"},"WHERE"),s(),n("span",{class:"token identifier"},[n("span",{class:"token punctuation"},"`"),s("id"),n("span",{class:"token punctuation"},"`")]),s(),n("span",{class:"token operator"},"="),s(),n("span",{class:"token number"},"11"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"})])],-1),y=n("div",{class:"language-json5 ext-json5 line-numbers-mode"},[n("pre",{class:"language-json5"},[n("code",null,[n("span",{class:"token punctuation"},"{"),s(`
  `),n("span",{class:"token property unquoted"},"fieldCount"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"0"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token property unquoted"},"affectedRows"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"1"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token property unquoted"},"insertId"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"0"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token property unquoted"},"info"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token string"},"'Rows matched: 1  Changed: 1  Warnings: 0'"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token property unquoted"},"serverStatus"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"2"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token property unquoted"},"warningStatus"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"0"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token property unquoted"},"changedRows"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"1"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),_=n("h2",{id:"\u5220\u9664",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#\u5220\u9664","aria-hidden":"true"},"#"),s(" \u5220\u9664")],-1),q=n("p",null,[s("\u4F7F\u7528"),n("code",null,"flq.del"),s("\u65B9\u6CD5\u5220\u9664\u6570\u636E")],-1),w=n("div",{class:"language-typescript ext-ts line-numbers-mode"},[n("pre",{class:"language-typescript"},[n("code",null,[n("span",{class:"token keyword"},"const"),s(" db "),n("span",{class:"token operator"},"="),s(` flq
  `),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"from"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'student'"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"where"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(`
    id`),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"11"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`
`),n("span",{class:"token keyword"},"const"),s(" result "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"await"),s(" db"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"del"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(`
`),n("span",{class:"token builtin"},"console"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),s("db"),n("span",{class:"token punctuation"},"."),s("sql"),n("span",{class:"token punctuation"},")"),s(`
`),n("span",{class:"token builtin"},"console"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),s("result"),n("span",{class:"token punctuation"},")"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),x=n("div",{class:"language-sql ext-sql line-numbers-mode"},[n("pre",{class:"language-sql"},[n("code",null,[n("span",{class:"token keyword"},"DELETE"),s(),n("span",{class:"token keyword"},"FROM"),s(),n("span",{class:"token identifier"},[n("span",{class:"token punctuation"},"`"),s("student"),n("span",{class:"token punctuation"},"`")]),s(),n("span",{class:"token keyword"},"WHERE"),s(),n("span",{class:"token identifier"},[n("span",{class:"token punctuation"},"`"),s("id"),n("span",{class:"token punctuation"},"`")]),s(),n("span",{class:"token operator"},"="),s(),n("span",{class:"token number"},"11"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"})])],-1),E=n("div",{class:"language-json5 ext-json5 line-numbers-mode"},[n("pre",{class:"language-json5"},[n("code",null,[n("span",{class:"token punctuation"},"{"),s(`
  `),n("span",{class:"token property unquoted"},"fieldCount"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"0"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token property unquoted"},"affectedRows"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"1"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token property unquoted"},"insertId"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"0"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token property unquoted"},"info"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token string"},"''"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token property unquoted"},"serverStatus"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"2"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token property unquoted"},"warningStatus"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token number"},"0"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1);function R(S,j){const t=c("Result"),o=c("Apply");return p(),u("div",null,[d,e(t,null,{sql:a(()=>[k]),data:a(()=>[m]),_:1}),b,v,e(o,null,{query:a(()=>[h]),_:1}),f,e(t,null,{sql:a(()=>[g]),data:a(()=>[y]),_:1}),_,q,e(o,null,{query:a(()=>[w]),_:1}),e(t,null,{sql:a(()=>[x]),data:a(()=>[E]),_:1})])}var N=l(r,[["render",R],["__file","modify.html.vue"]]);export{N as default};