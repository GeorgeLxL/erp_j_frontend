import { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, updateUserPassword, deleteUser, type User } from '../../api/users.api';
import { useAuth } from '../../context/AuthContext';

const ROLE_LABEL: Record<string, string> = { ADMIN: '管理者', STAFF: '事務スタッフ', WORKER: '作業員' };
const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  STAFF: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  WORKER: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

interface FormState { name: string; email: string; password: string; role: string }
const EMPTY_FORM: FormState = { name: '', email: '', password: '', role: 'WORKER' };

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [pwUserId, setPwUserId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function load() {
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function flash(m: string, isError = false) {
    isError ? setError(m) : setMsg(m);
    setTimeout(() => { setMsg(''); setError(''); }, 3000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editId) {
        await updateUser(editId, { name: form.name, email: form.email, role: form.role });
        flash('ユーザーを更新しました');
      } else {
        await createUser(form);
        flash('ユーザーを作成しました');
      }
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
      load();
    } catch (err: any) {
      flash(err.response?.data?.message || 'エラーが発生しました', true);
    }
  }

  async function handleToggleActive(user: User) {
    await updateUser(user.id, { name: user.name, email: user.email, role: user.role, active: !user.active });
    flash(`${user.name}を${user.active ? '無効化' : '有効化'}しました`);
    load();
  }

  async function handleDeleteUser(id: string) {
    if (!confirm('このユーザーを削除しますか？')) return;
    await deleteUser(id);
    flash('ユーザーを削除しました');
    load();
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateUserPassword(pwUserId!, newPassword);
      flash('パスワードを変更しました');
      setPwUserId(null);
      setNewPassword('');
    } catch (err: any) {
      flash(err.response?.data?.message || 'エラーが発生しました', true);
    }
  }

  function startEdit(user: User) {
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
    setEditId(user.id);
    setShowForm(true);
  }

  const isSelf = (id: string) => id === me?.id;

  const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-medium tracking-widest gold uppercase">{title}</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition text-lg leading-none">✕</button>
        </div>
        {children}
      </div>
    </div>
  );

  if (loading) return <p className="text-center text-white/30 mt-12 tracking-widest">読み込み中...</p>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-medium tracking-widest text-white/50 uppercase">ユーザー管理</h2>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }} className="btn-gold px-5 py-2 rounded-lg text-xs tracking-widest uppercase">
          ＋ ユーザー追加
        </button>
      </div>

      {msg && <div className="mb-4 px-4 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">{msg}</div>}
      {error && <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {showForm && (
        <Modal title={editId ? 'ユーザー編集' : 'ユーザー追加'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: '名前', key: 'name', type: 'text' },
              { label: 'メールアドレス', key: 'email', type: 'email' },
              ...(!editId ? [{ label: 'パスワード', key: 'password', type: 'password' }] : []),
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-xs text-white/40 mb-1.5 tracking-widest uppercase">{label}</label>
                <input type={type} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required className="input-luxury" />
              </div>
            ))}
            <div>
              <label className="block text-xs text-white/40 mb-1.5 tracking-widest uppercase">役割</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-luxury" disabled={!!editId && isSelf(editId)}>
                {Object.entries(ROLE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              {editId && isSelf(editId) && <p className="text-xs text-white/30 mt-1">自分の役割は変更できません</p>}
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" className="btn-gold flex-1 py-2.5 rounded-lg text-xs tracking-widest uppercase">{editId ? '更新' : '作成'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg text-xs tracking-widest uppercase text-white/40 border border-white/10 hover:border-white/20 transition">キャンセル</button>
            </div>
          </form>
        </Modal>
      )}

      {pwUserId && (
        <Modal title="パスワード変更" onClose={() => setPwUserId(null)}>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 mb-1.5 tracking-widest uppercase">新しいパスワード</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="input-luxury" />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" className="btn-gold flex-1 py-2.5 rounded-lg text-xs tracking-widest uppercase">変更</button>
              <button type="button" onClick={() => setPwUserId(null)} className="flex-1 py-2.5 rounded-lg text-xs tracking-widest uppercase text-white/40 border border-white/10 hover:border-white/20 transition">キャンセル</button>
            </div>
          </form>
        </Modal>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['名前', 'メール', '役割', '状態', '操作'].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs tracking-widest text-white/30 uppercase font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} className={`border-b border-white/5 glass-hover transition ${!u.active ? 'opacity-40' : ''} ${i === users.length - 1 ? 'border-b-0' : ''}`}>
                <td className="px-5 py-4 font-medium text-white/90">{u.name}</td>
                <td className="px-5 py-4 text-white/50">{u.email}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${ROLE_COLORS[u.role]}`}>{ROLE_LABEL[u.role]}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${u.active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {u.active ? '有効' : '無効'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-3 text-xs">
                    <button onClick={() => startEdit(u)} className="text-yellow-500/70 hover:text-yellow-400 transition">編集</button>
                    {!isSelf(u.id) && (
                      <>
                        <button onClick={() => handleToggleActive(u)} className="text-white/40 hover:text-white/70 transition">{u.active ? '無効化' : '有効化'}</button>
                        <button onClick={() => handleDeleteUser(u.id)} className="text-red-500/60 hover:text-red-400 transition">削除</button>
                      </>
                    )}
                    <button onClick={() => setPwUserId(u.id)} className="text-white/40 hover:text-white/70 transition">PW変更</button>
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
