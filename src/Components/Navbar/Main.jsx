// Libs
import React, { useContext } from "react";
import { SidebarContext } from "../../Context/SidebarContext";
import { MainSidebar } from "./Sidebar";
import Topbar from "./Topbar";

const Navbar = () => {
  const { state } = useContext(SidebarContext);
  return (
    <>
      <nav
        className="bg-[#f5f3f0] shadow-lg p-2 h-20 flex items-center relative z-10"
        style={{ position: "sticky", top: 0 }}
      >
        <Topbar />
      </nav>
      <div className="absolute top-[80px] left-0 z-20">
        {state.isOpen && <MainSidebar />}
      </div>
    </>
  );
};

export default Navbar;
