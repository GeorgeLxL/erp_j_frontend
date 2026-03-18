import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const tabs = [
  { label: 'ユーザー管理', path: '/admin' },
  { label: '事務スタッフ画面', path: '/staff' },
  { label: '作業員画面', path: '/worker' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0f1117' }}>
      <Navbar title="管理者ポータル" />
      <div className="flex gap-1 px-6 pt-5 border-b border-white/5">
        {tabs.map((t) => {
          const active = location.pathname === t.path;
          return (
            <button
              key={t.path}
              onClick={() => navigate(t.path)}
              className={`px-5 py-2.5 text-xs tracking-widest uppercase font-medium transition border-b-2 -mb-px ${
                active
                  ? 'border-yellow-500 gold'
                  : 'border-transparent text-white/40 hover:text-white/70'
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
