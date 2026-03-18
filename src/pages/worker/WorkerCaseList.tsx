import { useEffect, useState } from 'react';
import api from '../../api/client';

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

export default function WorkerCaseList() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cases').then((r) => setCases(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-white/30 mt-12 tracking-widest">読み込み中...</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <h2 className="text-sm font-medium tracking-widest text-white/50 uppercase mb-6">自分の案件一覧</h2>
      {cases.length === 0 && <p className="text-white/20 text-sm tracking-widest">案件がありません</p>}
      {cases.map((c) => (
        <div key={c.id} className="glass rounded-2xl p-5 glass-hover transition">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-white/90">{c.vehicleType}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLOR[c.status]}`}>
              {STATUS_LABEL[c.status]}
            </span>
          </div>
          <div className="space-y-1 text-sm text-white/50">
            <p>顧客: <span className="text-white/70">{c.customer?.name}</span></p>
            <p>作業日: <span className="text-white/70">{new Date(c.workDate).toLocaleDateString('ja-JP')}</span></p>
            {c.notes && <p>備考: <span className="text-white/50">{c.notes}</span></p>}
          </div>
          {c.items?.length > 0 && (
            <p className="text-xs text-white/25 mt-3 font-mono">{c.items.map((i: any) => i.partNumberRaw).join('  ·  ')}</p>
          )}
        </div>
      ))}
    </div>
  );
}
