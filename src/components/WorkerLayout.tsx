import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export default function WorkerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: '案件一覧', path: '/worker' },
    { label: '＋ 新規案件', path: '/worker/new' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar title="作業員ポータル" />
      <div className="flex gap-1 px-6 pt-4 border-b border-gray-200 bg-white">
        {tabs.map((t) => {
          const active = location.pathname === t.path;
          return (
            <button
              key={t.path}
              onClick={() => navigate(t.path)}
              className={`px-5 py-2.5 text-xs tracking-wide font-medium border-b-2 -mb-px transition ${
                active ? 'border-pink-500 text-pink-500' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
