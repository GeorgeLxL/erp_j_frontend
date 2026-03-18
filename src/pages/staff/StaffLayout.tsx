import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function StaffLayout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar title="事務スタッフポータル" />
      <div className="flex gap-2 px-4 pt-4">
        <button
          onClick={() => navigate('/staff')}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 border hover:bg-gray-100 transition"
        >
          案件一覧
        </button>
      </div>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
