'use client';

import { useState, useTransition } from 'react';
import {
  upsertProsesiAction, deleteProsesiAction,
  upsertCoupleAction,
  upsertLocationAction, deleteLocationAction,
  upsertPhotoAction, deletePhotoAction,
  upsertBankAction, deleteBankAction,
} from '../content-actions';
import type { Prosesi, CoupleProfileData, EventLocation, GalleryPhoto, BankAccount } from '@/lib/types';

interface Props {
  prosesi: Prosesi[];
  couple: CoupleProfileData[];
  locations: EventLocation[];
  gallery: GalleryPhoto[];
  banks: BankAccount[];
  onRefresh: () => void;
}

type SubTab = 'prosesi' | 'couple' | 'lokasi' | 'gallery' | 'bank';

export default function ContentTab({ prosesi, couple, locations, gallery, banks, onRefresh }: Props) {
  const [sub, setSub] = useState<SubTab>('prosesi');
  const [isPending, start] = useTransition();
  const [msg, setMsg] = useState('');

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm w-fit">
        {([
          ['prosesi', 'Prosesi'],
          ['couple', 'Mempelai'],
          ['lokasi', 'Lokasi'],
          ['gallery', 'Galeri'],
          ['bank', 'Amplop'],
        ] as [SubTab, string][]).map(([id, label]) => (
          <button key={id} onClick={() => setSub(id)}
            className={`px-4 py-2 rounded-lg font-poppins text-xs font-medium transition-all
              ${sub === id ? 'bg-bugis-deepgreen text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
            {label}
          </button>
        ))}
      </div>

      {msg && <p className={`font-poppins text-xs ${msg.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}

      {/* ─── Prosesi ─── */}
      {sub === 'prosesi' && (
        <CrudTable
          title="Prosesi Pernikahan"
          items={prosesi}
          fields={[
            { key: 'name', label: 'Nama Prosesi', required: true },
            { key: 'subtitle', label: 'Subtitle' },
            { key: 'event_date', label: 'Tanggal' },
            { key: 'event_time', label: 'Waktu' },
            { key: 'description', label: 'Deskripsi', type: 'textarea' },
            { key: 'sort_order', label: 'Urutan', type: 'number' },
          ]}
          onSave={(item) => start(async () => { const r = await upsertProsesiAction(item as Prosesi & { name: string }); if (r.error) flash('Error: ' + r.error); else { flash('✓ Tersimpan'); onRefresh(); } })}
          onDelete={(id) => start(async () => { await deleteProsesiAction(id); flash('✓ Dihapus'); onRefresh(); })}
          isPending={isPending}
        />
      )}

      {/* ─── Couple ─── */}
      {sub === 'couple' && (
        <CrudTable
          title="Profil Mempelai"
          items={couple}
          fields={[
            { key: 'role', label: 'Peran', type: 'select', options: ['pria', 'wanita'], required: true },
            { key: 'name', label: 'Nama Lengkap', required: true },
            { key: 'father_name', label: 'Nama Ayah' },
            { key: 'mother_name', label: 'Nama Ibu' },
            { key: 'birth_order', label: 'Urutan Anak (cth: Putra Pertama)' },
            { key: 'photo_url', label: 'URL Foto' },
            { key: 'instagram', label: 'Instagram (username)' },
            { key: 'facebook', label: 'Facebook (username)' },
          ]}
          onSave={(item) => start(async () => { const r = await upsertCoupleAction(item as CoupleProfileData & { name: string; role: string }); if (r.error) flash('Error: ' + r.error); else { flash('✓ Tersimpan'); onRefresh(); } })}
          isPending={isPending}
          canDelete={false}
        />
      )}

      {/* ─── Lokasi ─── */}
      {sub === 'lokasi' && (
        <CrudTable
          title="Lokasi Acara"
          items={locations}
          fields={[
            { key: 'label', label: 'Label Acara', required: true },
            { key: 'event_date', label: 'Tanggal (teks)' },
            { key: 'time_start', label: 'Jam Mulai (HH:MM)' },
            { key: 'time_end', label: 'Jam Selesai (HH:MM)' },
            { key: 'time_display', label: 'Waktu Tampilan' },
            { key: 'venue_name', label: 'Nama Tempat' },
            { key: 'address', label: 'Alamat' },
            { key: 'city', label: 'Kota' },
            { key: 'map_embed_url', label: 'Google Maps Embed URL' },
            { key: 'map_direct_url', label: 'Google Maps Direct URL' },
            { key: 'sort_order', label: 'Urutan', type: 'number' },
          ]}
          onSave={(item) => start(async () => { const r = await upsertLocationAction(item as EventLocation & { label: string }); if (r.error) flash('Error: ' + r.error); else { flash('✓ Tersimpan'); onRefresh(); } })}
          onDelete={(id) => start(async () => { await deleteLocationAction(id); flash('✓ Dihapus'); onRefresh(); })}
          isPending={isPending}
        />
      )}

      {/* ─── Gallery ─── */}
      {sub === 'gallery' && (
        <CrudTable
          title="Foto Galeri"
          items={gallery}
          fields={[
            { key: 'src', label: 'URL / Path Foto', required: true },
            { key: 'title', label: 'Judul' },
            { key: 'description', label: 'Deskripsi' },
            { key: 'span_class', label: 'CSS Span (cth: col-span-2 row-span-2)' },
            { key: 'sort_order', label: 'Urutan', type: 'number' },
          ]}
          onSave={(item) => start(async () => { const r = await upsertPhotoAction(item as GalleryPhoto & { src: string }); if (r.error) flash('Error: ' + r.error); else { flash('✓ Tersimpan'); onRefresh(); } })}
          onDelete={(id) => start(async () => { await deletePhotoAction(id); flash('✓ Dihapus'); onRefresh(); })}
          isPending={isPending}
        />
      )}

      {/* ─── Bank ─── */}
      {sub === 'bank' && (
        <CrudTable
          title="Amplop Digital (Rekening)"
          items={banks}
          fields={[
            { key: 'bank_name', label: 'Nama Bank', required: true },
            { key: 'account_number', label: 'No. Rekening', required: true },
            { key: 'account_holder', label: 'Atas Nama', required: true },
            { key: 'qris_url', label: 'URL Gambar QRIS' },
            { key: 'sort_order', label: 'Urutan', type: 'number' },
          ]}
          onSave={(item) => start(async () => { const r = await upsertBankAction(item as BankAccount & { bank_name: string; account_number: string; account_holder: string }); if (r.error) flash('Error: ' + r.error); else { flash('✓ Tersimpan'); onRefresh(); } })}
          onDelete={(id) => start(async () => { await deleteBankAction(id); flash('✓ Dihapus'); onRefresh(); })}
          isPending={isPending}
        />
      )}
    </div>
  );
}

// ─── Generic CRUD table component ────────────────────────────
interface FieldDef {
  key: string;
  label: string;
  required?: boolean;
  type?: 'text' | 'textarea' | 'number' | 'select';
  options?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CrudTable({ title, items, fields, onSave, onDelete, isPending, canDelete = true }: {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  fields: FieldDef[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (item: any) => void;
  onDelete?: (id: string) => void;
  isPending: boolean;
  canDelete?: boolean;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emptyRow: any = {};
  fields.forEach(f => { emptyRow[f.key] = f.type === 'number' ? 0 : ''; });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editing, setEditing] = useState<any | null>(null);

  const startEdit = (item: typeof emptyRow | null) => setEditing(item ? { ...item } : { ...emptyRow });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setField = (k: string, v: any) => setEditing((prev: typeof emptyRow) => prev ? { ...prev, [k]: v } : prev);

  return (
    <div className="bg-white rounded-2xl border border-bugis-gold/15 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-bugis-cream/30">
        <h3 className="font-playfair text-lg text-bugis-maroon">{title} ({items.length})</h3>
        <button onClick={() => startEdit(null)} className="admin-btn-primary">+ Tambah</button>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="grid sm:grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label className="label-xs">{f.label} {f.required && '*'}</label>
                {f.type === 'textarea' ? (
                  <textarea value={editing[f.key] ?? ''} onChange={e => setField(f.key, e.target.value)} rows={3} className="admin-input resize-none" />
                ) : f.type === 'select' ? (
                  <select value={editing[f.key] ?? ''} onChange={e => setField(f.key, e.target.value)} className="admin-input">
                    <option value="">Pilih...</option>
                    {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type === 'number' ? 'number' : 'text'} value={editing[f.key] ?? ''} onChange={e => setField(f.key, f.type === 'number' ? +e.target.value : e.target.value)} className="admin-input" />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => onSave(editing)} disabled={isPending} className="admin-btn-primary">
              {isPending ? 'Menyimpan...' : editing.id ? 'Update' : 'Simpan'}
            </button>
            <button onClick={() => setEditing(null)} className="admin-btn-sm">Batal</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              {fields.slice(0, 4).map(f => <th key={f.key} className="px-4 py-3 text-left font-semibold">{f.label}</th>)}
              <th className="px-4 py-3 text-left font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400 font-poppins text-xs">Belum ada data.</td></tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                {fields.slice(0, 4).map(f => (
                  <td key={f.key} className="px-4 py-3 font-poppins text-xs text-gray-600 max-w-[180px] truncate" title={String(item[f.key] ?? '')}>
                    {String(item[f.key] ?? '—').slice(0, 60)}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(item)} className="admin-btn-sm">Edit</button>
                    {canDelete && onDelete && (
                      <button onClick={() => { if (confirm('Hapus?')) onDelete(item.id); }} className="admin-btn-sm text-red-500 hover:bg-red-50">Hapus</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
