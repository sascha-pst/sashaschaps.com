const COOKIE = '__Host-studio_session';
const LIFETIME = 7 * 24 * 60 * 60;
const encoder = new TextEncoder();
const escapeHTML = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hex = bytes => [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('');
const digest = s => crypto.subtle.digest('SHA-256',encoder.encode(s));
const signingKey = secret => crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);
const encode = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
function decode(s) { return Uint8Array.from(atob(s.replaceAll('-','+').replaceAll('_','/')+'='.repeat((4-s.length%4)%4)),c=>c.charCodeAt(0)); }
function safeNext(value) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\r\n]/.test(value)) return '/';
  const url=new URL(value,'https://studio.invalid');
  return url.origin==='https://studio.invalid' && !url.pathname.startsWith('/_auth/') ? url.pathname+url.search+url.hash : '/';
}
async function sessionValid(request,env) {
  const cookie=request.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
  if(!cookie)return false;
  const [expiry,signature,...extra]=cookie.split('.');const now=Math.floor(Date.now()/1000);
  if(extra.length || !/^\d+$/.test(expiry) || Number(expiry)<=now || Number(expiry)>now+LIFETIME || !/^[A-Za-z0-9_-]{43}$/.test(signature||''))return false;
  try{return await crypto.subtle.verify('HMAC',await signingKey(env.SITE_SESSION_SECRET),decode(signature),encoder.encode(`${expiry}:${env.SITE_PASSWORD_SHA256}`));}catch{return false;}
}
function gate(next,error=false) {
 return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#fafaf5"><title>Come in · A private studio</title><link rel="preload" href="/_auth/castaway.woff2" as="font" type="font/woff2" crossorigin><style>
@font-face{font-family:Castaway;src:url("/_auth/castaway.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}
*{box-sizing:border-box}body{margin:0;min-height:100svh;background:radial-gradient(ellipse at 8% 100%,#d3e0d0,transparent 60%),radial-gradient(ellipse at 95% 100%,#e4ddc4,transparent 62%),#fafaf5;color:#33433c;font-family:system-ui,sans-serif;display:grid;place-items:center;padding:28px}main{width:min(100%,370px)}.label{font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#69756d;margin-bottom:24px}h1{font-weight:400;margin:0 0 28px}.lead{display:block;font:400 27px/1.4 Georgia,serif;letter-spacing:-.025em;margin-bottom:7px}.company{display:block;font:400 clamp(36px,8vw,48px)/1.25 Castaway,Georgia,serif;font-synthesis:none;letter-spacing:-.02em}p{font-size:14px;line-height:1.7;color:#536159}form{margin-top:30px}label{font-size:12px;display:block;margin-bottom:9px}input{font:16px system-ui;width:100%;padding:14px;background:#ffffff80;border:1px solid #bbc7b5;border-radius:4px;color:#33433c}input:focus-visible,button:focus-visible{outline:2px solid #607568;outline-offset:3px}button{width:100%;margin-top:12px;padding:14px;border:0;border-radius:4px;background:#607568;color:white;font:500 13px system-ui;cursor:pointer}button:hover{background:#40584b}.error{color:#8b3e2e;font-size:12px}.note{margin-top:26px;font-size:11px;color:#69756d}.mark{font-size:23px;color:#8d9e83;margin-bottom:26px}
</style></head><body><main aria-label="password protected studio"><div class="mark" aria-hidden="true">✳</div><h1><span class="lead">A little space for</span><span class="company">good company</span></h1><form method="post" action="/_auth/login"><input type="hidden" name="next" value="${escapeHTML(safeNext(next))}"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="256" ${error?'aria-describedby="login-error" aria-invalid="true"':''}><button type="submit">Come in ↗</button>${error?'<p class="error" id="login-error" role="alert">That password didn’t match. Please try again.</p>':''}</form><p class="note">Your browser will remember you for seven days.</p></main></body></html>`,{status:error?401:200,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','content-security-policy':"default-src 'none'; style-src 'unsafe-inline'; font-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",'referrer-policy':'no-referrer','x-content-type-options':'nosniff'}});
}
export default {async fetch(request,env) {
 const url=new URL(request.url);
 // Only the login screen's display font is public; portfolio assets remain gated.
 if(url.pathname==='/_auth/castaway.woff2' && ['GET','HEAD'].includes(request.method)) {
  const font=await env.ASSETS.fetch(new Request(new URL('/assets/fonts/CastawayRegular.woff2',url.origin),request));
  return font;
 }
 if(!/^[a-f0-9]{64}$/.test(env.SITE_PASSWORD_SHA256||'') || (env.SITE_SESSION_SECRET||'').length<32)return new Response('The studio is temporarily unavailable.',{status:503,headers:{'cache-control':'no-store'}});
 if(url.pathname.startsWith('/_auth/') && request.method==='POST' && request.headers.get('origin')!==url.origin)return new Response('Forbidden',{status:403});
 if(url.pathname==='/_auth/logout' && request.method==='POST')return new Response(null,{status:303,headers:{location:'/', 'set-cookie':`${COOKIE}=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax`,'cache-control':'no-store'}});
 if(url.pathname==='/_auth/login' && request.method==='POST') {
  if(Number(request.headers.get('content-length')||0)>4096)return new Response('Request too large',{status:413});
  const raw=await request.text();if(raw.length>4096)return new Response('Request too large',{status:413});
  const form=new URLSearchParams(raw),password=form.get('password')||'',next=safeNext(form.get('next'));
  const received=new Uint8Array(await digest(password)),expected=Uint8Array.from(env.SITE_PASSWORD_SHA256.match(/../g),h=>parseInt(h,16));
  const matches=received.reduce((diff,b,i)=>diff|(b^expected[i]),0)===0;
  if(!matches)return gate(next,true);
  const expiry=String(Math.floor(Date.now()/1000)+LIFETIME);
  const signature=encode(await crypto.subtle.sign('HMAC',await signingKey(env.SITE_SESSION_SECRET),encoder.encode(`${expiry}:${env.SITE_PASSWORD_SHA256}`)));
  return new Response(null,{status:303,headers:{location:next,'set-cookie':`${COOKIE}=${expiry}.${signature}; Path=/; Max-Age=${LIFETIME}; Secure; HttpOnly; SameSite=Lax`,'cache-control':'no-store'}});
 }
 if(!await sessionValid(request,env))return gate(url.pathname+url.search);
 if(url.pathname.startsWith('/_auth/'))return gate('/');
 const response=await env.ASSETS.fetch(request),out=new Response(response.body,response);
 out.headers.set('cache-control','private, no-store');out.headers.set('x-content-type-options','nosniff');out.headers.set('referrer-policy','strict-origin-when-cross-origin');
 return out;
}};
