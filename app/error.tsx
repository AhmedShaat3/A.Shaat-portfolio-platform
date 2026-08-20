"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-8 font-sans">
        <div className="max-w-2xl w-full bg-neutral-900 border border-red-900/50 rounded-xl p-6 shadow-2xl">
          <div className="mb-4 flex items-center gap-2 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            <span className="font-bold">Application Error Detected</span>
          </div>
          
          <div className="bg-black p-4 rounded border border-neutral-800 overflow-auto mb-4">
            <p className="text-zinc-400 text-xs font-mono mb-1">Error Message:</p>
            <p className="text-white text-sm font-mono break-all">{error.message}</p>
            
            {error.digest && (
              <div className="mt-3 pt-3 border-t border-neutral-800">
                <p className="text-zinc-500 text-xs font-mono">Digest: {error.digest}</p>
              </div>
            )}
          </div>

          <button
            onClick={reset}
            className="w-full rounded bg-white px-4 py-3 text-black text-sm font-bold hover:bg-neutral-200 transition-colors"
          >
            Try Again
          </button>
          
          <p className="text-center text-xs text-zinc-600 mt-4">
            If the error persists, check your database connection and table schemas.
          </p>
        </div>
      </body>
    </html>
  );
}