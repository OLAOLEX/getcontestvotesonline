import {planNumbers} from './planner.mjs';
import {submitEnquiry} from './submit.mjs';
import {contestDetails,readDraft,prepareIntake,DRAFT_KEY} from './intake.mjs';
export function quoteUrl({entry,quantity='',deadline='',trial=false}){
 entry=String(entry||'').trim();deadline=String(deadline).trim();
 if(!entry||entry.length>1000||deadline.length>150)throw Error('Add your contest link or a short poll description.');
 if(quantity!==''&&(!Number.isSafeInteger(Number(quantity))||Number(quantity)<1||Number(quantity)>1e9))throw Error('Enter a valid whole quantity or leave it blank.');
 if(trial&&quantity!==''&&Number(quantity)>100)throw Error('Trial enquiries can request up to 100 votes. Use a paid quote for larger quantities.');
 const message=[trial?'I would like to check free-trial eligibility (up to 100 votes, subject to terms).':'I would like a quote for online contest votes.','Contest / poll: '+entry,'Quantity: '+(quantity||'Please advise'),'Voting closes: '+(deadline||'To confirm'),'Please confirm available scope, price, timing and terms.'].join('\n');
 return 'https://wa.me/2349048777608?text='+encodeURIComponent(message);
}
if(typeof document!=='undefined'){
 const prompt=document.querySelector('[data-contact-prompt]');
 if(prompt){
  let seen=false;try{seen=sessionStorage.getItem('gcvo-contact-seen')==='1';}catch{}
  if(!seen){prompt.hidden=false;try{sessionStorage.setItem('gcvo-contact-seen','1');}catch{}}
  prompt.querySelector('[data-dismiss-prompt]').onclick=()=>{prompt.hidden=true;};
  document.addEventListener('focusin',event=>{if(event.target.matches('input,textarea,select'))prompt.hidden=true;});
 }
 for(const starter of document.querySelectorAll('[data-starter]'))starter.addEventListener('submit',event=>{event.preventDefault();if(!starter.reportValidity())return;try{const draft=contestDetails(Object.fromEntries(new FormData(starter)));try{sessionStorage.setItem(DRAFT_KEY,JSON.stringify({...draft,savedAt:Date.now()}));}catch{starter.querySelector('[data-form-error]').textContent='Your browser could not carry these details to the next page. They are still here. Use Get a quote in the header to enter them directly, or chat on WhatsApp.';return;}location.assign('/request-quote/'+(draft.trial?'?trial=1':''));}catch(error){starter.querySelector('[data-form-error]').textContent=error.message;}});
 const intake=document.querySelector('[data-intake]');
 if(intake){
  let draft=null;try{draft=readDraft(sessionStorage.getItem(DRAFT_KEY));sessionStorage.removeItem(DRAFT_KEY);}catch{}
  if(draft)for(const key of ['entry','quantity','deadline'])intake.elements[key].value=draft[key];
  const params=new URLSearchParams(location.search),trial=intake.elements.trial,q=intake.elements.quantity;
  trial.checked=params.get('trial')==='1'||Boolean(draft?.trial);
  const planned=params.get('quantity');if(planned&&/^\d+$/.test(planned)&&Number(planned)>0&&Number(planned)<=(trial.checked?100:1e9))q.value=planned;
  if(['website','registration','social'].includes(params.get('service'))){intake.elements.service.value=params.get('service');intake.elements.service.closest('details').open=true;}
  function trialLimit(){q.max=trial.checked?'100':'1000000000';}trialLimit();trial.addEventListener('change',trialLimit);
  const replyChannel=intake.elements.channel,phone=intake.elements.phone;
  function syncReplyChannel(){phone.required=replyChannel.value==='whatsapp';const optional=phone.labels?.[0]?.querySelector('span');if(optional)optional.textContent=phone.required?'required for WhatsApp replies':'optional';}
  syncReplyChannel();replyChannel.addEventListener('change',syncReplyChannel);
  const review=document.querySelector('[data-review]');let summary='';
  let sending=false,sent=false,reference=null;
  const sendButton=review.querySelector('[data-send-email]'),sendStatus=review.querySelector('[data-send-status]');
  sendButton.addEventListener('click',async()=>{
   if(sending||sent||!intake.reportValidity())return;
   const data=Object.fromEntries(new FormData(intake));
   try{prepareIntake(data);}catch(error){intake.querySelector('[data-form-error]').textContent=error.message;return;}
   reference ||= 'GCVO-'+crypto.randomUUID();
   sending=true;sendButton.disabled=true;sendButton.textContent='Sending…';intake.setAttribute('aria-busy','true');
   const fields=[...intake.elements],prior=fields.map(el=>el.disabled);fields.forEach(el=>el.disabled=true);
   review.querySelector('[data-edit]').disabled=true;sendStatus.textContent='Sending request. Reference: '+reference;
   try{await submitEnquiry(data,reference);sent=true;intake.hidden=true;
    review.replaceChildren();review.classList.add('request-success');
    const mark=document.createElement('span');mark.className='success-mark';mark.textContent='✓';mark.setAttribute('aria-hidden','true');
    const heading=document.createElement('h3');heading.id='review-title';heading.textContent='Thank you. Your request is received.';
    const message=document.createElement('p');message.textContent='Our team will review your contest and reply using your contact details.';
    const ref=document.createElement('p');ref.className='receipt-reference';ref.textContent='Reference: '+reference;
    const chat=document.createElement('a');chat.className='button secondary';chat.href='https://wa.me/2349048777608?text='+encodeURIComponent('Hi, I have a question about my quote request. Reference: '+reference);chat.target='_blank';chat.rel='noopener noreferrer';chat.textContent='Chat on WhatsApp';
    review.append(mark,heading,message,ref,chat);review.focus();
   }
   catch(error){sendStatus.textContent=error.message+' Reference: '+reference;}
   finally{sending=false;if(!sent){fields.forEach((el,i)=>el.disabled=prior[i]);review.querySelector('[data-edit]').disabled=false;sendButton.disabled=false;sendButton.textContent='Send quote request';}intake.removeAttribute('aria-busy');}
  });
  function invalidate(){review.hidden=true;intake.querySelector('[data-form-error]').textContent='';}intake.addEventListener('input',invalidate);intake.addEventListener('change',invalidate);
  intake.addEventListener('submit',event=>{event.preventDefault();if(!intake.reportValidity())return;try{summary=prepareIntake(Object.fromEntries(new FormData(intake)));review.querySelector('[data-summary]').textContent=summary;review.querySelector('[data-send-whatsapp]').href='https://wa.me/2349048777608?text='+encodeURIComponent(summary);review.querySelector('[data-copy-status]').textContent='';review.hidden=false;review.focus();}catch(error){intake.querySelector('[data-form-error]').textContent=error.message;}});
  review.querySelector('[data-copy]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(summary);review.querySelector('[data-copy-status]').textContent='Copied. No request has been sent.';}catch{review.querySelector('[data-copy-status]').textContent='Select the enquiry text above and copy it manually.';}});
  review.querySelector('[data-edit]').addEventListener('click',()=>{review.hidden=true;intake.elements.entry.focus();});
 }
 for(const form of document.querySelectorAll('[data-quote]')){
  const trial=form.elements.trial,quantity=form.elements.quantity;
  function sync(){quantity.max=trial.checked?'100':'1000000000';form.querySelector('[type=submit]').innerHTML=trial.checked?'Ask about my free trial ↗':'Get my quote on WhatsApp ↗';}
  const params=new URLSearchParams(location.search);trial.checked=params.get('trial')==='1';
  const planned=params.get('quantity');if(planned&&/^\d+$/.test(planned)&&Number(planned)>0&&Number(planned)<=(trial.checked?100:1e9))quantity.value=planned;
  sync();trial.addEventListener('change',sync);
  form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;try{const url=quoteUrl({entry:form.elements.entry.value,quantity:quantity.value,deadline:form.elements.deadline.value,trial:trial.checked});form.querySelector('[data-form-error]').textContent='';window.location.assign(url);}catch(error){form.querySelector('[data-form-error]').textContent=error.message;}});
 }
 const form=document.querySelector('[data-planner]');
 if(form){const result=document.querySelector('[data-result]');form.addEventListener('input',()=>{result.hidden=true;});form.addEventListener('change',()=>{result.hidden=true;});form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;try{const data=Object.fromEntries(new FormData(form)),p=planNumbers(data);document.querySelector('[data-daily]').textContent='Daily planning target: '+p.daily+' votes/day';document.querySelector('[data-budget]').textContent=p.budget===null?'Budget: request a rate for your contest.':'Budget at your supplied rate: '+new Intl.NumberFormat('en',{style:'currency',currency:data.currency}).format(p.budget);result.querySelector('a').href='/request-quote/?quantity='+encodeURIComponent(data.quantity);result.hidden=false;form.querySelector('[data-form-error]').textContent='';}catch(error){form.querySelector('[data-form-error]').textContent=error.message;}});}
}
