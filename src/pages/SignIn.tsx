import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signin', { email, password });
      signin(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'ログインに失敗しました');
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
          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1.5 tracking-widest uppercase">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-luxury"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1.5 tracking-widest uppercase">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-luxury"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full py-3 rounded-xl text-sm tracking-widest uppercase mt-2">
              {loading ? '認証中...' : 'ログイン'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
