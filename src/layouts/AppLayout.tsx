import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
