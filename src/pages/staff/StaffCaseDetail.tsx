import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCase, updateCase, type Case } from '../../api/cases.api';
import { getDocuments, createDocument, sendFax, searchProducts, type Document } from '../../api/resources.api';

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
const DOC_LABEL: Record<string, string> = {
  estimate: '見積書', delivery: '納品書', invoice: '請求書', copy: 'コピー',
};

export default function StaffCaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
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
    const [c, docs] = await Promise.all([getCase(id!), getDocuments(id!)]);
    setCaseData(c);
    setDocuments(docs);
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function handleSearchProducts(q: string) {
    setProductSearch(q);
    if (!q.trim()) return setSearchResults([]);
    setSearching(true);
    const results = await searchProducts(q);
    setSearchResults(results);
    setSearching(false);
  }

  async function assignProduct(itemId: string, product: any) {
    if (!caseData) return;
    await updateCase(id!, {
      customerId: caseData.customer.id,
      items: caseData.items.map((item) =>
        item.id === itemId
          ? { partNumberRaw: item.partNumberRaw, quantity: item.quantity, productId: product.smaregiId }
          : { partNumberRaw: item.partNumberRaw, quantity: item.quantity, productId: item.productId }
      ),
    });
    setSearchResults([]);
    setProductSearch('');
    await load();
  }

  async function handleGenerateDocument() {
    setGenerating(true);
    setError('');
    setMsg('');
    try {
      const data = await createDocument(id!, docType, includeInternal);
      setMsg(`${DOC_LABEL[docType]}を作成しました`);
      setDocuments((prev) => [data.document, ...prev]);
      await load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'エラーが発生しました');
    } finally {
      setGenerating(false);
    }
  }

  async function handleSendFax(documentId: string) {
    setFaxing(true);
    setError('');
    setMsg('');
    try {
      const data = await sendFax(id!, documentId);
      setMsg(data.message);
      await load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'FAX送信に失敗しました');
    } finally {
      setFaxing(false);
    }
  }

  async function handleUpdateStatus(status: string) {
    if (!caseData) return;
    await updateCase(id!, { customerId: caseData.customer.id, status });
    await load();
  }

  async function handleMarkPrinted() {
    if (!caseData) return;
    await updateCase(id!, { customerId: caseData.customer.id, printed: true, status: 'PRINTED' });
    await load();
  }

  if (loading) return <p className="text-center text-white/30 mt-12 tracking-widest">読み込み中...</p>;
  if (!caseData) return <p className="text-center text-red-400 mt-12">案件が見つかりません</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <button onClick={() => navigate('/staff')} className="text-xs tracking-widest text-white/30 hover:text-white/60 transition uppercase">← 一覧に戻る</button>

      {msg && <div className="px-4 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">{msg}</div>}
      {error && <div className="px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {/* Case Info */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-light tracking-wide text-white/90">{caseData.vehicleType}</h2>
          <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLOR[caseData.status]}`}>{STATUS_LABEL[caseData.status]}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {([
            ['顧客', caseData.customer?.name],
            ['FAX', caseData.customer?.faxNumber || '未登録'],
            ['作業日', new Date(caseData.workDate).toLocaleDateString('ja-JP')],
            ['担当', caseData.worker?.name],
            ...(caseData.notes ? [['備考', caseData.notes]] : []),
            ...(caseData.internalNotes ? [['社内メモ', caseData.internalNotes]] : []),
            ...(caseData.invoiceNumber ? [['請求書番号', caseData.invoiceNumber]] : []),
          ] as [string, string][]).map(([label, value]) => (
            <div key={label} className={label === '備考' || label === '社内メモ' || label === '請求書番号' ? 'col-span-2' : ''}>
              <span className="text-xs text-white/30 tracking-widest uppercase">{label}</span>
              <p className={`mt-0.5 text-white/70 ${label === '社内メモ' ? 'text-orange-400/70' : ''}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-xs font-medium tracking-widest text-white/40 uppercase mb-4">部品一覧・製品割り当て</h3>
        <div className="space-y-3">
          {caseData.items?.map((item) => (
            <div key={item.id} className="border border-white/8 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-mono text-white/80">{item.partNumberRaw}</span>
                  <span className="text-xs text-white/30 ml-2">× {item.quantity}</span>
                </div>
                {item.product ? (
                  <span className="text-xs px-2.5 py-1 rounded-full border bg-green-500/10 text-green-400 border-green-500/20">
                    {item.product.name} — ¥{item.product.price?.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-1 rounded-full border bg-yellow-500/10 text-yellow-400 border-yellow-500/20">未割り当て</span>
                )}
              </div>
              {!item.product && (
                <div className="mt-2">
                  <div className="flex gap-2">
                    <input
                      placeholder="製品を検索..."
                      value={productSearch}
                      onChange={(e) => handleSearchProducts(e.target.value)}
                      className="input-luxury flex-1 text-sm"
                    />
                    {searching && <span className="text-xs text-white/30 self-center">検索中...</span>}
                  </div>
                  {searchResults.length > 0 && (
                    <div className="mt-1 glass rounded-xl divide-y divide-white/5 max-h-40 overflow-y-auto">
                      {searchResults.map((p) => (
                        <button key={p.smaregiId} onClick={() => assignProduct(item.id, p)} className="w-full text-left px-3 py-2 text-sm glass-hover transition">
                          <span className="font-medium text-white/80">{p.name}</span>
                          <span className="text-white/30 ml-2 text-xs">{p.partNumber}</span>
                          <span className="gold ml-2 text-xs">¥{p.price?.toLocaleString()}</span>
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
      <div className="glass rounded-2xl p-5">
        <h3 className="text-xs font-medium tracking-widest text-white/40 uppercase mb-4">文書作成</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <select value={docType} onChange={(e) => setDocType(e.target.value)} className="input-luxury w-auto text-sm">
            {Object.entries(DOC_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm text-white/40 cursor-pointer">
            <input type="checkbox" checked={includeInternal} onChange={(e) => setIncludeInternal(e.target.checked)} className="accent-yellow-500" />
            社内メモを含める
          </label>
          <button onClick={handleGenerateDocument} disabled={generating} className="btn-gold px-4 py-2 rounded-lg text-xs tracking-widest uppercase">
            {generating ? '作成中...' : 'PDFを作成'}
          </button>
        </div>
        {documents.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs tracking-widest text-white/30 uppercase">作成済み文書</p>
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between border border-white/8 rounded-xl px-4 py-3">
                <div>
                  <span className="text-sm text-white/80 font-medium">{DOC_LABEL[doc.type] || doc.type}</span>
                  <span className="text-white/30 ml-2 text-xs">{new Date(doc.createdAt).toLocaleString('ja-JP')}</span>
                </div>
                <div className="flex gap-4 text-xs">
                  <a href={doc.filePath} target="_blank" rel="noopener noreferrer" className="gold hover:opacity-70 transition">表示</a>
                  <button onClick={() => handleSendFax(doc.id)} disabled={faxing || caseData.faxSent} className="text-purple-400/70 hover:text-purple-400 transition disabled:opacity-30">
                    {faxing ? '送信中...' : 'FAX送信'}
                  </button>
                  <button onClick={handleMarkPrinted} disabled={caseData.printed} className="text-green-400/70 hover:text-green-400 transition disabled:opacity-30">印刷済みにする</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-xs font-medium tracking-widest text-white/40 uppercase mb-4">ステータス管理</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(STATUS_LABEL).map(([k, v]) => (
            <button
              key={k}
              onClick={() => handleUpdateStatus(k)}
              disabled={caseData.status === k}
              className={`px-4 py-2 rounded-lg text-xs tracking-widest uppercase font-medium transition ${
                caseData.status === k ? 'btn-gold cursor-default' : 'border border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
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
