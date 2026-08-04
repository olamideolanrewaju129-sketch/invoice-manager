import React from 'react';

export default async function HealthPage() {
  let data = null;
  let error = null;

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`API returned status: ${res.status}`);
    }
    data = await res.json();
    
    // Check if the API returned an error in its body
    if (data.result === 'error') {
      throw new Error(data['error-type'] || 'Unknown API error');
    }
  } catch (err) {
    error = err.message;
  }

  // Define the currencies we want to display
  const targetCurrencies = ['EUR', 'GBP', 'NGN', 'JPY', 'AUD', 'CAD'];
  const ratesToDisplay = data && data.rates ? targetCurrencies.map(currency => ({
    currency,
    rate: data.rates[currency]
  })).filter(r => r.rate !== undefined) : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Health</h1>
          <p className="text-slate-500 mt-1">Live exchange rate API integration status</p>
        </div>
        <div className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold shadow-sm ${error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${error ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></span>
          {error ? 'Degraded' : 'Operational'}
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800 shadow-sm">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Service Disruption
          </h2>
          <p className="text-sm">We are unable to fetch live data from the exchange rate API at this moment.</p>
          <div className="mt-4 p-3 bg-white/60 rounded-lg font-mono text-sm border border-red-100 text-red-600">
            Error: {error}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md duration-300">
          <div className="p-6 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-slate-50 to-white">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Base Currency</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {data?.base_code?.substring(0, 1) || '$'}
                </div>
                <p className="text-3xl font-bold text-slate-900">{data?.base_code}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Last Update</p>
              <div className="mt-2">
                <p className="text-lg font-semibold text-slate-800">
                  {data?.time_last_update_utc ? new Date(data.time_last_update_utc).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                </p>
                <p className="text-sm text-slate-500 font-medium">
                  {data?.time_last_update_utc ? new Date(data.time_last_update_utc).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }) : ''}
                </p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Target Currency</th>
                  <th className="px-6 py-4 font-semibold text-right">Exchange Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ratesToDisplay.map((item) => (
                  <tr key={item.currency} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {item.currency.substring(0, 2)}
                        </div>
                        <span className="font-semibold text-slate-700">{item.currency}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-right text-slate-700 font-medium">
                      {item.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
