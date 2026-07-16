import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import SyncProducts from "../pages/SyncProducts";
import StockLogs from "../pages/StockLogs";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/products" element={<Products />} />

          <Route path="/sync" element={<SyncProducts />} />

          <Route path="/logs" element={<StockLogs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
