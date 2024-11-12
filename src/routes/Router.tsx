import DoctorPage from "@/components/homepage-doctor/doctor-homepage";
import PatientPortal from "@/components/homepage-patient/homepage-patient";
import SignUp from "@/components/autorization-components/signup";
import { MainPage } from "@/pages/MainPage";
import { createBrowserRouter } from "react-router-dom";
import Login from "@/components/autorization-components/signin";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <MainPage />,
        children: [
            // {
            //     path: "/signin",
            //     element: <SignIn />,
            // },
            {
                path: "/signin",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <SignUp />,
            },
            {
                path: "/patientdashboard/:roleId",
                element: <PatientPortal />,
            },
            {
                path: "/doctordashboard/:roleId",
                element: <DoctorPage />,
            }
        ]
    }
]);

export const Routes = routes;