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
    setError('');
    setLoading(true);
    try {
      await api.post('/cases', { vehicleType, customerId, workDate, notes, internalNotes, items });
      navigate('/worker');
    } catch (err: any) {
      setError(err.response?.data?.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">新規案件入力</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">車種 *</label>
          <input
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            required
            placeholder="例: トヨタ プリウス 2020"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">顧客 *</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">選択してください</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">作業日 *</label>
          <input
            type="date"
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">部品番号（簡略可）</label>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={item.partNumberRaw}
                  onChange={(e) => updateItem(i, 'partNumberRaw', e.target.value)}
                  placeholder="例: TW73, BP-F001"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(i, 'quantity', parseInt(e.target.value))}
                  className="w-16 border border-gray-300 rounded-lg px-2 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 text-lg">✕</button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addItem} className="mt-2 text-blue-600 text-sm hover:underline">
            ＋ 部品を追加
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">備考（見積書に記載）</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">社内メモ（見積書に含めない）</label>
          <textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition text-lg"
        >
          {loading ? '送信中...' : '案件を登録する'}
        </button>
      </form>
    </div>
  );
}
