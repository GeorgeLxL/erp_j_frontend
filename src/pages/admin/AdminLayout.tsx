import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar title="管理者ポータル" />
      <div className="flex gap-2 px-4 pt-4">
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 border hover:bg-gray-100 transition"
        >
          ユーザー管理
        </button>
        <button
          onClick={() => navigate('/staff')}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 border hover:bg-gray-100 transition"
        >
          事務スタッフ画面
        </button>
        <button
          onClick={() => navigate('/worker')}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 border hover:bg-gray-100 transition"
        >
          作業員画面
        </button>
      </div>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
