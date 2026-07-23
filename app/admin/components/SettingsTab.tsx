'use client';

import { useState, useTransition } from 'react';
import { updateSettingAction } from '../content-actions';

interface Props {
  initial: Record<string, string>;
  onRefresh: () => void;
}

export default function SettingsTab({ initial, onRefresh }: Props) {
  const [vals, setVals] = useState(initial);
  const [msg, setMsg] = useState('');
  const [isPending, start] = useTransition();

  const set = (k: string, v: string) => setVals(prev => ({ ...prev, [k]: v }));

  const save = (key: string) => {
    start(async () => {
      const res = await updateSettingAction(key, vals[key] ?? '');
      if (res.error) setMsg('Error: ' + res.error);
      else { setMsg(`✓ ${key} tersimpan!`); onRefresh(); }
      setTimeout(() => setMsg(''), 3000);
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-bugis-gold/15 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-bugis-cream/30">
          <h3 className="font-playfair text-lg text-bugis-maroon">Pengaturan Umum</h3>
          <p className="font-poppins text-xs text-gray-400 mt-1">Tanggal pernikahan digunakan oleh Countdown dan seluruh undangan</p>
        </div>
        <div className="p-6 space-y-6">
          {/* Wedding Date */}
          <div className="grid sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="label-xs">Tanggal &amp; Waktu Pernikahan</label>
              <input type="datetime-local" value={(vals.wedding_date ?? '').slice(0, 16)} onChange={e => set('wedding_date', e.target.value + ':00+08:00')} className="admin-input" />
            </div>
            <button onClick={() => save('wedding_date')} disabled={isPending} className="admin-btn-primary h-10">Simpan Tanggal</button>
          </div>

          {/* Groom Name */}
          <div className="grid sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="label-xs">Nama Mempelai Pria</label>
              <input value={vals.groom_name ?? ''} onChange={e => set('groom_name', e.target.value)} className="admin-input" />
            </div>
            <button onClick={() => save('groom_name')} disabled={isPending} className="admin-btn-primary h-10">Simpan</button>
          </div>

          {/* Bride Name */}
          <div className="grid sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="label-xs">Nama Mempelai Wanita</label>
              <input value={vals.bride_name ?? ''} onChange={e => set('bride_name', e.target.value)} className="admin-input" />
            </div>
            <button onClick={() => save('bride_name')} disabled={isPending} className="admin-btn-primary h-10">Simpan</button>
          </div>

          {msg && <p className={`font-poppins text-xs ${msg.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}
        </div>
      </div>
    </div>
  );
}
