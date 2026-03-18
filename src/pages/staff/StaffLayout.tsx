import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function StaffLayout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0f1117' }}>
      <Navbar title="事務スタッフポータル" />
      <div className="flex gap-1 px-6 pt-5 border-b border-white/5">
        <button
          onClick={() => navigate('/staff')}
          className="px-5 py-2.5 text-xs tracking-widest uppercase font-medium border-b-2 border-yellow-500 gold -mb-px transition"
        >
          案件一覧
        </button>
      </div>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
