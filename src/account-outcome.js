// Only stable codes; never expose provider messages or account existence.
export function accountOutcome(operation, result) {
 const error=result?.error;
 if(!error)return operation==='signup'?(result?.data?.session?'connected':'confirm'):'reset';
 const code=error.code;
 if(code==='over_request_rate_limit')return 'retryLater';
 if(code==='signup_disabled'&&operation==='signup')return 'failed';
 if(error.name==='AuthRetryableFetchError')return 'failed';
 // Address-specific throttling and delivery errors can reveal registration.
 // Signup delivery failures are reported only when the provider identifies
 // an operational failure independent of the address.
 if(code==='email_provider_disabled' || code==='unexpected_failure' && operation==='signup')return 'failed';
 return operation==='signup'?'confirm':'reset';
}
