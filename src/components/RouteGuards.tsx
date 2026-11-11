import type React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute: React.FC = () => {
    const { token, loading } = useAuth();

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
    }

    return token ? <Outlet /> : <Navigate to="/login" replace />
};

export const AdminRoute: React.FC = () => {
    const { token, loading, user } = useAuth();

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Verifying permissions...</div>
    }



    return token && user?.role === 'admin' ? <Outlet /> : <Navigate to="/login" replace />
}