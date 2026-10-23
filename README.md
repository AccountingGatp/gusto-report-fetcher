# Gusto Report Fetcher — isolated pilot

This repository is completely separate from AccountingGatp/Bluntd-Payroll. Nothing here changes or deploys that application.

## Scope
Date-range payroll lookup and General Ledger report requests through Gusto's authorized REST API. This is an initial pilot, **not yet automatic file retrieval**. Paystubs, XLSX downloads, payroll categorization, and automatic Bluntd uploads are not yet implemented.

## Requirements
- Authorized Gusto API access token with payrolls:read and company_reports:write scopes, plus company UUID.
- Secure environment variables in this Vercel project only: REPORT_APP_KEY (at least 24 random characters), GUSTO_ACCESS_TOKEN, GUSTO_COMPANY_UUID, GUSTO_ENVIRONMENT (sandbox or production).
- Authenticated access to the Vercel site. The app key alone is not sufficient for a production multi-user payroll system.
- Do not commit credentials, reports, or payroll personal data.

A normal Gusto website login is NOT equivalent to authorized API credentials. The Gusto CLI interactive OAuth session cannot just be reused inside Vercel. If you do not have a permitted API connection, report retrieval remains blocked.

## Development
Run `npm test` (Node 20+). Deploy via a separate Vercel project linked to this repo. Test in sandbox before enabling production. No payroll money movement or payroll submission is performed.

Documentation:
https://docs.gusto.com/embedded-payroll/reference/get-v1-companies-company_id-payrolls
https://docs.gusto.com/embedded-payroll/reference/post-payrolls-payroll_uuid-reports-general_ledger
