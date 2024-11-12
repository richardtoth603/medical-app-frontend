import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function MainPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/signin");
        }
    }, [navigate]);

    return (
        <div>
            <Outlet />
        </div>
    );
}