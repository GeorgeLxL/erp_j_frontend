import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function WorkerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar title="作業員ポータル" />
      <div className="flex gap-2 px-4 pt-4">
        <button
          onClick={() => navigate('/worker')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${location.pathname === '/worker' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-100'}`}
        >
          案件一覧
        </button>
        <button
          onClick={() => navigate('/worker/new')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${location.pathname === '/worker/new' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-100'}`}
        >
          ＋ 新規案件
        </button>
      </div>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
