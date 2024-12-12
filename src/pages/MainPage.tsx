import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function MainPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            //check if page is not the sign in page or the sign up page and navigate to the sign in page
            if (window.location.pathname !== "/signin" && window.location.pathname !== "/signup") {
                navigate("/signin");
            }
        }
        //TODO: add navigation to the corresponding dashboard based on the user role and claims
    }, [navigate]);

    return (
        <div>
            <Outlet />
        </div>
    );
}