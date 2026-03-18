import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';

const STATUS_LABEL: Record<string, string> = {
  PENDING: '未処理', ESTIMATED: '見積済', FAX_SENT: 'FAX送信済', PRINTED: '印刷済', COMPLETED: '完了',
};
const DOC_LABEL: Record<string, string> = {
  estimate: '見積書', delivery: '納品書', invoice: '請求書', copy: 'コピー',
};

export default function StaffCaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productSearch, setProductSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [docType, setDocType] = useState('estimate');
  const [includeInternal, setIncludeInternal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [faxing, setFaxing] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const [cRes, dRes] = await Promise.all([
      api.get(`/cases/${id}`),
      api.get(`/documents/${id}`),
    ]);
    setCaseData(cRes.data);
    setDocuments(dRes.data);
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function searchProducts(q: string) {
    if (!q.trim()) return setSearchResults([]);
    setSearching(true);
    const { data } = await api.get(`/products?q=${encodeURIComponent(q)}`);
    setSearchResults(data);
    setSearching(false);
  }

  async function assignProduct(itemId: string, product: any) {
    const updatedItems = caseData.items.map((item: any) =>
      item.id === itemId ? { ...item, productId: product.smaregiId, product } : item
    );
    await api.put(`/cases/${id}`, {
      ...caseData,
      workDate: caseData.workDate,
      customerId: caseData.customer.id,
      items: updatedItems.map((i: any) => ({
        partNumberRaw: i.partNumberRaw,
        quantity: i.quantity,
        productId: i.productId || null,
      })),
    });
    setSearchResults([]);
    setProductSearch('');
    await load();
  }

  async function generateDocument() {
    setGenerating(true);
    setError('');
    setMsg('');
    try {
      const { data } = await api.post(`/documents/${id}`, { type: docType, includeInternal });
      setMsg(`${DOC_LABEL[docType]}を作成しました`);
      setDocuments((prev) => [data.document, ...prev]);
      await load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'エラーが発生しました');
    } finally {
      setGenerating(false);
    }
  }

  async function sendFax(documentId: string) {
    setFaxing(true);
    setError('');
    setMsg('');
    try {
      const { data } = await api.post(`/fax/${id}`, { documentId });
      setMsg(data.message);
      await load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'FAX送信に失敗しました');
    } finally {
      setFaxing(false);
    }
  }

  async function updateStatus(status: string) {
    await api.put(`/cases/${id}`, { ...caseData, customerId: caseData.customer.id, status });
    await load();
  }

  async function markPrinted() {
    await api.put(`/cases/${id}`, { ...caseData, customerId: caseData.customer.id, printed: true, status: 'PRINTED' });
    await load();
  }

  if (loading) return <p className="text-center text-gray-500 mt-8">読み込み中...</p>;
  if (!caseData) return <p className="text-center text-red-500 mt-8">案件が見つかりません</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <button onClick={() => navigate('/staff')} className="text-blue-600 hover:underline text-sm">← 一覧に戻る</button>

      {msg && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2 text-sm">{msg}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">{error}</div>}

      {/* Case Info */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">{caseData.vehicleType}</h2>
          <span className="text-sm text-gray-500">ステータス: {STATUS_LABEL[caseData.status]}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>顧客: <span className="font-medium text-gray-800">{caseData.customer?.name}</span></div>
          <div>FAX: {caseData.customer?.faxNumber || '未登録'}</div>
          <div>作業日: {new Date(caseData.workDate).toLocaleDateString('ja-JP')}</div>
          <div>担当: {caseData.worker?.name}</div>
          {caseData.notes && <div className="col-span-2">備考: {caseData.notes}</div>}
          {caseData.internalNotes && <div className="col-span-2 text-orange-600">社内メモ: {caseData.internalNotes}</div>}
          {caseData.invoiceNumber && <div className="col-span-2">請求書番号: <span className="font-mono font-medium">{caseData.invoiceNumber}</span></div>}
        </div>
      </div>

      {/* Items & Product Assignment */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold text-gray-700 mb-3">部品一覧・製品割り当て</h3>
        <div className="space-y-3">
          {caseData.items?.map((item: any) => (
            <div key={item.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-mono text-gray-700">{item.partNumberRaw}</span>
                  <span className="text-xs text-gray-400 ml-2">× {item.quantity}</span>
                </div>
                {item.product ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {item.product.name} — ¥{item.product.price?.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">未割り当て</span>
                )}
              </div>
              {!item.product && (
                <div className="mt-2">
                  <div className="flex gap-2">
                    <input
                      placeholder="製品を検索..."
                      value={productSearch}
                      onChange={(e) => { setProductSearch(e.target.value); searchProducts(e.target.value); }}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {searching && <span className="text-xs text-gray-400 self-center">検索中...</span>}
                  </div>
                  {searchResults.length > 0 && (
                    <div className="mt-1 border rounded-lg divide-y max-h-40 overflow-y-auto">
                      {searchResults.map((p) => (
                        <button
                          key={p.smaregiId}
                          onClick={() => assignProduct(item.id, p)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition"
                        >
                          <span className="font-medium">{p.name}</span>
                          <span className="text-gray-400 ml-2">{p.partNumber}</span>
                          <span className="text-blue-600 ml-2">¥{p.price?.toLocaleString()}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Document Generation */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold text-gray-700 mb-3">文書作成</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(DOC_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={includeInternal} onChange={(e) => setIncludeInternal(e.target.checked)} />
            社内メモを含める
          </label>
          <button
            onClick={generateDocument}
            disabled={generating}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {generating ? '作成中...' : 'PDFを作成'}
          </button>
        </div>

        {documents.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-600">作成済み文書</p>
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between border rounded-lg px-3 py-2">
                <div className="text-sm">
                  <span className="font-medium">{DOC_LABEL[doc.type] || doc.type}</span>
                  <span className="text-gray-400 ml-2 text-xs">{new Date(doc.createdAt).toLocaleString('ja-JP')}</span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={doc.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    表示
                  </a>
                  <button
                    onClick={() => sendFax(doc.id)}
                    disabled={faxing || caseData.faxSent}
                    className="text-purple-600 hover:underline text-sm disabled:opacity-40"
                  >
                    {faxing ? '送信中...' : 'FAX送信'}
                  </button>
                  <button
                    onClick={markPrinted}
                    disabled={caseData.printed}
                    className="text-green-600 hover:underline text-sm disabled:opacity-40"
                  >
                    印刷済みにする
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Management */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold text-gray-700 mb-3">ステータス管理</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(STATUS_LABEL).map(([k, v]) => (
            <button
              key={k}
              onClick={() => updateStatus(k)}
              disabled={caseData.status === k}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                caseData.status === k
                  ? 'bg-blue-600 text-white cursor-default'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
