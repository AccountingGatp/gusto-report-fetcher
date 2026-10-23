import {timingSafeEqual} from 'node:crypto';
export const BASE = process.env.GUSTO_ENVIRONMENT === 'sandbox' ? 'https://api.gusto-demo.com' : 'https://api.gusto.com';
export function fail(res,status,message){return res.status(status).json({ok:false,error:message});}
export function authorize(req,res){
 const secret=process.env.REPORT_APP_KEY;
 if(!secret||secret.length<24){fail(res,503,'REPORT_APP_KEY is not configured (minimum 24 characters).');return false;}
 const candidate=req.headers['x-app-key'];
 if(typeof candidate!=='string'){fail(res,401,'Application access key required.');return false;}
 const a=Buffer.from(candidate),b=Buffer.from(secret);
 if(a.length!==b.length||!timingSafeEqual(a,b)){fail(res,401,'Unauthorized');return false;}
 return true;
}
export function configured(res){
 if(!process.env.GUSTO_ACCESS_TOKEN||!process.env.GUSTO_COMPANY_UUID){fail(res,503,'Gusto API access is not configured. Normal Gusto website login alone is insufficient.');return false;}
 return true;
}
export async function gusto(path,options={}){
 const response=await fetch(BASE+path,{...options,headers:{Authorization:`Bearer ${process.env.GUSTO_ACCESS_TOKEN}`,Accept:'application/json','Content-Type':'application/json','X-Gusto-API-Version':'2026-06-15',...(options.headers||{})},signal:AbortSignal.timeout(23000)});
 const raw=await response.text();let data;try{data=JSON.parse(raw);}catch{data={message:raw.slice(0,150)};}
 if(!response.ok){const error=new Error(`Gusto request failed (${response.status}): ${data?.message||'Check API access/scopes'}`);error.status=response.status;throw error;}
 return data;
}
export function dates(start,end){return typeof start==='string'&&typeof end==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(start)&&/^\d{4}-\d{2}-\d{2}$/.test(end)&&!Number.isNaN(Date.parse(start))&&!Number.isNaN(Date.parse(end))&&start<=end&&(new Date(end)-new Date(start))<=366*86400000;}
export function safeError(res,e){return fail(res,e.status===401||e.status===403?403:502,e.status===401||e.status===403?'Gusto authorization failed. API credentials or scopes may be insufficient.':'Could not retrieve requested Gusto data.');}
