(function(e){function t(t){for(var a,c,s=t[0],i=t[1],u=t[2],d=0,p=[];d<s.length;d++)c=s[d],Object.prototype.hasOwnProperty.call(n,c)&&n[c]&&p.push(n[c][0]),n[c]=0;for(a in i)Object.prototype.hasOwnProperty.call(i,a)&&(e[a]=i[a]);l&&l(t);while(p.length)p.shift()();return o.push.apply(o,u||[]),r()}function r(){for(var e,t=0;t<o.length;t++){for(var r=o[t],a=!0,s=1;s<r.length;s++){var i=r[s];0!==n[i]&&(a=!1)}a&&(o.splice(t--,1),e=c(c.s=r[0]))}return e}var a={},n={app:0},o=[];function c(t){if(a[t])return a[t].exports;var r=a[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,c),r.l=!0,r.exports}c.m=e,c.c=a,c.d=function(e,t,r){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(c.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)c.d(r,a,function(t){return e[t]}.bind(null,a));return r},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],i=s.push.bind(s);s.push=t,s=s.slice();for(var u=0;u<s.length;u++)t(s[u]);var l=i;o.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("cd49")},"0321":function(e,t,r){"use strict";var a=r("ed3b"),n=r.n(a);n.a},"10fb":function(e,t,r){"use strict";var a=r("4978"),n=r.n(a);n.a},"3e56":function(e,t,r){"use strict";var a=r("df22"),n=r.n(a);n.a},4978:function(e,t,r){},"4eb7":function(e,t,r){"use strict";var a=r("e252"),n=r.n(a);n.a},"5c0b":function(e,t,r){"use strict";var a=r("9c0c"),n=r.n(a);n.a},7171:function(e,t,r){},"8e36":function(e,t,r){"use strict";var a=r("7171"),n=r.n(a);n.a},"9c0c":function(e,t,r){},cd49:function(e,t,r){"use strict";r.r(t);r("e260"),r("e6cf"),r("cca6"),r("a79d");var a=r("2b0e"),n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("standalone",{attrs:{authors:e.authors,packs:e.packs}})},o=[],c=(r("4de4"),r("d3b7"),r("3ca3"),r("ddb0"),r("3835")),s=(r("96cf"),r("1da1")),i=r("d4ec"),u=r("bee2"),l=r("262e"),d=r("2caf"),p=r("9ab4"),f=r("60a3"),h=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"},on:{keydown:e.keydownHandler}},[r("div",{class:{blured:e.selected},attrs:{id:"center_wrapper"}},[r("search-bar",{ref:"searchBar",staticClass:"search-bar",attrs:{disabled:!!e.selected},on:{"focus-list":e.focusListHandler},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}}),r("list",{ref:"list",staticClass:"list",attrs:{search:e.search,authors:e.authors,packs:e.packs,disabled:!!e.selected},on:{selected:e.onSelect,"select-search-bar":function(t){return e.$refs.searchBar.focus()}}})],1),e.selected?r("pack-dialog",{ref:"dialog",attrs:{authors:e.authors,packs:e.packs,selected:e.selected},on:{leave:function(t){e.selected=null}}}):e._e()],1)},v=[],b=(r("ac1f"),r("841c"),function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"search-area"},[r("div",{staticClass:"search-bar"},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.message,expression:"message"}],ref:"input",staticClass:"input",attrs:{disabled:e.disabled},domProps:{value:e.message},on:{input:[function(t){t.target.composing||(e.message=t.target.value)},e.onUpdate],click:function(e){e.dontCloseHelp=!0},keydown:e.keydownHandler}}),r("button",{class:{help:!0,toggled:e.showHelp},attrs:{disabled:e.disabled},on:{click:function(t){t.stopPropagation(),e.showHelp=!e.showHelp,t.dontCloseHelp=!0}}})]),e.showHelp?r("div",{staticClass:"info-area",on:{click:function(e){e.dontCloseHelp=!0}}},[e._m(0),e._m(1),e._m(2),r("p",[e._v(" To limit your search to specific attributes of a pack, you can use the following prefixes: ")]),e._m(3),e._m(4)]):e._e()])}),k=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("p",[e._v("Enter the text you want to search for. E.g. "),r("code",[e._v("Monika")])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("p",[e._v(" If multiple words are given, each word must be found. E.g. "),r("code",[e._v("Monika Pose")])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("p",[e._v(" To search phrases with spaces, surround them with double quotes. E.g. "),r("code",[e._v('"Monika R63" Pose')])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("table",[r("tr",[r("th",[e._v("Prefix")]),r("th",[e._v("Description")]),r("th",[e._v("Example")])]),r("tr",[r("td",[e._v("Character:")]),r("td"),r("td",[r("code",[e._v("Character: Monika")])])]),r("tr",[r("td",[e._v("Artist:")]),r("td"),r("td",[r("code",[e._v("Artist: edave64")])])]),r("tr",[r("td",[e._v("Type:")]),r("td",[r("code",[e._v("Expressions")]),e._v(", "),r("code",[e._v("Styles")]),e._v(", "),r("code",[e._v("Poses")]),e._v(" or "),r("code",[e._v("Characters")])]),r("td",[r("code",[e._v("Type: Poses")])])]),r("tr",[r("td",[e._v("Engine:")]),r("td",[r("code",[e._v("Doki Doki Dialog Generator")]),e._v(", "),r("code",[e._v("DDDG")]),e._v(" or "),r("code",[e._v("Doki Doki Comic Club")]),e._v(", "),r("code",[e._v("DDCC")])]),r("td",[r("code",[e._v("Engine: DDCC")])])]),r("tr",[r("td",[e._v("Pack:")]),r("td",[e._v("The pack itself must contain the text")]),r("td",[r("code",[e._v("Pack: Angry")])])])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("p",[e._v(" Prefixes can be shorted, so "),r("code",[e._v("Character: Monika")]),e._v(" can be shortend to "),r("code",[e._v("C: Monika")])])}],m=250,y=function(e){Object(l["a"])(r,e);var t=Object(d["a"])(r);function r(){var e;return Object(i["a"])(this,r),e=t.apply(this,arguments),e.showHelp=!1,e.message="",e.debounceTimeout=null,e.lastSend="",e}return Object(u["a"])(r,[{key:"focus",value:function(){this.$refs.input.focus()}},{key:"created",value:function(){document.body.addEventListener("click",this.documentClickHandler)}},{key:"destroyed",value:function(){document.body.removeEventListener("click",this.documentClickHandler)}},{key:"documentClickHandler",value:function(e){e.dontCloseHelp||(this.showHelp=!1)}},{key:"keydownHandler",value:function(e){"ArrowDown"===e.key&&(this.$emit("focus-list"),e.preventDefault(),e.stopPropagation())}},{key:"updateInternalValue",value:function(){this.lastSend!==this.value?this.message=this.value:this.lastSend=""}},{key:"onUpdate",value:function(){this.debounceTimeout&&clearTimeout(this.debounceTimeout),this.debounceTimeout=setTimeout(this.doUpdate,m)}},{key:"doUpdate",value:function(){this.debounceTimeout&&clearTimeout(this.debounceTimeout),this.debounceTimeout=null;var e=document.createElement("div");e.innerHTML=this.message,this.lastSend=e.innerText,this.$emit("input",e.innerText)}}]),r}(f["c"]);Object(p["a"])([Object(f["b"])({default:!1})],y.prototype,"disabled",void 0),Object(p["a"])([Object(f["b"])()],y.prototype,"value",void 0),Object(p["a"])([Object(f["d"])("value")],y.prototype,"updateInternalValue",null),y=Object(p["a"])([Object(f["a"])({})],y);var _=y,g=_,j=(r("4eb7"),r("2877")),O=Object(j["a"])(g,b,k,!1,null,"23ee20e3",null),w=O.exports,C=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"list"},[r("table",[r("thead",[r("tr",{ref:"header"},e._l([["name","Pack"],["characters","Character"],["kind","Type"],["authors","Authors"]],(function(t,a){return r("th",{key:a,attrs:{tabindex:e.disabled?-1:0},on:{click:function(r){return e.sortBy(t[0])},keydown:function(r){return e.headerKeydownListener(r,t[0])}}},[r("div",[r("div",[e._v(e._s(t[1]))]),e.sort===t[0]?r("div",[e._v(e._s(e.desc?"▼":"▲"))]):e._e()])])})),0)]),r("transition-group",{ref:"tbody",attrs:{name:"tbody-group",tag:"tbody",tabindex:e.disabled?-1:0},nativeOn:{keydown:function(t){return e.keydownHandler(t)},focus:function(t){return e.updateFocusedItem(t)}}},e._l(e.list,(function(t){return r("tr",{key:t.id,class:{"tbody-group-item":!0,focused:e.focusedItem===t.id},on:{mousedown:function(r){e.focusedItem=t.id},click:function(r){return e.$emit("selected",{id:t.id,source:"pointer"})}}},[r("td",[e._v(e._s(t.name))]),r("td",[e._v(e._s(t.characters.join(", ")))]),r("td",[e._v(e._s(t.kind.join(", ")))]),r("td",[e._v(e._s(t.authors.join(", ")))])])})),0)],1),r("div",{staticClass:"spacer"}),r("footer",[e._v(" Created by edave64. Fork this on "),r("a",{attrs:{href:"https://github.com/edave64/Doki-Doki-Dialog-Generator-Packs/tree/repo-browser",tabindex:e.disabled?-1:0,target:"_blank",rel:"noopener noreferrer"}},[e._v("github")]),e._v("."),r("br"),e._v(" If you are using Comic club, you will need the "),r("a",{attrs:{href:"https://drive.google.com/file/d/15IAbhTkA2xRejvTHu_rZ24kZB2vhQcGM/view?usp=sharing",tabindex:e.disabled?-1:0,target:"_blank",rel:"noopener noreferrer"}},[e._v("Content Pack compatibilty files")]),r("br"),e._v(" To be used with the "),r("a",{attrs:{href:"https://edave64.github.io/Doki-Doki-Dialog-Generator/release/",tabindex:e.disabled?-1:0,target:"_blank",rel:"noopener noreferrer"}},[e._v("Doki Doki Dialog Generator")]),r("br"),e._v(" Using "),r("a",{attrs:{href:"https://material.io/",tabindex:e.disabled?-1:0,target:"_blank",rel:"noopener noreferrer"}},[e._v("material icons")]),e._v(" by google ")])])},D=[],x=(r("c740"),r("5db7"),r("a630"),r("a15b"),r("d81d"),r("73d9"),r("b0c0"),r("4ec9"),r("6062"),r("2909")),P=r("e42c"),T=function(e){Object(l["a"])(r,e);var t=Object(d["a"])(r);function r(){var e;return Object(i["a"])(this,r),e=t.apply(this,arguments),e.sort="",e.desc=!1,e.focusedItem="",e.wordCache={},e}return Object(u["a"])(r,[{key:"keydownHandler",value:function(e){var t=this,r=this.list.findIndex((function(e){return e.id===t.focusedItem}));switch(console.log(r),e.key){case"Enter":this.$emit("selected",{id:this.focusedItem,source:"keyboard"}),e.stopPropagation(),e.preventDefault();break;case"ArrowUp":e.preventDefault(),e.stopPropagation(),0===r?this.$emit("select-search-bar"):this.focusedItem=this.list[r-1].id;break;case"ArrowDown":e.preventDefault(),e.stopPropagation(),r<this.list.length-1&&(this.focusedItem=this.list[r+1].id);break;case"PageUp":e.preventDefault(),e.stopPropagation();var a=r-10;a<0&&(a=0),this.focusedItem=this.list[a].id;break;case"PageDown":e.preventDefault(),e.stopPropagation();var n=r+10,o=this.list.length-1;n>o&&(n=o),this.focusedItem=this.list[n].id;break}}},{key:"headerKeydownListener",value:function(e,t){switch(e.key){case"Enter":case" ":this.sortBy(t),e.preventDefault(),e.stopPropagation();break;case"ArrowDown":this.focus(),e.stopPropagation(),e.preventDefault();break;case"ArrowUp":this.$emit("select-search-bar"),e.stopPropagation(),e.preventDefault();break}}},{key:"focus",value:function(){this.$refs.tbody.$el.focus()}},{key:"updateFocusedItem",value:function(){var e=this;0!==this.list.length?(""===this.focusedItem&&(this.focusedItem=this.list[0].id),this.$nextTick((function(){var t=e.$refs.header,r=document.querySelector(".list tbody .focused"),a=e.$el.offsetHeight-t.offsetHeight,n=e.$el.scrollTop,o=n+a;if(r){var c=r.offsetTop-t.offsetHeight,s=c+r.offsetHeight;s>o?e.$el.scrollTop=s-a:c<n&&(e.$el.scrollTop=c)}}))):this.focusedItem=""}},{key:"sortBy",value:function(e){this.sort===e?this.desc?(this.sort="",this.desc=!1):this.desc=!0:(this.sort=e,this.desc=!1)}},{key:"filterList",value:function(e,t){return t?Object(P["a"])(t,this.authors,e):Object(x["a"])(e)}},{key:"list",get:function(){var e=this.filterList(this.packs,this.search);if(this.sort&&e.length>0){var t=this.sort,r=void 0;if("string"===typeof e[0][t]?r=function(e,t){return e.name.localeCompare(t.name)}:e[0][t]instanceof Array&&(r=function(e,r){return e[t].join(", ").localeCompare(r[t].join(", "))}),r){if(this.desc){var a=r;r=function(e,t){return a(t,e)}}e.sort(r)}}return e}},{key:"listById",get:function(){return new Map(this.packs.map((function(e){return[e.id,e]})))}},{key:"uniqueCharacters",get:function(){return Array.from(new Set(this.packs.flatMap((function(e){return e.characters.map((function(e){return e.toLowerCase()}))}))))}}]),r}(f["c"]);Object(p["a"])([Object(f["b"])()],T.prototype,"search",void 0),Object(p["a"])([Object(f["b"])()],T.prototype,"authors",void 0),Object(p["a"])([Object(f["b"])()],T.prototype,"packs",void 0),Object(p["a"])([Object(f["b"])({default:!1})],T.prototype,"disabled",void 0),Object(p["a"])([Object(f["d"])("focusedItem")],T.prototype,"updateFocusedItem",null),T=Object(p["a"])([f["a"]],T);var $=T,E=$,H=(r("10fb"),Object(j["a"])(E,C,D,!1,null,"0d0e0f22",null)),I=H.exports,S=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"dialog-wrapper",on:{click:function(t){return e.$emit("leave")}}},[r("dialog",{attrs:{open:""}},[r("pack-display",{ref:"packDialog",attrs:{selected:e.selected,authors:e.authors,packs:e.packs}})],1)])},A=[],L=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"pack-display",style:{backgroundImage:e.backgroundImage},on:{click:function(e){e.stopPropagation()}}},[r("header",[r("h1",[e.showBack?r("button",{staticClass:"exit-button",on:{click:function(t){return e.$emit("leave",!0)}}}):e._e(),e._v(" "+e._s(e.pack.name)+" ")]),r("h2",[e._v(e._s(e.pack.id))])]),e.pack.disclaimer?r("section",{staticClass:"disclaimer"},[e._v(" "+e._s(e.pack.disclaimer)+" ")]):e._e(),e.pack.source?r("section",[r("a",{attrs:{href:e.pack.source,target:"_blank",rel:"noopener noreferrer"}},[e._v("Source")])]):e._e(),r("section",[e.pack.dddg1Path?r("button",{ref:"toFocus",staticClass:"clipboard",on:{click:e.copyToClipboard}},[e._v(" Copy DDDG Content Pack ")]):e._e(),e.pack.ddcc2Path?r("button",{on:{click:e.openDDCCUrl}},[e._v(" Download Comic Club Pack ")]):e._e(),r("div",{staticClass:"copy-wrapper"},[e.pack.dddg1Path?r("input",{ref:"copyable",attrs:{tabindex:"-1",readonly:""},domProps:{value:e.pack.dddg1Path}}):e._e()])]),r("section",[r("h3",[e._v("Authors")]),r("table",[r("tbody",e._l(e.pack.authors,(function(t){return r("tr",{key:t},[r("td",[e._v(e._s(e.authorName(t)))]),r("td",e._l(e.authorsLinks(t),(function(e){return r("a",{key:e.target,staticClass:"platform_button",attrs:{href:e.target,target:"_blank",rel:"noopener noreferrer"}},[r("img",{attrs:{title:e.platform,src:e.icon,height:"32",width:"32"}})])})),0)])})),0)])]),e.pack.description?r("section",[r("h3",[e._v("Credits")]),r("p",{domProps:{innerHTML:e._s(e.sanitize(e.pack.description))}})]):e._e()])},M=[],N=(r("7db0"),r("fb6a"),r("5319"),r("99af"),r("caad"),r("2532"),r("466d"),r("b85c")),B=["h3","h4","h5","h6","blockquote","p","a","ul","ol","nl","li","b","i","strong","em","strike","code","hr","br","div","table","thead","caption","tbody","tr","th","td","pre"],U={a:["href"],img:["src"]},G=["href","src"],R=["http","https"],F={a:{target:"_blank",rel:"noopener noreferrer"}};function J(e){var t=document.createElement("div"),r=document.createElement("div");r.innerHTML=e;for(var a=0,n=Array.from(r.childNodes);a<n.length;a++){var o,c=n[a],s=Object(N["a"])(z(c));try{for(s.s();!(o=s.n()).done;){var i=o.value;t.appendChild(i)}}catch(u){s.e(u)}finally{s.f()}}return t.innerHTML}var q=/^(\w+):/;function z(e){if(e.nodeType!==Node.ELEMENT_NODE)return[e];var t=e,r=[],a=t.tagName.toLowerCase();if(B.includes(a)){r.push(t);var n,o=Array.prototype.slice.call(t.attributes),c=U[a]||[],s=Object(N["a"])(o);try{for(s.s();!(n=s.n()).done;){var i=n.value;if(c.includes(i.name)){if(G.includes(i.name)){var u=i.value.match(q);u&&!R.includes(u[1])&&t.removeAttribute(i.name)}}else t.removeAttribute(i.name)}}catch(v){s.e(v)}finally{s.f()}var l=F[a];if(l)for(var d in l)Object.prototype.hasOwnProperty.call(l,d)&&t.setAttribute(d,l[d])}else{r.push(document.createTextNode("<".concat(a,">")));var p,f=Object(N["a"])(t.childNodes);try{for(f.s();!(p=f.n()).done;){var h=p.value;r=r.concat(z(h))}}catch(v){f.e(v)}finally{f.f()}r.push(document.createTextNode("</".concat(a,">")))}return r}var K=[["reddit","https://reddit.com/u/%1","reddit.png"],["deviantart","https://www.deviantart.com/%1","deviantart.png"],["twitter","https://twitter.com/%1","twitter.svg"],["pixiv","https://www.pixiv.net/users/%1","pixiv.ico"],["patreon","https://www.patreon.com/%1","patreon.png"],["facebook","https://www.facebook.com/%1","facebook.png"],["github","https://github.com/%1","github.png"],["website","%1","website.svg"]],V=function(e){Object(l["a"])(r,e);var t=Object(d["a"])(r);function r(){return Object(i["a"])(this,r),t.apply(this,arguments)}return Object(u["a"])(r,[{key:"focus",value:function(){this.$refs.toFocus.focus()}},{key:"authorName",value:function(e){var t=this.authors[e];return t&&t.currentName?t.currentName:e}},{key:"authorsLinks",value:function(e){var t=this.authors[e];return t?K.filter((function(e){return t[e[0]]})).map((function(e){var r=t[e[0]],a=e[1].replace("%1",r);return{target:a,platform:e[0][0].toUpperCase()+e[0].slice(1),icon:"icons/"+e[2]}})):[]}},{key:"sanitize",value:function(e){return J(e)}},{key:"copyToClipboard",value:function(){if(this.$refs.copyable){var e=this.$refs.copyable;e.select(),e.setSelectionRange(0,99999),document.execCommand("copy")}}},{key:"openDDCCUrl",value:function(){window.open(this.pack.ddcc2Path,"_blank")}},{key:"pack",get:function(){var e=this;return this.packs.find((function(t){return t.id===e.selected}))}},{key:"backgroundImage",get:function(){return this.pack.preview.map((function(e){return"url('".concat(e,"')")})).join(",")}}]),r}(f["c"]);Object(p["a"])([Object(f["b"])()],V.prototype,"selected",void 0),Object(p["a"])([Object(f["b"])()],V.prototype,"authors",void 0),Object(p["a"])([Object(f["b"])()],V.prototype,"packs",void 0),Object(p["a"])([Object(f["b"])({type:Boolean,default:!1})],V.prototype,"showBack",void 0),V=Object(p["a"])([Object(f["a"])({})],V);var Z=V,Q=Z,W=(r("0321"),Object(j["a"])(Q,L,M,!1,null,"e2b41054",null)),X=W.exports,Y=function(e){Object(l["a"])(r,e);var t=Object(d["a"])(r);function r(){return Object(i["a"])(this,r),t.apply(this,arguments)}return Object(u["a"])(r,[{key:"focus",value:function(){this.$refs.packDialog.focus()}}]),r}(f["c"]);Object(p["a"])([Object(f["b"])()],Y.prototype,"selected",void 0),Object(p["a"])([Object(f["b"])()],Y.prototype,"authors",void 0),Object(p["a"])([Object(f["b"])()],Y.prototype,"packs",void 0),Y=Object(p["a"])([Object(f["a"])({components:{PackDisplay:X}})],Y);var ee=Y,te=ee,re=(r("8e36"),Object(j["a"])(te,S,A,!1,null,"0e843fe5",null)),ae=re.exports,ne=function(e){Object(l["a"])(r,e);var t=Object(d["a"])(r);function r(){var e;return Object(i["a"])(this,r),e=t.apply(this,arguments),e.search="",e.selected=null,e}return Object(u["a"])(r,[{key:"keydownHandler",value:function(e){var t=this;"Escape"===e.key&&(this.selected="",this.$nextTick((function(){t.$refs.searchBar.focus()})))}},{key:"onSelect",value:function(e){var t=this,r=e.id,a=e.source;this.selected=r,"keyboard"===a&&this.$nextTick((function(){var e=t.$refs.dialog;e.focus()}))}},{key:"focusListHandler",value:function(){this.$refs.list.focus()}}]),r}(f["c"]);Object(p["a"])([Object(f["b"])()],ne.prototype,"authors",void 0),Object(p["a"])([Object(f["b"])()],ne.prototype,"packs",void 0),ne=Object(p["a"])([Object(f["a"])({components:{SearchBar:w,List:I,PackDialog:ae}})],ne);var oe=ne,ce=oe,se=(r("3e56"),Object(j["a"])(ce,h,v,!1,null,null,null)),ie=se.exports,ue=function(e){Object(l["a"])(r,e);var t=Object(d["a"])(r);function r(){var e;return Object(i["a"])(this,r),e=t.apply(this,arguments),e.authors={},e.packs=[],e}return Object(u["a"])(r,[{key:"created",value:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(){var t,r,a,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Promise.all([this.fetchJSON("repo.json"),this.fetchJSON("people.json")]);case 2:t=e.sent,r=Object(c["a"])(t,2),a=r[0],n=r[1],this.packs=a.filter((function(e){return e.dddg1Path||e.ddcc2Path})),this.authors=n;case 8:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"fetchJSON",value:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(t){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,fetch(t);case 2:return r=e.sent,e.next=5,r.json();case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e)})));function t(t){return e.apply(this,arguments)}return t}()}]),r}(f["c"]);ue=Object(p["a"])([Object(f["a"])({components:{Standalone:ie}})],ue);var le=ue,de=le,pe=(r("5c0b"),Object(j["a"])(de,n,o,!1,null,null,null)),fe=pe.exports,he=r("b8d7");a["a"].use(he["a"]),a["a"].config.productionTip=!1,new a["a"]({render:function(e){return e(fe)}}).$mount("#app")},df22:function(e,t,r){},e252:function(e,t,r){},ed3b:function(e,t,r){}});
//# sourceMappingURL=app.46aa4b83.js.map