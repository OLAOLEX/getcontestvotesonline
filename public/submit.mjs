import {prepareIntake} from './intake.mjs';
export const ENDPOINT='https://formspree.io/f/xyeweyzz';
export async function submitEnquiry(data,reference,{fetcher=fetch,timeout=20000}={}){
 if(data._gotcha)throw Error('Please leave the extra field empty.');
 const message=prepareIntake(data);
 const payload={name:data.name.trim(),email:data.email.trim(),message,reference,website:'getcontestvotesonline.com',request_type:data.trial?'free_trial':'quote',_subject:'Get Contest Votes Online — '+(data.trial?'Trial enquiry':'Quote request')+' — '+reference};
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
 try{
  const response=await fetcher(ENDPOINT,{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
  let body;try{body=await response.json();}catch{throw Error('Receipt could not be confirmed. Keep your reference and check before retrying; the request may have arrived.');}
  if(!response.ok)throw Error(body.errors?.map(e=>e.message).filter(Boolean).join(' ')||'Request not accepted. Please check your details and try again.');
  if(body.ok!==true)throw Error('Receipt could not be confirmed. Keep your reference and check before retrying; the request may have arrived.');
  return reference;
 }catch(error){if(error.name==='AbortError'||error instanceof TypeError)throw Error('Connection interrupted. Your request may have arrived. Keep your reference and check before retrying.');throw error;}finally{clearTimeout(timer);}
}
