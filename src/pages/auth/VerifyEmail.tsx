import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmail } from '../../api/auth.api';

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyEmail(token!)
      .then((data) => { setMessage(data.message); setStatus('success'); })
      .catch((err) => { setMessage(err.response?.data?.message || '確認に失敗しました'); setStatus('error'); });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at 50% 0%, #1a1a2e 0%, #0f1117 70%)' }}>
      <div className="glass rounded-2xl p-10 w-full max-w-sm text-center shadow-2xl">
        {status === 'loading' && <p className="text-white/40 tracking-widest text-sm">確認中...</p>}
        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <p className="text-white/80 text-sm mb-6">{message}</p>
            <Link to="/signin" className="btn-gold block w-full py-2.5 rounded-xl text-xs tracking-widest uppercase">
              ログインへ
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <p className="text-red-400 text-sm mb-6">{message}</p>
            <Link to="/signup" className="text-xs text-white/30 hover:text-white/60 transition underline">
              新規登録へ戻る
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
