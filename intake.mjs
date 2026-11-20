export const DRAFT_KEY='gcvo-contest-draft-v1';
export function contestDetails(data){
 const entry=String(data.entry||'').trim(),quantity=String(data.quantity||''),deadline=String(data.deadline||'').trim(),trial=Boolean(data.trial);
 if(!entry||entry.length>1000||deadline.length>150)throw Error('Add a contest link or a short description.');
 if(quantity!==''&&(!/^\d+$/.test(quantity)||!Number.isSafeInteger(Number(quantity))||Number(quantity)<1||Number(quantity)>1e9))throw Error('Enter a whole quantity or leave it blank.');
 if(trial&&quantity!==''&&Number(quantity)>100)throw Error('Free-trial requests can be up to 100 votes. Untick the trial for a paid quote.');
 return {entry,quantity,deadline,trial};
}
export function readDraft(serialized,now=Date.now()){
 try{const d=JSON.parse(serialized);if(!d||!Number.isFinite(d.savedAt)||now<d.savedAt||now-d.savedAt>600000)return null;return contestDetails(d);}catch{return null;}
}
export function prepareIntake(data){
 const contest=contestDetails(data),name=String(data.name||'').trim(),email=String(data.email||'').trim(),phone=String(data.phone||'').trim();
 if(!name||name.length>100)throw Error('Enter your name.');
 if(email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email))throw Error('Enter a valid reply email.');
 if(phone&&!/^\+[1-9]\d{6,14}$/.test(phone.replace(/[ ()-]/g,'')))throw Error('Use a full WhatsApp number starting with +country code.');
 const channel=data.channel==='whatsapp'?'WhatsApp':'Email';
 if(channel==='WhatsApp'&&!phone)throw Error('Add your WhatsApp number or choose email replies.');
 const service={website:'Website / single-click voting',registration:'Registration / email confirmation',social:'Social / Facebook contest'}[data.service]||'Please review';
 const notes=String(data.notes||'').trim(),entryName=String(data.entryName||'').trim();
 if(notes.length>2000||entryName.length>200)throw Error('Please shorten the additional details.');
 return [contest.trial?'Free-trial enquiry — up to 100 votes, subject to terms':'Contest vote quote enquiry','Contest / poll: '+contest.entry,'Quantity: '+(contest.quantity||'Please advise'),'Voting closes: '+(contest.deadline||'To confirm'),'Voting service: '+service,...(entryName?['Entry / category / round: '+entryName]:[]),...(notes?['Questions: '+notes]:[]),'Name: '+name,'Reply email: '+email,...(phone?['WhatsApp: '+phone]:[]),'Preferred reply: '+channel,'Please confirm available scope, full price, timing and terms.'].join('\n');
}
