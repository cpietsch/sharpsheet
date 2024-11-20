// https://github.com/cpietsch/sharpsheet v0.1.3 Copyright 2024 Christopher Pietsch
"use strict";var e=require("fs"),t=require("sharp"),o=require("path"),i=require("glob"),s=require("@mapbox/shelf-pack");const r=(e,t)=>Array.from({length:Math.ceil(e.length/t)},((o,i)=>e.slice(i*t,i*t+t))),n=(e,t,o)=>`sprite-${e}-${t}.${o}`;module.exports=async function(a,l,p){const c=p.border||1,h=p.sheetDimension||1024,g=p.outputFormat||"png",u=p.outputQuality||100,m=p.outputFilename||"spritesheet.json",f=p.compositeChunkSize||100,d=p.sheetBackground||{r:0,g:0,b:0,alpha:0};let w=[],y=[],b=[],k=[];if("string"==typeof a?k=a.startsWith("[")&&a.endsWith("]")?JSON.parse(a.replace(/'/g,'"')):i.glob.sync(a):Array.isArray(a)&&(k=a),!k.length)return void console.error("no images found");const q=function(t){e.existsSync(t)||e.mkdirSync(t,{recursive:!0});return t}(l);console.log("found",k.length,"files"),console.log("loading metadata");for(const e in k){const i=k[e],s=o.parse(i).name;try{const o=await t(i).metadata();w.push({id:+e,w:o.width+2*c,h:o.height+2*c}),y.push(i),b.push(s)}catch(e){console.error(e,i),console.log("skipping file")}}console.log("bin packing"),w.sort(((e,t)=>t.h-e.h));let S=w.map((e=>e)),$=[];for(;0!==S.length;){let e=new s(h,h).pack(S);$.push(e),S=S.filter((t=>!e.find((e=>e.id===t.id))))}const x=$.map((e=>e.map((e=>({name:b[e.id],input:y[e.id],left:e.x+c,top:e.y+c,width:e.w-2*c,height:e.h-2*c})))));console.log("creating spritesheets",x.length),await Promise.all(x.map((async(e,o)=>{console.log("composing spritesheet",o);const i={width:h,height:h,channels:4,background:d};let s=await t({create:i}).raw().toBuffer();const n=r(e,f);for(let e of n)console.log("composing sprites",f*o),s=await t(s,{raw:i}).composite(e).raw().toBuffer();const a=`sprite-${h}-${o}.${g}`;return{composite:e,fileName:a,fileMeta:await t(s,{raw:i}).toFormat(g,{quality:u}).toFile(q+"/"+a)}})));const F={meta:{type:"sharpsheet",version:"1",app:"https://github.com/cpietsch/sharpsheet"},spritesheets:x.map(((e,t)=>({image:n(h,t,g),sprites:e.map((({left:e,top:t,width:o,height:i,name:s})=>({name:s,position:{x:e,y:t},dimension:{w:o,h:i}})))})))};e.writeFileSync(q+"/"+m,JSON.stringify(F,null,2))};
