import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';

const STATUS_LABEL: Record<string, string> = {
  PENDING: '未処理', ESTIMATED: '見積済', FAX_SENT: 'FAX送信済', PRINTED: '印刷済', COMPLETED: '完了',
};
const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ESTIMATED: 'bg-blue-100 text-blue-800',
  FAX_SENT: 'bg-purple-100 text-purple-800',
  PRINTED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
};

export default function StaffCaseList() {
  const [cases, setCases] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/cases').then((r) => setCases(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = cases.filter((c) =>
    !filter || c.status === filter
  );

  if (loading) return <p className="text-center text-gray-500 mt-8">読み込み中...</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-700">案件一覧</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">すべて</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3">車種</th>
              <th className="px-4 py-3">顧客</th>
              <th className="px-4 py-3">作業日</th>
              <th className="px-4 py-3">担当者</th>
              <th className="px-4 py-3">ステータス</th>
              <th className="px-4 py-3">FAX</th>
              <th className="px-4 py-3">印刷</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">案件がありません</td></tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{c.vehicleType}</td>
                <td className="px-4 py-3 text-gray-600">{c.customer?.name}</td>
                <td className="px-4 py-3 text-gray-600">{new Date(c.workDate).toLocaleDateString('ja-JP')}</td>
                <td className="px-4 py-3 text-gray-600">{c.worker?.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[c.status]}`}>
                    {STATUS_LABEL[c.status]}
                  </span>
                </td>
                <td className="px-4 py-3">{c.faxSent ? '✅' : '—'}</td>
                <td className="px-4 py-3">{c.printed ? '✅' : '—'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => navigate(`/staff/cases/${c.id}`)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    詳細
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
