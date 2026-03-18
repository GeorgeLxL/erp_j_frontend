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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at 50% 0%, #1a1a2e 0%, #0f1117 70%)' }}>
      <div className="w-full max-w-sm glass rounded-2xl p-8 shadow-2xl">
        <h1 className="text-lg font-light tracking-[0.2em] gold uppercase mb-6">パスワード変更</h1>
        {error && <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
        {success && <div className="mb-4 px-4 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: '現在のパスワード', value: current, set: setCurrent },
            { label: '新しいパスワード', value: next, set: setNext },
            { label: '新しいパスワード（確認）', value: confirm, set: setConfirm },
          ].map(({ label, value, set }) => (
            <div key={label}>
              <label className="block text-xs font-medium text-white/40 mb-1.5 tracking-widest uppercase">{label}</label>
              <input type="password" value={value} onChange={(e) => set(e.target.value)} required className="input-luxury" />
            </div>
          ))}
          <button type="submit" className="btn-gold w-full py-3 rounded-xl text-sm tracking-widest uppercase mt-2">変更する</button>
          <button type="button" onClick={() => navigate(-1)} className="w-full text-white/30 hover:text-white/50 text-xs tracking-wide transition py-1">← 戻る</button>
        </form>
      </div>
    </div>
  );
}
