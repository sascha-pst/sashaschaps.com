import {access,cp,mkdir,readdir,rm} from 'node:fs/promises';
// Castaway is a licensed, local deployment input and is intentionally not in Git.
for (const font of ['CastawayRegular.woff2','CastawayRegular.woff']) {
  try { await access(`assets/fonts/${font}`); }
  catch { throw new Error(`Supply the licensed font at assets/fonts/${font} before deploying.`); }
}
// Package only public pages and assets; exclude Git metadata and deployment files.
await rm('dist',{recursive:true,force:true});
await mkdir('dist');
for(const file of await readdir('.')){
 if(/\.(html|jpg|jpeg|png|webp|svg|mp4)$/.test(file))await cp(file,`dist/${file}`);
}
await cp('assets','dist/assets',{recursive:true});
console.log('Static portfolio built in dist/');
