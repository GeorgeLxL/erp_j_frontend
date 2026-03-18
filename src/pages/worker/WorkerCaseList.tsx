import { useEffect, useState } from 'react';
import api from '../../api/client';

const STATUS_LABEL: Record<string, string> = {
  PENDING: '未処理',
  ESTIMATED: '見積済',
  FAX_SENT: 'FAX送信済',
  PRINTED: '印刷済',
  COMPLETED: '完了',
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ESTIMATED: 'bg-blue-100 text-blue-800',
  FAX_SENT: 'bg-purple-100 text-purple-800',
  PRINTED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
};

export default function WorkerCaseList() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cases').then((r) => setCases(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-gray-500 mt-8">読み込み中...</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <h2 className="text-lg font-bold text-gray-700">自分の案件一覧</h2>
      {cases.length === 0 && <p className="text-gray-500 text-sm">案件がありません</p>}
      {cases.map((c) => (
        <div key={c.id} className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-gray-800">{c.vehicleType}</span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[c.status]}`}>
              {STATUS_LABEL[c.status]}
            </span>
          </div>
          <p className="text-sm text-gray-600">顧客: {c.customer?.name}</p>
          <p className="text-sm text-gray-600">作業日: {new Date(c.workDate).toLocaleDateString('ja-JP')}</p>
          {c.notes && <p className="text-sm text-gray-500 mt-1">備考: {c.notes}</p>}
          <p className="text-xs text-gray-400 mt-2">部品: {c.items?.map((i: any) => i.partNumberRaw).join(', ')}</p>
        </div>
      ))}
    </div>
  );
}
