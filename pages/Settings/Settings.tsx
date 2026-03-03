
import React from 'react';
import { ShieldCheck, UserCog, Power } from 'lucide-react';
import { StaffUser, UserRole } from '../../types';

interface SettingsProps {
  currentUser: any;
  staff: StaffUser[];
  onToggleActive: (id: string) => void;
  onChangeRole: (id: string, role: UserRole) => void;
  requestPasswordUpdate: (data: any) => void;
  patientsCount: number;
}

const labelClass = "text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 block px-1";
const inputClass = "w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none text-slate-900 font-medium focus:ring-2 focus:ring-[#D9B061] focus:border-[#D9B061] placeholder:text-slate-400 transition-all text-[15px]";

export const Settings = ({ 
  currentUser, 
  staff, 
  onToggleActive, 
  onChangeRole,
  requestPasswordUpdate, 
  patientsCount 
}: SettingsProps) => {
  return (
    <div className="space-y-12 pb-20 animate-in slide-in-from-bottom-5 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-[#0F2E33] uppercase">Control Center</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Access Permissions & Account Management</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white/60 backdrop-blur-md px-8 py-4 rounded-[24px] border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Accounts</p>
              <p className="text-2xl font-bold text-[#0F2E33] tracking-tight">{staff.length}</p>
           </div>
        </div>
      </div>

      {/* Account Management Table */}
      <div className="bg-white/40 backdrop-blur-md p-10 rounded-[48px] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
           <div className="p-3 bg-[#0F2E33] rounded-2xl text-[#D9B061]">
              <UserCog size={22} />
           </div>
           <h4 className="text-xl font-bold uppercase text-[#0F2E33]">System Access Registry</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left pb-4 font-bold text-[10px] uppercase tracking-widest text-slate-400 px-4">Staff Account</th>
                <th className="text-left pb-4 font-bold text-[10px] uppercase tracking-widest text-slate-400 px-4">Access Level</th>
                <th className="text-right pb-4 font-bold text-[10px] uppercase tracking-widest text-slate-400 px-4">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {staff.map(member => (
                <tr key={member.id} className="group hover:bg-white/30 transition-colors">
                  <td className="py-6 px-4">
                    <p className="font-bold text-[#0F2E33]">{member.name}</p>
                    <p className="text-xs text-slate-400">{member.email}</p>
                  </td>
                  <td className="py-6 px-4">
                    <select 
                      value={member.role}
                      onChange={(e) => onChangeRole(member.id, e.target.value as UserRole)}
                      className="bg-white border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold text-[#0F2E33] outline-none focus:ring-1 focus:ring-[#D9B061]"
                    >
                      <option value={UserRole.USER}>STAFF USER</option>
                      <option value={UserRole.ADMIN}>ADMINISTRATOR</option>
                    </select>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${member.isActive ? 'text-emerald-500' : 'text-red-400'}`}>
                        {member.isActive ? 'Active' : 'Disabled'}
                      </span>
                      <button 
                        onClick={() => onToggleActive(member.id)}
                        className={`p-3 rounded-2xl transition-all shadow-sm ${
                          member.isActive 
                          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' 
                          : 'bg-red-50 text-red-400 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <Power size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-white/40 backdrop-blur-md p-10 rounded-[48px] border border-slate-200 shadow-sm space-y-8 w-full max-w-2xl">
          <h4 className="text-lg font-bold uppercase text-[#0F2E33] flex items-center gap-3">
            <ShieldCheck size={24} className="text-[#D9B061]" /> Update Credentials
          </h4>
          <form onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            requestPasswordUpdate({ newPass: fd.get('newPass'), confirmPass: fd.get('confirmPass') });
          }} className="space-y-4">
            <div><label className={labelClass}>Authenticated Email</label><input value={currentUser?.email} className={inputClass} readOnly /></div>
            <div><label className={labelClass}>New Security Key</label><input name="newPass" type="password" required className={inputClass} /></div>
            <button type="submit" className="w-full bg-[#0F2E33] text-[#D9B061] py-5 rounded-[24px] font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-[1.01] transition-all">Update Security</button>
          </form>
        </div>
      </div>
    </div>
  );
};
