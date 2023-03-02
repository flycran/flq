import{_ as n,o as s,c as a,e as t}from"./app.c83c3e4b.js";const p={},e=t('<h1 id="student" tabindex="-1"><a class="header-anchor" href="#student" aria-hidden="true">#</a> student</h1><h2 id="\u7ED3\u6784" tabindex="-1"><a class="header-anchor" href="#\u7ED3\u6784" aria-hidden="true">#</a> \u7ED3\u6784</h2><div class="language-sql ext-sql line-numbers-mode"><pre class="language-sql"><code><span class="token keyword">DROP</span> <span class="token keyword">TABLE</span> <span class="token keyword">IF</span> <span class="token keyword">EXISTS</span> <span class="token identifier"><span class="token punctuation">`</span>student<span class="token punctuation">`</span></span><span class="token punctuation">;</span>\n<span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> <span class="token identifier"><span class="token punctuation">`</span>student<span class="token punctuation">`</span></span>  <span class="token punctuation">(</span>\n  <span class="token identifier"><span class="token punctuation">`</span>id<span class="token punctuation">`</span></span> <span class="token keyword">int</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span> <span class="token keyword">AUTO_INCREMENT</span><span class="token punctuation">,</span>\n  <span class="token identifier"><span class="token punctuation">`</span>name<span class="token punctuation">`</span></span> <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">)</span> <span class="token keyword">CHARACTER</span> <span class="token keyword">SET</span> utf8 <span class="token keyword">COLLATE</span> utf8_general_ci <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;\u59D3\u540D&#39;</span><span class="token punctuation">,</span>\n  <span class="token identifier"><span class="token punctuation">`</span>gender<span class="token punctuation">`</span></span> <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">)</span> <span class="token keyword">CHARACTER</span> <span class="token keyword">SET</span> utf8 <span class="token keyword">COLLATE</span> utf8_general_ci <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;\u6027\u522B&#39;</span><span class="token punctuation">,</span>\n  <span class="token identifier"><span class="token punctuation">`</span>chinese<span class="token punctuation">`</span></span> <span class="token keyword">int</span> <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;\u8BED\u6587&#39;</span><span class="token punctuation">,</span>\n  <span class="token identifier"><span class="token punctuation">`</span>math<span class="token punctuation">`</span></span> <span class="token keyword">int</span> <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;\u6570\u5B66&#39;</span><span class="token punctuation">,</span>\n  <span class="token identifier"><span class="token punctuation">`</span>english<span class="token punctuation">`</span></span> <span class="token keyword">int</span> <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;\u82F1\u8BED&#39;</span><span class="token punctuation">,</span>\n  <span class="token identifier"><span class="token punctuation">`</span>class<span class="token punctuation">`</span></span> <span class="token keyword">int</span> <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;\u73ED\u7EA7&#39;</span><span class="token punctuation">,</span>\n  <span class="token identifier"><span class="token punctuation">`</span>age<span class="token punctuation">`</span></span> <span class="token keyword">int</span> <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;\u5E74\u9F84&#39;</span><span class="token punctuation">,</span>\n  <span class="token identifier"><span class="token punctuation">`</span>association<span class="token punctuation">`</span></span> <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">)</span> <span class="token keyword">CHARACTER</span> <span class="token keyword">SET</span> utf8 <span class="token keyword">COLLATE</span> utf8_general_ci <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;\u793E\u56E2&#39;</span><span class="token punctuation">,</span>\n  <span class="token keyword">PRIMARY</span> <span class="token keyword">KEY</span> <span class="token punctuation">(</span><span class="token identifier"><span class="token punctuation">`</span>id<span class="token punctuation">`</span></span><span class="token punctuation">)</span> <span class="token keyword">USING</span> <span class="token keyword">BTREE</span>\n<span class="token punctuation">)</span> <span class="token keyword">ENGINE</span> <span class="token operator">=</span> <span class="token keyword">InnoDB</span> <span class="token keyword">AUTO_INCREMENT</span> <span class="token operator">=</span> <span class="token number">9</span> <span class="token keyword">CHARACTER</span> <span class="token keyword">SET</span> <span class="token operator">=</span> utf8 <span class="token keyword">COLLATE</span> <span class="token operator">=</span> utf8_general_ci ROW_FORMAT <span class="token operator">=</span> Dynamic<span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="\u6570\u636E" tabindex="-1"><a class="header-anchor" href="#\u6570\u636E" aria-hidden="true">#</a> \u6570\u636E</h2><div class="language-sql ext-sql line-numbers-mode"><pre class="language-sql"><code><span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> <span class="token identifier"><span class="token punctuation">`</span>student<span class="token punctuation">`</span></span> <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">&#39;\u5F20\u4E09&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;\u7537&#39;</span><span class="token punctuation">,</span> <span class="token number">86</span><span class="token punctuation">,</span> <span class="token number">78</span><span class="token punctuation">,</span> <span class="token number">65</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">11</span><span class="token punctuation">,</span> <span class="token string">&#39;1,5,6&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> <span class="token identifier"><span class="token punctuation">`</span>student<span class="token punctuation">`</span></span> <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token string">&#39;\u674E\u56DB&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;\u5973&#39;</span><span class="token punctuation">,</span> <span class="token number">56</span><span class="token punctuation">,</span> <span class="token number">56</span><span class="token punctuation">,</span> <span class="token number">23</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">12</span><span class="token punctuation">,</span> <span class="token string">&#39;2,4&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> <span class="token identifier"><span class="token punctuation">`</span>student<span class="token punctuation">`</span></span> <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token string">&#39;\u738B\u4E94&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;\u5973&#39;</span><span class="token punctuation">,</span> <span class="token number">89</span><span class="token punctuation">,</span> <span class="token number">41</span><span class="token punctuation">,</span> <span class="token number">91</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">,</span> <span class="token string">&#39;3,6&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> <span class="token identifier"><span class="token punctuation">`</span>student<span class="token punctuation">`</span></span> <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">,</span> <span class="token string">&#39;\u8D75\u516D&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;\u7537&#39;</span><span class="token punctuation">,</span> <span class="token number">86</span><span class="token punctuation">,</span> <span class="token number">97</span><span class="token punctuation">,</span> <span class="token number">78</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">11</span><span class="token punctuation">,</span> <span class="token boolean">NULL</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> <span class="token identifier"><span class="token punctuation">`</span>student<span class="token punctuation">`</span></span> <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token string">&#39;\u94B1\u4E03&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;\u7537&#39;</span><span class="token punctuation">,</span> <span class="token number">91</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">,</span> <span class="token number">86</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">11</span><span class="token punctuation">,</span> <span class="token string">&#39;2,3,4&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> <span class="token identifier"><span class="token punctuation">`</span>student<span class="token punctuation">`</span></span> <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token number">6</span><span class="token punctuation">,</span> <span class="token string">&#39;\u90D1\u516B&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;\u5973&#39;</span><span class="token punctuation">,</span> <span class="token number">86</span><span class="token punctuation">,</span> <span class="token number">63</span><span class="token punctuation">,</span> <span class="token number">75</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">13</span><span class="token punctuation">,</span> <span class="token string">&#39;1,3,5,6&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> <span class="token identifier"><span class="token punctuation">`</span>student<span class="token punctuation">`</span></span> <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token number">7</span><span class="token punctuation">,</span> <span class="token string">&#39;\u5468\u4E5D&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;\u5973&#39;</span><span class="token punctuation">,</span> <span class="token number">65</span><span class="token punctuation">,</span> <span class="token number">57</span><span class="token punctuation">,</span> <span class="token number">36</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">12</span><span class="token punctuation">,</span> <span class="token string">&#39;3,5&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> <span class="token identifier"><span class="token punctuation">`</span>student<span class="token punctuation">`</span></span> <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">,</span> <span class="token string">&#39;\u5B59\u5341&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;\u7537&#39;</span><span class="token punctuation">,</span> <span class="token number">58</span><span class="token punctuation">,</span> <span class="token number">63</span><span class="token punctuation">,</span> <span class="token number">75</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">13</span><span class="token punctuation">,</span> <span class="token string">&#39;1,2&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="\u9884\u89C8" tabindex="-1"><a class="header-anchor" href="#\u9884\u89C8" aria-hidden="true">#</a> \u9884\u89C8</h2><table><thead><tr><th>id</th><th>name</th><th>gender</th><th>chinese</th><th>math</th><th>english</th><th>class</th><th>age</th><th>association</th></tr></thead><tbody><tr><td>1</td><td>\u5F20\u4E09</td><td>\u7537</td><td>86</td><td>78</td><td>65</td><td>2</td><td>11</td><td>1,5,6</td></tr><tr><td>2</td><td>\u674E\u56DB</td><td>\u5973</td><td>56</td><td>56</td><td>23</td><td>1</td><td>12</td><td>2,4</td></tr><tr><td>3</td><td>\u738B\u4E94</td><td>\u5973</td><td>89</td><td>41</td><td>91</td><td>2</td><td>10</td><td>3,6</td></tr><tr><td>4</td><td>\u8D75\u516D</td><td>\u7537</td><td>86</td><td>97</td><td>78</td><td>3</td><td>11</td><td></td></tr><tr><td>5</td><td>\u94B1\u4E03</td><td>\u7537</td><td>91</td><td>100</td><td>86</td><td>4</td><td>11</td><td>2,3,4</td></tr><tr><td>6</td><td>\u90D1\u516B</td><td>\u5973</td><td>86</td><td>63</td><td>75</td><td>3</td><td>13</td><td>1,3,5,6</td></tr><tr><td>7</td><td>\u5468\u4E5D</td><td>\u5973</td><td>65</td><td>57</td><td>36</td><td>1</td><td>12</td><td>3,5</td></tr><tr><td>8</td><td>\u5B59\u5341</td><td>\u7537</td><td>58</td><td>63</td><td>75</td><td>4</td><td>13</td><td>1,2</td></tr></tbody></table>',7),o=[e];function c(l,k){return s(),a("div",null,o)}var i=n(p,[["render",c],["__file","student.html.vue"]]);export{i as default};