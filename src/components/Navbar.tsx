import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_LABEL: Record<string, string> = { ADMIN: '管理者', STAFF: '事務スタッフ', WORKER: '作業員' };

export default function Navbar({ title }: { title: string }) {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <h1 className="font-bold text-lg tracking-widest gold uppercase">{title}</h1>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-white/50">
          {user?.name}
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full border border-yellow-600/40 gold">
            {ROLE_LABEL[user?.role || '']}
          </span>
        </span>
        <button
          onClick={() => navigate('/change-password')}
          className="text-white/40 hover:text-white/70 transition text-xs tracking-wide"
        >
          パスワード変更
        </button>
        <button
          onClick={() => { signout(); navigate('/signin'); }}
          className="btn-gold px-4 py-1.5 rounded-lg text-xs tracking-wide"
        >
          ログアウト
        </button>
      </div>
    </nav>
  );
}
