// https://github.com/cpietsch/sharpsheet v0.0.6 Copyright 2022 Christopher Pietsch
"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var t=e(require("fs")),o=e(require("sharp")),i=e(require("path")),s=e(require("glob")),n=e(require("@mapbox/shelf-pack"));const r=(e,t)=>Array.from({length:Math.ceil(e.length/t)},(o,i)=>e.slice(i*t,i*t+t)),a=(e,t,o)=>`sprite-${e}-${t}.${o}`;module.exports=async function(e,l,c){const p=c.border||1,h=c.sheetDimension||1024,u=c.outputFormat||"png",g=c.outputQuality||100,m=c.outputFilename||"spritesheet.json",f=c.compositeChunkSize||100,d=c.sheetBackground||{r:0,g:0,b:0,alpha:0};let w=[],y=[],b=[],k=[];if("string"==typeof e?k=e.startsWith("[")&&e.endsWith("]")?JSON.parse(e.replace(/'/g,'"')):s.sync(e):Array.isArray(e)&&(k=e),!k.length)return void console.error("no images found");const q=function(e){t.existsSync(e)||t.mkdirSync(e,{recursive:!0});return e}(l);console.log("found",k.length,"files"),console.log("loading metadata");for(const e in k){const t=k[e],s=i.parse(t).name;try{const i=await o(t).metadata();w.push({id:+e,w:i.width+2*p,h:i.height+2*p}),y.push(t),b.push(s)}catch(e){console.error(e,t),console.log("skipping file")}}console.log("bin packing"),w.sort((e,t)=>t.h-e.h);let S=w.map(e=>e),$=[];for(;0!==S.length;){let e=new n(h,h).pack(S);$.push(e),S=S.filter(t=>!e.find(e=>e.id===t.id))}const x=$.map(e=>e.map(e=>({name:b[e.id],input:y[e.id],left:e.x+p,top:e.y+p,width:e.w-2*p,height:e.h-2*p})));console.log("creating spritesheets",x.length),await Promise.all(x.map(async(e,t)=>{console.log("composing spritesheet",t);const i={width:h,height:h,channels:4,background:d};let s=await o({create:i}).raw().toBuffer();const n=r(e,f);for(let e of n)console.log("composing sprites",f*t),s=await o(s,{raw:i}).composite(e).raw().toBuffer();const a=`sprite-${h}-${t}.${u}`;return{composite:e,fileName:a,fileMeta:await o(s,{raw:i}).toFormat(u,{quality:g}).toFile(q+"/"+a)}}));const F={meta:{type:"sharpsheet",version:"1",app:"https://github.com/cpietsch/sharpsheet"},spritesheets:x.map((e,t)=>({image:a(h,t,u),sprites:e.map(({left:e,top:t,width:o,height:i,name:s})=>({name:s,position:{x:e,y:t},dimension:{w:o,h:i}}))}))};t.writeFileSync(q+"/"+m,JSON.stringify(F,null,2))};
