import test from 'node:test';
import assert from 'node:assert/strict';
import {submitEnquiry,ENDPOINT} from './submit.mjs';
const data={entry:'https://example.com/demo',name:'Integration QA',email:'qa@example.com'};
test('dedicated endpoint, site identity and acknowledged receipt',async()=>{
 const ref=await submitEnquiry(data,'TEST',{fetcher:async(url,opts)=>{assert.equal(url,ENDPOINT);assert.equal(opts.method,'POST');const p=JSON.parse(opts.body);assert.equal(p.website,'getcontestvotesonline.com');assert.equal(p.email,data.email);assert.equal(p.reference,'TEST');return {ok:true,json:async()=>({ok:true})};}});assert.equal(ref,'TEST');
});
test('rejection and malformed success never become receipts',async()=>{
 for(const r of [{ok:false,json:async()=>({errors:[{message:'Rejected'}]})},{ok:true,json:async()=>({})},{ok:true,json:async()=>{throw Error('bad JSON');}}])await assert.rejects(submitEnquiry(data,'TEST',{fetcher:async()=>r}));
});
test('uncertain network result advises checking before a retry',async()=>{
 await assert.rejects(submitEnquiry(data,'TEST',{fetcher:async()=>{throw new TypeError('Offline');}}),/may have arrived/);
});
test('honeypot never reaches the transport',async()=>{
 let calls=0;await assert.rejects(submitEnquiry({...data,_gotcha:'filled'},'TEST',{fetcher:async()=>{calls++;}}));assert.equal(calls,0);
});
