import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { signUp, resendVerification } from '../../api/auth.api';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) return setError('パスワードが一致しません');
    setError('');
    setLoading(true);
    try {
      await signUp(name, email, password);
      setDone(true);
    } catch (err: any) {
      setError(err.response?.data?.message || '登録に失敗しました');
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
          {done ? (
            <div className="text-center space-y-4">
              <div className="text-4xl mb-2">📧</div>
              <p className="text-white/80 text-sm leading-relaxed">
                確認メールを <span className="text-yellow-400">{email}</span> に送信しました。<br />
                メール内のリンクをクリックして登録を完了してください。
              </p>
              {resendMsg && <p className="text-green-400 text-xs">{resendMsg}</p>}
              <button onClick={handleResend} disabled={resending} className="text-xs text-white/30 hover:text-white/60 transition underline">
                {resending ? '送信中...' : 'メールが届かない場合は再送する'}
              </button>
              <div className="pt-2">
                <Link to="/signin" className="btn-gold block w-full py-2.5 rounded-xl text-xs tracking-widest uppercase text-center">
                  ログインへ
                </Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { label: '名前', value: name, set: setName, type: 'text', placeholder: '例: 山田 太郎' },
                  { label: 'メールアドレス', value: email, set: setEmail, type: 'email', placeholder: '' },
                  { label: 'パスワード', value: password, set: setPassword, type: 'password', placeholder: '' },
                  { label: 'パスワード（確認）', value: confirm, set: setConfirm, type: 'password', placeholder: '' },
                ].map(({ label, value, set, type, placeholder }) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-white/40 mb-1.5 tracking-widest uppercase">{label}</label>
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      required
                      placeholder={placeholder}
                      minLength={type === 'password' ? 6 : undefined}
                      className="input-luxury"
                    />
                  </div>
                ))}
                <button type="submit" disabled={loading} className="btn-gold w-full py-3 rounded-xl text-sm tracking-widest uppercase mt-2">
                  {loading ? '登録中...' : '登録する'}
                </button>
              </form>
              <p className="text-center text-xs text-white/30 mt-5">
                すでにアカウントをお持ちの方は{' '}
                <Link to="/signin" className="text-yellow-400/70 hover:text-yellow-400 transition">ログイン</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
