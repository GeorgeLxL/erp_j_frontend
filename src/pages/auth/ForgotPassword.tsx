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
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="text-center mb-10">
          <div className="inline-block w-12 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent mb-4" />
          <h1 className="text-3xl font-light tracking-[0.3em] text-pink-500 uppercase">Portal</h1>
          <div className="inline-block w-12 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent mt-4" />
        </div>
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
          {done ? (
            <div className="text-center space-y-4">
              <div className="text-4xl mb-2">📧</div>
              <p className="text-gray-600 text-sm leading-relaxed">
                パスワードリセットメールを送信しました。<br />
                メール内のリンクをクリックしてください。
              </p>
              <Link to="/signin" className="btn-primary block w-full py-2.5 rounded-xl text-xs text-center mt-4">
                ログインへ戻る
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-xs mb-8">登録済みのメールアドレスを入力してください。パスワードリセットリンクを送信します。</p>
              {error && <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">メールアドレス</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-base" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl text-sm">
                  {loading ? '送信中...' : 'リセットメールを送信'}
                </button>
              </form>
              <p className="text-center text-xs text-gray-400 mt-8">
                <Link to="/signin" className="text-pink-500 hover:text-pink-600 transition">← ログインへ戻る</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
