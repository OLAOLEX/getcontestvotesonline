export function planNumbers({quantity,days,rate,trial=false}){
 const q=quantity===''?null:Number(quantity),d=days===''?null:Number(days),r=rate===''?null:Number(rate);
 if(q!==null&&(!Number.isSafeInteger(q)||q<1||q>1e9))throw Error('Enter a whole quantity between 1 and 1,000,000,000.');
 if(d!==null&&(!Number.isSafeInteger(d)||d<1||d>365))throw Error('Enter 1–365 campaign days.');
 if(r!==null&&(!Number.isFinite(r)||r<0||r>1e6))throw Error('Enter a valid nonnegative quoted rate.');
 if(trial&&q!==null&&q>100)throw Error('The free-trial request can be up to 100 votes; availability is reviewed first.');
 return {daily:q!==null&&d!==null?Math.ceil(q/d):null,budget:!trial&&q!==null&&r!==null?q*r:null};
}
