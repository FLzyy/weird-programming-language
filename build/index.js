import{readFile as e}from"node:fs/promises";import{createInterface as t}from"node:readline";let r=await e("src/index.wpl","utf-8"),n=r.trim().split(/\n/),o=n[0].split(":"),i=parseInt(o[0]),l=o[1].toLowerCase(),s=Array(i),u=s.length;for(let c=0;c<u;++c)s[c]=0;let f=0,a=(e,t)=>new Promise(r=>{e.question(t,e=>r(e))}),p={"+":function(e){return s[f]++,e},"-":function(e){return s[f]--,e},"<":function(e){if(f-1<=0){if("true"===l)throw Error("UNDERFLOW");"false"===l&&(f=u-1)}else f--;return e},">":function(e){if(f+1>=u){if("true"===l)throw Error("OVERFLOW");"false"===l&&(s[f+1]=0,u++,f++)}else f++;return e},".":function(e){let t=s.reduceRight((e,t)=>0===t&&0===e.length?e:e.concat(t),[]).reverse();return console.log(String.fromCharCode(...t)),e},_:function(e){let t=s.reduceRight((e,t)=>0===t&&0===e.length?e:e.concat(t),[]).reverse();return console.log(t),e},"~":function(e){return console.log(s),e},"[":function(e,t,r){let n=e+1,o=n;for(let i=n;i<=t.length;i++)if("]"===t[i]){o=i;break}let l=t.slice(n,o).split(":"),s=parseInt(l[0])-1;n++;let u=l[1],c=0;do c++,p[u]&&p[u](c,t,r);while(c<s)return++n},",":async function(e,r,n){let o=t({input:process.stdin,output:process.stdout}),i=await a(o,`INPUT: current index: ${f} row: ${e} col: ${n}: `);return s[f]+=parseInt(i),o.close(),e}},h=n.length;for(let g=1;g<h;g++){let d=n[g],w=d.length;if(!d.startsWith("#"))for(let m=0;m<w;m++)p[d[m]]&&(m=await p[d[m]](m,d,g))}