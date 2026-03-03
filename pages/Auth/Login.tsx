
import React, { useState } from 'react';
import { ShieldCheck, ChevronRight, Loader2, Info } from 'lucide-react';
import { Watermark } from '../../components/Common/Watermark';
import { useAuth } from '../../context/AuthContext';

interface LoginProps {
  // Original props kept for compatibility, though logic moves to context
  handleLogin?: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoggingIn?: boolean;
  onNavigateToSetup: () => void;
}

const inputClass = "w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none text-slate-900 font-medium focus:ring-2 focus:ring-[#D9B061] focus:border-[#D9B061] placeholder:text-slate-400 transition-all text-[15px]";
const labelClass = "text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 block px-1";

export const Login = ({ onNavigateToSetup }: LoginProps) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = fd.get('email') as string;
    const password = fd.get('password') as string;

    try {
      await login(email, password);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <Watermark />
      <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white p-12 space-y-10 animate-in zoom-in-95 duration-300">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-[#0F2E33] rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-[#0F2E33]/20">
            <ShieldCheck size={40} className="text-[#D9B061]" />
          </div>
          <h2 className="text-3xl font-bold text-[#0F2E33] tracking-tight">Mousa Clinic Registry</h2>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Local MedFlow Terminal</p>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 text-red-500 text-xs font-bold rounded-2xl border border-red-100 text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Clinical Identification</label>
              <input name="email" type="email" placeholder="email@example.com" required className={inputClass} disabled={loading} />
            </div>
            <div>
              <label className={labelClass}>Security Passphrase</label>
              <input name="password" type="password" placeholder="••••••••" required className={inputClass} disabled={loading} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#0F2E33] text-[#D9B061] py-5 rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : "Access System"} <ChevronRight size={20} />
          </button>
        </form>
        
        <div className="pt-6 space-y-4">
           <div className="p-4 bg-slate-100/50 rounded-2xl flex items-start gap-3 border border-slate-200">
              <div className="text-[11px] text-slate-500 leading-tight space-y-1">
                <p><strong>Security Protocols Active</strong></p>
                <p>Identity verification is required for all clinical access turns. Contact administration for account provisioning.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
