import React from 'react';

export const Watermark = () => (
  <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden select-none print:hidden bg-[#F8FAFC]">
    <div className="absolute inset-0 opacity-[0.08]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='1000' height='1000' viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230F2E33' stroke-width='1.5'%3E%3Cpath d='M-100,100 Q150,50 400,100 T900,100 T1400,100'/%3E%3Cpath d='M-100,200 Q150,150 400,200 T900,200 T1400,200'/%3E%3Cpath d='M-100,300 Q150,250 400,300 T900,300 T1400,300'/%3E%3Cpath d='M-100,400 Q150,350 400,400 T900,400 T1400,400'/%3E%3Cpath d='M-100,500 Q150,450 400,500 T900,500 T1400,500'/%3E%3Cpath d='M-100,600 Q150,550 400,600 T900,600 T1400,600'/%3E%3Cpath d='M-100,700 Q150,650 400,700 T900,700 T1400,700'/%3E%3Cpath d='M-100,800 Q150,750 400,800 T900,800 T1400,800'/%3E%3Cpath d='M-100,900 Q150,850 400,900 T900,900 T1400,900'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: '100% 100%',
    }} />
    <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
      <div className="flex flex-col items-center rotate-[-12deg] scale-110 md:scale-150 transition-all text-[#0F2E33]">
        <h1 className="text-[18vw] font-bold tracking-tighter leading-none">Mousa</h1>
        <p className="text-[6vw] font-normal -mt-[2vw] tracking-widest italic lowercase">clinic</p>
      </div>
    </div>
  </div>
);
