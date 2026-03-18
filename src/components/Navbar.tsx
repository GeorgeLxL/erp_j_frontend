import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_LABEL: Record<string, string> = { ADMIN: '管理者', STAFF: '事務スタッフ', WORKER: '作業員' };

export default function Navbar({ title }: { title: string }) {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between shadow">
      <h1 className="font-bold text-lg">{title}</h1>
      <div className="flex items-center gap-3 text-sm">
        <span>{user?.name}（{ROLE_LABEL[user?.role || '']}）</span>
        <button onClick={() => navigate('/change-password')} className="underline hover:text-blue-200">
          パスワード変更
        </button>
        <button onClick={() => { signout(); navigate('/signin'); }} className="bg-white text-blue-700 px-3 py-1 rounded-lg font-medium hover:bg-blue-100 transition">
          ログアウト
        </button>
      </div>
    </nav>
  );
}
