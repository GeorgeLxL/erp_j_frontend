import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn, resendVerification } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';

export default function SignIn() {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unverified, setUnverified] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [resending, setResending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setUnverified(false);
    setLoading(true);
    try {
      const data = await signIn(email, password);
      signin(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      if (err.response?.data?.code === 'EMAIL_NOT_VERIFIED') setUnverified(true);
      if (err.response?.data?.code === 'ACCOUNT_DISABLED') setUnverified(false);
      setError(err.response?.data?.message || 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    try {
      await resendVerification(email);
      setResendMsg('確認メールを再送しました');
    } catch {
      setResendMsg('再送に失敗しました');
    } finally {
      setResending(false);
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
          {error && (
            <div className="mb-6 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm text-center">
              {error}
              {unverified && (
                <div className="mt-2">
                  {resendMsg
                    ? <p className="text-green-500 text-xs">{resendMsg}</p>
                    : <button onClick={handleResend} disabled={resending} className="text-xs text-pink-400 hover:text-pink-600 transition underline">
                        {resending ? '送信中...' : '確認メールを再送する'}
                      </button>
                  }
                </div>
              )}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">メールアドレス</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-base" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">パスワード</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-base" />
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-gray-600 transition">
                パスワードをお忘れですか？
              </Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl text-sm">
              {loading ? '認証中...' : 'ログイン'}
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-8">
            アカウントをお持ちでない方は{' '}
            <Link to="/signup" className="text-pink-500 hover:text-pink-600 transition">新規登録</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
