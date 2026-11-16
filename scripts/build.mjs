import {cp,mkdir,readdir,rm} from 'node:fs/promises';
// Package only public pages and assets; exclude Git metadata and deployment files.
await rm('dist',{recursive:true,force:true});
await mkdir('dist');
for(const file of await readdir('.')){
 if(/\.(html|jpg|jpeg|png|webp|svg|mp4)$/.test(file))await cp(file,`dist/${file}`);
}
await cp('assets','dist/assets',{recursive:true});
console.log('Static portfolio built in dist/');
