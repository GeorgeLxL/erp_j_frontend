import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

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
      await api.post('/auth/change-password', { currentPassword: current, newPassword: next });
      setSuccess('パスワードを変更しました');
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'エラーが発生しました');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-6">パスワード変更</h1>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: '現在のパスワード', value: current, set: setCurrent },
            { label: '新しいパスワード', value: next, set: setNext },
            { label: '新しいパスワード（確認）', value: confirm, set: setConfirm },
          ].map(({ label, value, set }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="password"
                value={value}
                onChange={(e) => set(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            変更する
          </button>
          <button type="button" onClick={() => navigate(-1)} className="w-full text-gray-500 text-sm hover:underline">
            戻る
          </button>
        </form>
      </div>
    </div>
  );
}
