import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function MainPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/signup");
        }
        //TODO: add navigation to the corresponding dashboard based on the user role and claims
    }, [navigate]);

    return (
        <div>
            <Outlet />
        </div>
    );
}