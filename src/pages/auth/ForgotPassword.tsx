import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/auth.api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setDone(true);
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
              <div className="text-4xl mb-2">📧</div>
              <p className="text-white/80 text-sm leading-relaxed">
                パスワードリセットメールを送信しました。<br />
                メール内のリンクをクリックしてください。
              </p>
              <Link to="/signin" className="btn-gold block w-full py-2.5 rounded-xl text-xs tracking-widest uppercase text-center mt-4">
                ログインへ戻る
              </Link>
            </div>
          ) : (
            <>
              <p className="text-white/40 text-xs tracking-widest mb-6">登録済みのメールアドレスを入力してください。パスワードリセットリンクを送信します。</p>
              {error && <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5 tracking-widest uppercase">メールアドレス</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-luxury" />
                </div>
                <button type="submit" disabled={loading} className="btn-gold w-full py-3 rounded-xl text-sm tracking-widest uppercase">
                  {loading ? '送信中...' : 'リセットメールを送信'}
                </button>
              </form>
              <p className="text-center text-xs text-white/30 mt-5">
                <Link to="/signin" className="text-yellow-400/70 hover:text-yellow-400 transition">← ログインへ戻る</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
