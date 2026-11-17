import test from 'node:test';import assert from 'node:assert/strict';import {CUTS,LANGUAGES,dimensions,shuffled,swap,solved,progress,isPermutation,canvasSize} from '../src/engine.js';test('10 níveis e 15 idiomas',()=>{assert.equal(CUTS.length,10);assert.equal(LANGUAGES.length,15)});for(const n of CUTS)test('nível '+n,()=>{const {rows,cols}=dimensions(n);assert.equal(rows*cols,n);const p=shuffled(n,()=>.4);assert.equal(new Set(p).size,n);assert.equal(solved(p),false);const q=Array.from({length:n},(_,i)=>i);assert.equal(solved(q),true);assert.equal(progress(q),100);assert.equal(swap(q,0,1)[0],1);assert.equal(q[0],0)});
test('validação de salvamento rejeita peças repetidas, ausentes e inválidas',()=>{assert.equal(isPermutation([0,1,2,3],4),true);assert.equal(isPermutation([0,1,1,3],4),false);assert.equal(isPermutation([0,1,2],4),false);assert.equal(isPermutation([0,1,2,4],4),false);assert.equal(isPermutation([0,1,2,'3'],4),false);assert.equal(isPermutation(null,4),false)});

test('quantidades oficiais dos dez níveis',()=>{assert.deepEqual(CUTS,[4,8,16,32,64,108,216,432,862,1724])});

test('dimensionamento seguro de imagens',()=>{assert.deepEqual(canvasSize(1920,1080),{width:640,height:360});assert.deepEqual(canvasSize(100,1000),{width:410,height:4096});assert.deepEqual(canvasSize(100,100),{width:640,height:640});assert.deepEqual(canvasSize(1,10000),{width:1,height:4096});assert.equal(canvasSize(100,100,0,4096),null);assert.deepEqual(canvasSize(1000,1),{width:640,height:1});for(const [w,h] of [[0,10],[10,0],[NaN,10],[Infinity,10],[-1,20]])assert.equal(canvasSize(w,h),null)});

test('idiomas oficiais sem substituições',()=>{assert.deepEqual(LANGUAGES,['English','中文','हिन्दी','Español','Français','العربية','বাংলা','Русский','Português','Bahasa Indonesia','اردو','Deutsch','日本語','Kiswahili','मराठी'])});

test('progresso vazio ou inválido não retorna NaN',()=>{assert.equal(progress([]),0);assert.equal(progress(null),0);assert.equal(progress(undefined),0);assert.equal(progress([0,1,2,3]),100);assert.equal(progress([1,0,2,3]),50)});

test('tabuleiro vazio ou inválido nunca é considerado concluído',()=>{assert.equal(solved([]),false);assert.equal(solved(null),false);assert.equal(solved(undefined),false);assert.equal(solved([0]),true);assert.equal(solved([1,0]),false)});

test('progresso rejeita estados de peças corrompidos',()=>{assert.equal(progress([0,1,1,3]),0);assert.equal(progress([0,1,2,9]),0);assert.equal(progress([0,1,2,'3']),0);assert.equal(progress([1,0,2,3]),50)});

test('embaralhamento mantém permutação válida com valores extremos do gerador',()=>{for(const n of CUTS){for(const value of [0,0.4,1,-1,NaN,Infinity]){const pieces=shuffled(n,()=>value);assert.equal(pieces.length,n);assert.equal(isPermutation(pieces,n),true);assert.equal(solved(pieces),false)}}});
