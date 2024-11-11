//import { useState } from 'react'
import './App.css'
//import { MedicalAppComponent } from './components/medical-app'
import SignUpForm, {UserSignUpData} from "@/components/auth/SignUpForm.tsx";
import { MedicalAppComponent } from './components/medical-app';
import Signup from './components/signup.tsx';

const handleSignUpSubmit = (formData: UserSignUpData) => {
    // Handle form submission (e.g., API call or state update)
    console.log('Form submitted:', formData);
};




function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
        {/* <SignUpForm onSubmit={handleSignUpSubmit} /> */}
        <Signup />
    </>
  )
}

export default App
