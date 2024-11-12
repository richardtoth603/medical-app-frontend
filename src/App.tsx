//import { useState } from 'react'
import "./App.css";
//import { MedicalAppComponent } from './components/medical-app'
import { RouterProvider } from "react-router-dom";
import { Routes } from "./routes/Router.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={Routes} />
      </QueryClientProvider>
    </>
  );
}

export default App;
