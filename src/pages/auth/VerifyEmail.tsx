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
    <div className="auth-wrap">
      <div className="auth-card bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
        {status === 'loading' && <p className="text-gray-400 text-sm">確認中...</p>}
        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <p className="text-gray-600 text-sm mb-6">{message}</p>
            <Link to="/signin" className="btn-primary block w-full py-2.5 rounded-xl text-xs text-center">
              ログインへ
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <p className="text-red-500 text-sm mb-6">{message}</p>
            <Link to="/signup" className="text-xs text-gray-400 hover:text-gray-600 transition underline">
              新規登録へ戻る
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
