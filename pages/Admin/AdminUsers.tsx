
import React, { useState } from 'react';
import { UserPlus, Shield, Mail, Trash2, Edit3, ShieldAlert, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, StaffUser } from '../../types';
import { Modal } from '../../components/Common/Modal';

const labelClass = "text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 block px-1";
const inputClass = "w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none text-slate-900 font-medium focus:ring-2 focus:ring-[#D9B061] focus:border-[#D9B061] placeholder:text-slate-400 transition-all text-[15px]";

export const AdminUsers = () => {
  const { users, addUser, updateUser, deleteUser, user: currentUser, canManageUser } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);

  const isOwner = currentUser?.role === UserRole.OWNER;

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isOwner) return;
    const fd = new FormData(e.currentTarget);
    addUser({
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      password: fd.get('password') as string,
      role: fd.get('role') as UserRole,
      position: fd.get('position') as string,
    });
    setIsAdding(false);
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser || !isOwner) return;
    const fd = new FormData(e.currentTarget);
    updateUser(editingUser.id, {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      role: fd.get('role') as UserRole,
      position: fd.get('position') as string,
      ...(fd.get('password') ? { password: fd.get('password') as string } : {})
    });
    setEditingUser(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-[#0F2E33] uppercase">Personnel Management</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2 flex items-center gap-2">
            <Shield size={14} className="text-[#D9B061]"/> Authority Level: {currentUser?.role}
          </p>
        </div>
        
        {/* Only show Add button for Owner */}
        {isOwner && (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-[#0F2E33] text-[#D9B061] px-10 py-5 rounded-[30px] font-bold uppercase text-xs tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 transition-all"
          >
            {isAdding ? 'Cancel' : <><UserPlus size={20}/> Enroll New Personnel</>}
          </button>
        )}
      </div>

      {isAdding && isOwner && (
        <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[48px] border border-[#D9B061]/30 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <label className={labelClass}>Full Name</label>
              <input name="name" required className={inputClass} placeholder="Staff Full Name" />
            </div>
            <div>
              <label className={labelClass}>Email (System ID)</label>
              <input name="email" type="email" required className={inputClass} placeholder="email@mousaclinic.com" />
            </div>
            <div>
              <label className={labelClass}>Security Passphrase</label>
              <input name="password" type="password" required className={inputClass} placeholder="••••••••" />
            </div>
            <div>
              <label className={labelClass}>Position / Title</label>
              <input name="position" className={inputClass} placeholder="e.g. Clinical Director" />
            </div>
            <div>
              <label className={labelClass}>Access Role</label>
              <select name="role" className={inputClass}>
                <option value={UserRole.USER}>Standard User</option>
                <option value={UserRole.ADMIN}>Administrator</option>
                <option value={UserRole.OWNER}>Owner</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-[#0F2E33] text-[#D9B061] py-5 rounded-2xl font-bold uppercase text-xs tracking-widest shadow-xl hover:bg-[#1a4d55] transition-all">
                Finalize Registry Entry
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white/40 backdrop-blur-md p-10 rounded-[48px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left pb-6 font-bold text-[10px] uppercase tracking-widest text-slate-400 px-4">Staff Profile</th>
                <th className="text-left pb-6 font-bold text-[10px] uppercase tracking-widest text-slate-400 px-4">Level</th>
                <th className="text-left pb-6 font-bold text-[10px] uppercase tracking-widest text-slate-400 px-4">Last Sync</th>
                {/* Only show Actions header for Owner */}
                {isOwner && <th className="text-right pb-6 font-bold text-[10px] uppercase tracking-widest text-slate-400 px-4">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map(u => {
                const isManageable = canManageUser(u);
                const isSelf = currentUser?.id === u.id;
                
                return (
                  <tr key={u.id} className="group hover:bg-white/30 transition-colors">
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-sm ${
                          u.role === UserRole.OWNER ? 'bg-[#D9B061] text-[#0F2E33]' : 'bg-[#0F2E33] text-[#D9B061]'
                        }`}>
                          {u.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-[#0F2E33] flex items-center gap-2">
                            {u.name} {isSelf && <span className="text-[9px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">You</span>}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1"><Mail size={12}/> {u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex flex-col gap-1">
                        <span className={`w-fit px-4 py-1.5 rounded-full text-[9px] font-bold uppercase border ${
                          u.role === UserRole.OWNER ? 'bg-black text-[#D9B061] border-black' :
                          u.role === UserRole.ADMIN ? 'bg-[#D9B061]/10 text-[#D9B061] border-[#D9B061]/20' : 
                          'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {u.role}
                        </span>
                        <p className="text-[9px] text-slate-400 font-bold uppercase px-1 tracking-tighter">{u.position}</p>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.lastLogin}</p>
                    </td>
                    {/* Only show Actions cell for Owner */}
                    {isOwner && (
                      <td className="py-6 px-4">
                        <div className="flex justify-end gap-2">
                          {isManageable ? (
                            <>
                              <button 
                                onClick={() => setEditingUser(u)}
                                className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-[#0F2E33] hover:text-[#D9B061] transition-all shadow-sm"
                                title="Edit Credentials"
                              >
                                <Edit3 size={16} />
                              </button>
                              {!isSelf && (
                                <button 
                                  onClick={() => { if(confirm(`Revoke all access for ${u.name}?`)) deleteUser(u.id); }}
                                  className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                  title="Revoke Access"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center gap-2 text-slate-300 pr-2" title="Protected Account">
                              <ShieldCheck size={16} />
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal - Protected by isOwner */}
      {isOwner && editingUser && (
        <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title="Modify Staff Profile">
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div>
              <label className={labelClass}>Full Name</label>
              <input name="name" required className={inputClass} defaultValue={editingUser.name} />
            </div>
            <div>
              <label className={labelClass}>Email (Registry ID)</label>
              <input name="email" type="email" required className={inputClass} defaultValue={editingUser.email} />
            </div>
            <div>
              <label className={labelClass}>Update Security Passphrase (Leave blank to keep current)</label>
              <input name="password" type="password" className={inputClass} placeholder="••••••••" />
            </div>
            <div>
              <label className={labelClass}>Clinical Position</label>
              <input name="position" className={inputClass} defaultValue={editingUser.position} />
            </div>
            <div>
              <label className={labelClass}>Change Access Role</label>
              <select name="role" className={inputClass} defaultValue={editingUser.role}>
                <option value={UserRole.USER}>Standard User</option>
                <option value={UserRole.ADMIN}>Administrator</option>
                <option value={UserRole.OWNER}>Owner</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-[#0F2E33] text-[#D9B061] py-5 rounded-3xl font-bold shadow-xl flex items-center justify-center gap-3">
              Update Clinical Registry
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
