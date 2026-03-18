import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_LABEL: Record<string, string> = { ADMIN: '管理者', STAFF: '事務スタッフ', WORKER: '作業員' };

export default function Navbar({ title }: { title: string }) {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <h1 className="font-bold text-lg tracking-wide text-pink-500">{title}</h1>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-600">
          {user?.name}
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-pink-50 text-pink-500 border border-pink-200">
            {ROLE_LABEL[user?.role || '']}
          </span>
        </span>
        <button
          onClick={() => navigate('/change-password')}
          className="text-gray-400 hover:text-gray-600 transition text-xs"
        >
          パスワード変更
        </button>
        <button
          onClick={() => { signout(); navigate('/signin'); }}
          className="btn-primary px-4 py-1.5 rounded-lg text-xs"
        >
          ログアウト
        </button>
      </div>
    </nav>
  );
}
