import { createContext, useReducer } from "react";

export const SidebarContext = createContext();

const initialState = {
  isOpen: false,
};
const sidebarReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE":
      return {
        isOpen: !state.isOpen,
      };
    case "SET":
      return {
        isOpen: true,
      };
    case "UNSET":
      return {
        isOpen: false,
      };
    default:
      return {
        isOpen: false,
      };
  }
};

export const SidebarContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sidebarReducer, initialState);
  return (
    <SidebarContext.Provider value={{ state, dispatch }}>
      {children}
    </SidebarContext.Provider>
  );
};
