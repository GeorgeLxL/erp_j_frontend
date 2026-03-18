import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../api/auth.api';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (next !== confirm) return setError('新しいパスワードが一致しません');
    setError('');
    try {
      await changePassword(current, next);
      setSuccess('パスワードを変更しました');
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'エラーが発生しました');
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
        <h1 className="text-lg font-semibold text-gray-800 mb-8">パスワード変更</h1>
        {error && <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">{error}</div>}
        {success && <div className="mb-4 px-4 py-2.5 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: '現在のパスワード', value: current, set: setCurrent },
            { label: '新しいパスワード', value: next, set: setNext },
            { label: '新しいパスワード（確認）', value: confirm, set: setConfirm },
          ].map(({ label, value, set }) => (
            <div key={label}>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
              <input type="password" value={value} onChange={(e) => set(e.target.value)} required className="input-base" />
            </div>
          ))}
          <button type="submit" className="btn-primary w-full py-3 rounded-xl text-sm mt-2">変更する</button>
          <button type="button" onClick={() => navigate(-1)} className="w-full text-gray-400 hover:text-gray-600 text-xs transition py-1">← 戻る</button>
        </form>
      </div>
    </div>
  );
}
