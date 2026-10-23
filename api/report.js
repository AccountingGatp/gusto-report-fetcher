import {authorize,configured,gusto,fail,safeError} from './_common.js';
const UUID=/^[a-f0-9-]{32,36}$/i;
export default async function handler(req,res){
 if(!['POST','GET'].includes(req.method))return res.status(405).end();
 if(!authorize(req,res)||!configured(res))return;
 try{
  if(req.method==='POST'){
   const id=req.body?.payroll_uuid;
   if(typeof id!=='string'||!UUID.test(id))return fail(res,400,'Invalid payroll UUID.');
   const data=await gusto(`/v1/payrolls/${encodeURIComponent(id)}/reports/general_ledger`,{method:'POST',body:JSON.stringify({aggregation:'default'})});
   return res.json({ok:true,data});
  }
  const id=req.query?.request_uuid;
  if(typeof id!=='string'||!UUID.test(id))return fail(res,400,'Invalid report request UUID.');
  const data=await gusto(`/v1/reports/${encodeURIComponent(id)}`);
  return res.json({ok:true,data});
 }catch(e){return safeError(res,e);}
}
