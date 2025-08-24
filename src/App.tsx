import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "./components/Sidebar";
import EmployeePage from "./pages/Employee";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <div style={{ flexGrow: 1, padding: "20px" }}>
            <Routes>
              <Route path="/employee" element={<EmployeePage />} />
              <Route path="/" element={<div>Trang chủ</div>} />
              <Route path="*" element={<div>Không tìm thấy trang</div>} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;