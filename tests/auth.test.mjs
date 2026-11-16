import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.mjs';
const password='test-only-strong-random-password';
const hash=Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(password))).toString('hex');
function setup(){
 let requests=0;
 const env={SITE_PASSWORD_SHA256:hash,SITE_SESSION_SECRET:'test-only-session-secret-of-at-least-32-characters',ASSETS:{async fetch(){requests++;return new Response('private portfolio',{headers:{'cache-control':'public, max-age=31536000'}})}}};
 return {env,get requests(){return requests},call(path='/',options={}){return worker.fetch(new Request('https://sashaschaps.com'+path,options),env)},login(next='/project-raincheck',p=password){return this.call('/_auth/login',{method:'POST',headers:{origin:'https://sashaschaps.com','content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({password:p,next})})}};
}
test('unauthenticated homepage, projects and assets show the gate without fetching private content',async()=>{
 const s=setup();for(const path of ['/','/project-raincheck','/shop','/assets/fonts/CastawayRegular.woff2']){
 const r=await s.call(path);assert.equal(r.status,200);assert.match(await r.text(),/password protected/);assert.equal(r.headers.get('cache-control'),'no-store');
 }assert.equal(s.requests,0);
});
test('correct password issues secure session and resumes deep link; authenticated assets cannot be publicly cached',async()=>{
 const s=setup(),r=await s.login();assert.equal(r.status,303);assert.equal(r.headers.get('location'),'/project-raincheck');const cookie=r.headers.get('set-cookie');assert.match(cookie,/Secure; HttpOnly; SameSite=Lax/);
 const asset=await s.call('/project-raincheck',{headers:{cookie:cookie.split(';')[0]}});assert.equal(await asset.text(),'private portfolio');assert.equal(asset.headers.get('cache-control'),'private, no-store');assert.equal(s.requests,1);
});
test('bad password, tampered session, and password rotation deny access',async()=>{
 const s=setup(),bad=await s.login('/','wrong');assert.equal(bad.status,401);assert.equal(bad.headers.get('set-cookie'),null);
 const good=await s.login(),cookie=good.headers.get('set-cookie').split(';')[0];
 const parts=cookie.split('.');parts[1]=(parts[1][0]==='A'?'B':'A')+parts[1].slice(1);
 assert.match(await(await s.call('/',{headers:{cookie:parts.join('.')}})).text(),/password protected/);
 s.env.SITE_PASSWORD_SHA256='a'.repeat(64);assert.match(await(await s.call('/',{headers:{cookie}})).text(),/password protected/);assert.equal(s.requests,0);
});
test('expired sessions and unsigned cookies do not authorize requests',async()=>{
 const s=setup();for(const cookie of ['__Host-studio_session=1.'+'a'.repeat(43),'__Host-studio_session=not-a-session'])assert.match(await(await s.call('/',{headers:{cookie}})).text(),/password protected/);assert.equal(s.requests,0);
});
test('redirects stay on site; cross-origin auth requests are rejected; logout clears the cookie',async()=>{
 const s=setup();for(const next of ['https://evil.test','//evil.test','/\\evil.test','/_auth/logout'])assert.equal((await s.login(next)).headers.get('location'),'/');
 assert.equal((await s.call('/_auth/login',{method:'POST',headers:{origin:'https://evil.test'},body:'password=x'})).status,403);
 const out=await s.call('/_auth/logout',{method:'POST',headers:{origin:'https://sashaschaps.com'}});assert.equal(out.status,303);assert.match(out.headers.get('set-cookie'),/Max-Age=0/);
});
test('missing configuration fails closed and oversized submissions are rejected',async()=>{
 const s=setup();s.env.SITE_SESSION_SECRET='';assert.equal((await s.call()).status,503);assert.equal(s.requests,0);
 s.env.SITE_SESSION_SECRET='test-only-session-secret-of-at-least-32-characters';assert.equal((await s.login('/','x'.repeat(5000))).status,413);
});

test('the login font is public while the original font path and portfolio remain gated',async()=>{
 const s=setup();const font=await s.call('/_auth/castaway.woff2');assert.equal(await font.text(),'private portfolio');assert.equal(s.requests,1);
 const gate=await s.call('/assets/fonts/CastawayRegular.woff2');assert.match(await gate.text(),/name="password"/);assert.equal(s.requests,1);
 const html=await(await s.call('/')).text();assert.match(html,/class="lead">A little space for/);assert.match(html,/class="company">good company/);assert.doesNotMatch(html,/This corner of the internet|Sasha|Schaps/);
});
