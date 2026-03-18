import { useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/auth.api';

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (newPassword !== confirm) return setError('パスワードが一致しません');
    setError('');
    setLoading(true);
    try {
      await resetPassword(token!, newPassword);
      setDone(true);
      setTimeout(() => navigate('/signin'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at 50% 0%, #1a1a2e 0%, #0f1117 70%)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-block w-12 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-4" />
          <h1 className="text-3xl font-light tracking-[0.3em] gold uppercase">Portal</h1>
          <div className="inline-block w-12 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mt-4" />
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl">
          {done ? (
            <div className="text-center space-y-4">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-white/80 text-sm">パスワードをリセットしました。ログインページへ移動します...</p>
            </div>
          ) : (
            <>
              {error && <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { label: '新しいパスワード', value: newPassword, set: setNewPassword },
                  { label: '新しいパスワード（確認）', value: confirm, set: setConfirm },
                ].map(({ label, value, set }) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-white/40 mb-1.5 tracking-widest uppercase">{label}</label>
                    <input type="password" value={value} onChange={(e) => set(e.target.value)} required minLength={6} className="input-luxury" />
                  </div>
                ))}
                <button type="submit" disabled={loading} className="btn-gold w-full py-3 rounded-xl text-sm tracking-widest uppercase">
                  {loading ? '変更中...' : 'パスワードを変更する'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
