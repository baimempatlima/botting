'use client';

import { useState, useRef, useTransition } from 'react';
import { bulkImportAction, type CsvRow } from '../actions';

interface Props { onRefresh: () => void; }

const CSV_TEMPLATE = `nama,nomor_wa,kategori,estimated_pax
Pak Hasan Basri,08123456789,keluarga,2
Tim Marketing,08234567890,kantor,5
Siti Rahma,08345678901,teman,1`;

function downloadTemplate() {
  const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'template-tamu.csv'; a.click();
  URL.revokeObjectURL(url);
}

function parseCSV(text: string): CsvRow[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const header = lines[0].toLowerCase().split(',').map(h => h.trim());
  const nameIdx    = header.findIndex(h => h.includes('nama'));
  const phoneIdx   = header.findIndex(h => h.includes('wa') || h.includes('phone') || h.includes('nomor'));
  const catIdx     = header.findIndex(h => h.includes('kategori') || h.includes('cat'));
  const paxIdx     = header.findIndex(h => h.includes('pax') || h.includes('orang') || h.includes('est'));

  return lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    return {
      name:          cols[nameIdx]  ?? '',
      phone:         cols[phoneIdx] ?? '',
      category:      cols[catIdx]   ?? 'lainnya',
      estimated_pax: Number(cols[paxIdx]) || 1,
    };
  }).filter(r => r.name);
}

export default function ImportTab({ onRefresh }: Props) {
  const [preview, setPreview] = useState<CsvRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState('');
  const [isPending, start] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target?.result as string);
      setPreview(rows);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!preview.length) return;
    start(async () => {
      const res = await bulkImportAction(preview);
      if (res.error) setResult('Error: ' + res.error);
      else { setResult(`✓ ${res.count} tamu berhasil diimpor!`); setPreview([]); setFileName(''); onRefresh(); if (inputRef.current) inputRef.current.value = ''; }
    });
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-white rounded-2xl border border-bugis-gold/15 shadow-sm p-6">
        <h3 className="font-playfair text-lg text-bugis-maroon mb-4">Import Tamu dari CSV</h3>
        <div className="space-y-4">
          <div className="bg-bugis-cream/40 rounded-xl p-4 border border-bugis-gold/15">
            <p className="font-poppins text-xs font-semibold text-bugis-deepgreen mb-2 uppercase tracking-wider">Langkah-langkah:</p>
            <ol className="font-poppins text-xs text-gray-600 space-y-1 list-decimal list-inside">
              <li>Download template CSV di bawah</li>
              <li>Isi data tamu di spreadsheet (Excel/Google Sheets)</li>
              <li>Export sebagai <strong>.csv</strong></li>
              <li>Upload dan klik Import</li>
            </ol>
          </div>

          <button onClick={downloadTemplate} className="admin-btn-primary">
            ↓ Download Template CSV
          </button>
        </div>
      </div>

      {/* Upload */}
      <div className="bg-white rounded-2xl border border-bugis-gold/15 shadow-sm p-6">
        <h3 className="font-playfair text-lg text-bugis-maroon mb-4">Upload File CSV</h3>

        <label className="block w-full border-2 border-dashed border-bugis-gold/30 rounded-xl p-8 text-center cursor-pointer hover:border-bugis-gold/60 transition-colors bg-bugis-cream/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-bugis-gold/50 mx-auto mb-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          <p className="font-poppins text-sm text-gray-500">
            {fileName ? <strong className="text-bugis-maroon">{fileName}</strong> : 'Klik untuk pilih file CSV'}
          </p>
          <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
        </label>

        {/* Preview */}
        {preview.length > 0 && (
          <div className="mt-6">
            <p className="font-poppins text-xs font-semibold text-bugis-deepgreen uppercase tracking-wider mb-3">
              Preview ({preview.length} baris)
            </p>
            <div className="overflow-x-auto max-h-60 overflow-y-auto rounded-xl border border-gray-100">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>{['Nama', 'No. WA', 'Kategori', 'Est.'].map(h => <th key={h} className="px-3 py-2 text-left text-gray-500 font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {preview.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-poppins text-bugis-maroon">{r.name}</td>
                      <td className="px-3 py-2 text-gray-500">{r.phone || '—'}</td>
                      <td className="px-3 py-2"><span className="px-1.5 py-0.5 bg-bugis-gold/10 text-bugis-deepgreen rounded">{r.category}</span></td>
                      <td className="px-3 py-2 text-gray-500">{r.estimated_pax}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <button onClick={handleImport} disabled={isPending} className="admin-btn-primary">
                {isPending ? 'Mengimpor...' : `Import ${preview.length} Tamu`}
              </button>
              {result && <p className={`font-poppins text-xs ${result.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>{result}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
