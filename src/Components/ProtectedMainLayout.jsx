import { Navigate, Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import useAuthStore from "../store/useAuthStore";

function ProtectedMainLayout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col w-full overflow-hidden">
        <Header />
        <div className="flex-1 p-4 overflow-auto bg-gray-50/80">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ProtectedMainLayout;
