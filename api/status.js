import {authorize,configured} from './_common.js';
export default function handler(req,res){if(req.method!=='GET')return res.status(405).end();if(!authorize(req,res)||!configured(res))return;return res.json({ok:true,environment:process.env.GUSTO_ENVIRONMENT==='sandbox'?'sandbox':'production',configured:true,notice:'Token permissions have not been verified. Test payroll lookup.'});}
