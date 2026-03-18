import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function StaffLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar title="事務スタッフポータル" />
      <div className="flex gap-1 px-6 pt-4 border-b border-gray-200 bg-white">
        <button
          onClick={() => navigate('/staff')}
          className="px-5 py-2.5 text-xs tracking-wide font-medium border-b-2 border-pink-500 text-pink-500 -mb-px transition"
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
