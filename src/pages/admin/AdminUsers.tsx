import { useEffect, useState } from 'react';
import api from '../../api/client';

const ROLE_LABEL: Record<string, string> = { ADMIN: '管理者', STAFF: '事務スタッフ', WORKER: '作業員' };

interface User { id: string; name: string; email: string; role: string; active: boolean }
interface FormState { name: string; email: string; password: string; role: string }

const EMPTY_FORM: FormState = { name: '', email: '', password: '', role: 'WORKER' };

export default function AdminUsers() {
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
    const { data } = await api.get('/users');
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
        await api.put(`/users/${editId}`, { name: form.name, email: form.email, role: form.role });
        flash('ユーザーを更新しました');
      } else {
        await api.post('/users', form);
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

  async function toggleActive(user: User) {
    await api.put(`/users/${user.id}`, { ...user, active: !user.active });
    flash(`${user.name}を${user.active ? '無効化' : '有効化'}しました`);
    load();
  }

  async function deleteUser(id: string) {
    if (!confirm('このユーザーを削除しますか？')) return;
    await api.delete(`/users/${id}`);
    flash('ユーザーを削除しました');
    load();
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.put(`/users/${pwUserId}/password`, { newPassword });
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

  if (loading) return <p className="text-center text-gray-500 mt-8">読み込み中...</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-700">ユーザー管理</h2>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          ＋ ユーザー追加
        </button>
      </div>

      {msg && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2 text-sm mb-3">{msg}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm mb-3">{error}</div>}

      {/* User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-800 mb-4">{editId ? 'ユーザー編集' : 'ユーザー追加'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { label: '名前', key: 'name', type: 'text' },
                { label: 'メールアドレス', key: 'email', type: 'email' },
                ...(!editId ? [{ label: 'パスワード', key: 'password', type: 'password' }] : []),
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">役割</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(ROLE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                  {editId ? '更新' : '作成'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {pwUserId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-800 mb-4">パスワード変更</h3>
            <form onSubmit={changePassword} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">新しいパスワード</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">変更</button>
                <button type="button" onClick={() => setPwUserId(null)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition">キャンセル</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3">名前</th>
              <th className="px-4 py-3">メール</th>
              <th className="px-4 py-3">役割</th>
              <th className="px-4 py-3">状態</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className={`hover:bg-gray-50 ${!u.active ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{ROLE_LABEL[u.role]}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.active ? '有効' : '無効'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(u)} className="text-blue-600 hover:underline">編集</button>
                    <button onClick={() => toggleActive(u)} className="text-yellow-600 hover:underline">
                      {u.active ? '無効化' : '有効化'}
                    </button>
                    <button onClick={() => setPwUserId(u.id)} className="text-gray-600 hover:underline">PW変更</button>
                    <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:underline">削除</button>
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
