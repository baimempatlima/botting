'use client';

import { useState } from 'react';
import type { RsvpEntry } from '@/lib/supabase';

interface Props { rsvps: RsvpEntry[]; }

const ATTENDANCE_LABEL: Record<string, string> = {
  hadir: 'Hadir',
  tidak_hadir: 'Tidak Hadir',
  ragu: 'Masih Ragu',
};

const ATTENDANCE_COLOR: Record<string, string> = {
  hadir: 'bg-emerald-50 text-emerald-700',
  tidak_hadir: 'bg-red-50 text-red-600',
  ragu: 'bg-amber-50 text-amber-700',
};

function exportCSV(data: RsvpEntry[]) {
  const header = ['Nama', 'Kehadiran', 'Jumlah Tamu', 'Ucapan', 'Waktu'];
  const rows = data.map(r => [
    `"${r.name}"`,
    ATTENDANCE_LABEL[r.attendance] ?? r.attendance,
    r.pax,
    `"${(r.message ?? '').replace(/"/g, '""')}"`,
    new Date(r.created_at).toLocaleString('id-ID'),
  ]);
  const csv = [header, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'rsvp-export.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function RsvpTab({ rsvps }: Props) {
  const [filterAtt, setFilterAtt] = useState('semua');

  const hadir = rsvps.filter(r => r.attendance === 'hadir');
  const totalPax = hadir.reduce((sum, r) => sum + (r.pax ?? 1), 0);
  const filtered = filterAtt === 'semua' ? rsvps : rsvps.filter(r => r.attendance === filterAtt);

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total RSVP', value: rsvps.length, color: 'text-bugis-maroon' },
          { label: 'Hadir', value: hadir.length, color: 'text-emerald-600' },
          { label: 'Tidak Hadir', value: rsvps.filter(r => r.attendance === 'tidak_hadir').length, color: 'text-red-500' },
          { label: 'Est. Tamu Hadir', value: totalPax + ' orang', color: 'text-bugis-deepgreen' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-bugis-gold/15 shadow-sm p-5">
            <p className="font-poppins text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`font-cormorant text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-bugis-gold/15 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <h3 className="font-playfair text-lg text-bugis-maroon">Data RSVP ({filtered.length})</h3>
          <div className="flex items-center gap-3">
            <select value={filterAtt} onChange={e => setFilterAtt(e.target.value)} className="admin-input max-w-[160px]">
              <option value="semua">Semua Status</option>
              <option value="hadir">Hadir</option>
              <option value="tidak_hadir">Tidak Hadir</option>
              <option value="ragu">Ragu</option>
            </select>
            <button onClick={() => exportCSV(rsvps)} className="admin-btn-primary whitespace-nowrap">
              ↓ Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                {['Nama', 'Status', 'Jml', 'Ucapan', 'Waktu'].map(h => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400 font-poppins text-xs">Belum ada data RSVP.</td></tr>
              )}
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-bugis-maroon font-poppins">{r.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-poppins font-medium ${ATTENDANCE_COLOR[r.attendance] ?? ''}`}>
                      {ATTENDANCE_LABEL[r.attendance] ?? r.attendance}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-poppins">{r.pax}</td>
                  <td className="px-4 py-3 font-poppins text-xs text-gray-500 max-w-[200px] truncate" title={r.message ?? ''}>
                    {r.message || <span className="text-gray-300 italic">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-poppins text-xs whitespace-nowrap">
                    {new Date(r.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
