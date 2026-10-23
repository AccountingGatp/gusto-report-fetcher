import {authorize,configured,gusto,dates,fail,safeError} from './_common.js';
export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).end();
 if(!authorize(req,res)||!configured(res))return;
 const {start,end}=req.query;
 if(!dates(start,end))return fail(res,400,'Provide a valid date range of at most 366 days.');
 const company=encodeURIComponent(process.env.GUSTO_COMPANY_UUID);
 try{const data=await gusto(`/v1/companies/${company}/payrolls?start_date=${start}&end_date=${end}&processing_statuses=processed,unprocessed&per=100`);
 return res.json({ok:true,payrolls:Array.isArray(data)?data:(data.payrolls||data),note:'Review pay period versus check date.'});}
 catch(e){return safeError(res,e);}
}
