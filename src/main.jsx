import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { SidebarContextProvider } from "./Context/SidebarContext.jsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <SidebarContextProvider>
          <App />
        </SidebarContextProvider>
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
