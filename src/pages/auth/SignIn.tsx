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
      if (err.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        setUnverified(true);
      }
      if (err.response?.data?.code === 'ACCOUNT_DISABLED') {
        setUnverified(false);
      }
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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at 50% 0%, #1a1a2e 0%, #0f1117 70%)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-block w-12 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-4" />
          <h1 className="text-3xl font-light tracking-[0.3em] gold uppercase">Portal</h1>
          <div className="inline-block w-12 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mt-4" />
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
              {unverified && (
                <div className="mt-2">
                  {resendMsg
                    ? <p className="text-green-400 text-xs">{resendMsg}</p>
                    : <button onClick={handleResend} disabled={resending} className="text-xs text-yellow-400/70 hover:text-yellow-400 transition underline">
                        {resending ? '送信中...' : '確認メールを再送する'}
                      </button>
                  }
                </div>
              )}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1.5 tracking-widest uppercase">メールアドレス</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-luxury" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1.5 tracking-widest uppercase">パスワード</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-luxury" />
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-white/30 hover:text-white/60 transition">
                パスワードをお忘れですか？
              </Link>
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full py-3 rounded-xl text-sm tracking-widest uppercase">
              {loading ? '認証中...' : 'ログイン'}
            </button>
          </form>
          <p className="text-center text-xs text-white/30 mt-5">
            アカウントをお持ちでない方は{' '}
            <Link to="/signup" className="text-yellow-400/70 hover:text-yellow-400 transition">新規登録</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
