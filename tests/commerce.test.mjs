import test from 'node:test';
import assert from 'node:assert/strict';
import {sanitizeCart,addLine,lineKey,totals} from '../src/lib/commerce.ts';
const catalog=[{id:'a',price:249000,sizes:['S','M','XL'],colors:['Chalk','Ink'],stock:5}];
const line={id:'a',size:'M',color:'Chalk',quantity:1};
test('identical variants merge while distinct variants remain separate',()=>{const cart=addLine([line],line,catalog);assert.equal(cart.length,1);assert.equal(cart[0].quantity,2);assert.equal(addLine(cart,{...line,color:'Ink'},catalog).length,2);assert.notEqual(lineKey(line),lineKey({...line,size:'S'}));});
test('quantities are bounded by stock and invalid stored items are rejected',()=>{assert.deepEqual(sanitizeCart([{...line,quantity:99}],catalog),[{...line,quantity:5}]);assert.deepEqual(sanitizeCart([{...line,quantity:-1},{...line,quantity:1.5},{...line,id:'missing'},{...line,size:'XL',color:'Ink'},null],catalog),[]);assert.deepEqual(sanitizeCart('broken',catalog),[]);});
test('totals use integer minor units and apply the shipping threshold',()=>{assert.deepEqual(totals([line],catalog),{subtotal:249000,shipping:25000,total:274000});assert.deepEqual(totals([{...line,quantity:5}],catalog),{subtotal:1245000,shipping:0,total:1245000});assert.deepEqual(totals([],catalog),{subtotal:0,shipping:0,total:0});});
test('removing a line excludes it from totals',()=>{assert.equal(totals([{...line,quantity:0}],catalog).total,0);});
