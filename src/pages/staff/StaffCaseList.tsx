import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCases, Case } from '../../api/cases.api';

const STATUS_LABEL: Record<string, string> = {
  PENDING: '未処理', ESTIMATED: '見積済', FAX_SENT: 'FAX送信済', PRINTED: '印刷済', COMPLETED: '完了',
};
const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  ESTIMATED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  FAX_SENT: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  PRINTED: 'bg-green-500/10 text-green-400 border-green-500/20',
  COMPLETED: 'bg-white/5 text-white/40 border-white/10',
};

export default function StaffCaseList() {
  const [cases, setCases] = useState<Case[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCases().then(setCases).finally(() => setLoading(false));
  }, []);

  const filtered = cases.filter((c) => !filter || c.status === filter);

  if (loading) return <p className="text-center text-white/30 mt-12 tracking-widest">読み込み中...</p>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-medium tracking-widest text-white/50 uppercase">案件一覧</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-luxury w-auto text-xs tracking-wide">
          <option value="">すべて</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['車種', '顧客', '作業日', '担当者', 'ステータス', 'FAX', '印刷', ''].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs tracking-widest text-white/30 uppercase font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center py-12 text-white/20 tracking-widest">案件がありません</td></tr>
            )}
            {filtered.map((c, i) => (
              <tr key={c.id} className={`border-b border-white/5 glass-hover transition cursor-pointer ${i === filtered.length - 1 ? 'border-b-0' : ''}`}>
                <td className="px-5 py-4 font-medium text-white/90">{c.vehicleType}</td>
                <td className="px-5 py-4 text-white/50">{c.customer?.name}</td>
                <td className="px-5 py-4 text-white/50">{new Date(c.workDate).toLocaleDateString('ja-JP')}</td>
                <td className="px-5 py-4 text-white/50">{c.worker?.name}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLOR[c.status]}`}>
                    {STATUS_LABEL[c.status]}
                  </span>
                </td>
                <td className="px-5 py-4 text-white/40">{c.faxSent ? '✓' : '—'}</td>
                <td className="px-5 py-4 text-white/40">{c.printed ? '✓' : '—'}</td>
                <td className="px-5 py-4">
                  <button onClick={() => navigate(`/staff/cases/${c.id}`)} className="text-xs tracking-widest gold hover:opacity-70 transition uppercase">
                    詳細 →
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
