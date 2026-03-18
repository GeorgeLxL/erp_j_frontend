import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';

interface Customer { id: string; name: string }
interface PartItem { partNumberRaw: string; quantity: number }

export default function WorkerNewCase() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicleType, setVehicleType] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [workDate, setWorkDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [items, setItems] = useState<PartItem[]>([{ partNumberRaw: '', quantity: 1 }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/customers').then((r) => setCustomers(r.data)).catch(() => {});
  }, []);

  function addItem() { setItems([...items, { partNumberRaw: '', quantity: 1 }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }
  function updateItem(i: number, field: keyof PartItem, value: string | number) {
    setItems(items.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!customerId) return setError('顧客を選択してください');
    if (items.some((i) => !i.partNumberRaw.trim())) return setError('部品番号を入力してください');
    setError(''); setLoading(true);
    try {
      await api.post('/cases', { vehicleType, customerId, workDate, notes, internalNotes, items });
      navigate('/worker');
    } catch (err: any) {
      setError(err.response?.data?.message || 'エラーが発生しました');
    } finally { setLoading(false); }
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs text-white/40 mb-1.5 tracking-widest uppercase">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="max-w-lg mx-auto glass rounded-2xl p-6 shadow-2xl">
      <h2 className="text-sm font-medium tracking-widest text-white/50 uppercase mb-6">新規案件入力</h2>
      {error && <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="車種 *">
          <input value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} required placeholder="例: トヨタ プリウス 2020" className="input-luxury" />
        </Field>

        <Field label="顧客 *">
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required className="input-luxury">
            <option value="">選択してください</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>

        <Field label="作業日 *">
          <input type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} required className="input-luxury" />
        </Field>

        <Field label="部品番号">
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={item.partNumberRaw}
                  onChange={(e) => updateItem(i, 'partNumberRaw', e.target.value)}
                  placeholder="例: TW73, BP-F001"
                  className="input-luxury flex-1"
                />
                <input
                  type="number" min={1} value={item.quantity}
                  onChange={(e) => updateItem(i, 'quantity', parseInt(e.target.value))}
                  className="input-luxury w-16 text-center"
                />
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(i)} className="text-white/20 hover:text-red-400 transition text-lg leading-none">✕</button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addItem} className="mt-2 text-xs tracking-widest gold hover:opacity-70 transition uppercase">＋ 部品を追加</button>
        </Field>

        <Field label="備考（見積書に記載）">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="input-luxury resize-none" />
        </Field>

        <Field label="社内メモ（見積書に含めない）">
          <textarea value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} rows={2} className="input-luxury resize-none" />
        </Field>

        <button type="submit" disabled={loading} className="btn-gold w-full py-3 rounded-xl text-sm tracking-widest uppercase">
          {loading ? '送信中...' : '案件を登録する'}
        </button>
      </form>
    </div>
  );
}
