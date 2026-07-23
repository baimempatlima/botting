'use client';

import { useState, useTransition } from 'react';
import { addGuestAction, deleteGuestAction, type AddGuestInput } from '../actions';
import type { Guest } from '@/lib/supabase';

interface Props { guests: Guest[]; settings: Record<string, string>; onRefresh: () => void; }

const CATEGORIES = ['keluarga', 'teman', 'kantor', 'lainnya'];

export default function GuestsTab({ guests, settings, onRefresh }: Props) {
  const [form, setForm] = useState<AddGuestInput>({ name: '', phone: '', category: 'keluarga', estimated_pax: 1 });
  const [msg, setMsg] = useState('');
  const [isPending, start] = useTransition();
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    start(async () => {
      const res = await addGuestAction(form);
      if (res.error) setMsg('Error: ' + res.error);
      else { setMsg('✓ Tamu ditambahkan. Slug: ' + res.slug); setForm({ name: '', phone: '', category: 'keluarga', estimated_pax: 1 }); onRefresh(); }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Hapus tamu ini?')) return;
    start(async () => { await deleteGuestAction(id); onRefresh(); });
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${origin}/?to=${slug}`);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  };

  const waLink = (g: Guest) => {
    const phone = g.phone?.replace(/^0/, '62').replace(/\D/g, '') ?? '';
    const link = `${origin}/?to=${g.slug}`;
    const groomName = settings.groom_name || 'Andi';
    const brideName = settings.bride_name || 'Tenri';
    const rawDate = settings.wedding_date || '2026-12-12T08:00:00+08:00';
    const displayDate = new Date(rawDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const text = encodeURIComponent(`Assalamu'alaikum, Bapak/Ibu/Saudara/i *${g.name}* di tempat\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, untuk menghadiri acara Resepsi Pernikahan Kami
:\n *${groomName} & ${brideName}* | ${displayDate}\n\nBuka undangan digital Bapak/Ibu/Saudara/i:\n ${link}\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.\n\nKami yang berbahagia\nKeluarga Kedua Mempelai \n\nMohon maaf perihal undangan hanya dibagikan melalui pesan ini.`);
    return `https://wa.me/${phone}?text=${text}`;
  };

  const filtered = guests.filter(g => g.name.toLowerCase().includes(filter.toLowerCase()) || g.category.includes(filter.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Add Form */}
      <div className="bg-white rounded-2xl border border-bugis-gold/15 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-bugis-cream/30">
          <h3 className="font-playfair text-lg text-bugis-maroon">Tambah Tamu Baru</h3>
        </div>
        <form onSubmit={handleAdd} className="p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="label-xs">Nama Lengkap *</label>
            <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Muhammad Rizal" className="admin-input" />
          </div>
          <div>
            <label className="label-xs">No. WhatsApp</label>
            <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="08123456789" className="admin-input" />
          </div>
          <div>
            <label className="label-xs">Kategori</label>
            <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="admin-input">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label-xs">Est. Orang</label>
            <input type="number" min={1} max={20} value={form.estimated_pax} onChange={e => setForm(f => ({...f, estimated_pax: +e.target.value}))} className="admin-input" />
          </div>
          <div className="sm:col-span-2 lg:col-span-4 flex items-center gap-4">
            <button type="submit" disabled={isPending} className="admin-btn-primary">
              {isPending ? 'Menyimpan...' : '+ Tambah Tamu'}
            </button>
            {msg && <p className={`font-poppins text-xs ${msg.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}
          </div>
        </form>
      </div>

      {/* Guest Table */}
      <div className="bg-white rounded-2xl border border-bugis-gold/15 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <h3 className="font-playfair text-lg text-bugis-maroon">Daftar Tamu ({filtered.length})</h3>
          <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Cari nama / kategori..." className="admin-input max-w-xs" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                {['Nama', 'Kategori', 'Est.', 'Link Personal', 'Aksi'].map(h => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400 font-poppins text-xs">Belum ada tamu terdaftar.</td></tr>
              )}
              {filtered.map(g => (
                <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-bugis-maroon font-poppins">{g.name}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-bugis-gold/10 text-bugis-deepgreen text-xs font-poppins">{g.category}</span></td>
                  <td className="px-4 py-3 text-gray-500 font-poppins">{g.estimated_pax}</td>
                  <td className="px-4 py-3 font-poppins text-xs text-gray-500 max-w-[180px] truncate" title={`${origin}/?to=${g.slug}`}>
                    …/?to={g.slug}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => copyLink(g.slug!)} className={`admin-btn-sm ${copied === g.slug ? 'bg-green-100 text-green-700' : ''}`}>
                        {copied === g.slug ? '✓ Copied' : 'Copy Link'}
                      </button>
                      {g.phone && (
                        <a href={waLink(g)} target="_blank" rel="noopener noreferrer" className="admin-btn-sm bg-green-600 text-white hover:bg-green-700">WA</a>
                      )}
                      <button onClick={() => handleDelete(g.id)} className="admin-btn-sm text-red-500 hover:bg-red-50">Hapus</button>
                    </div>
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
