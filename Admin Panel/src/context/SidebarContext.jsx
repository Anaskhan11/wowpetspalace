import { createContext, useState } from "react";

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

  return (
    <SidebarContext.Provider value={{ sidebar, showSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
