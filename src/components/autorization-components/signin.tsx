'use client'

import { useState, FormEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from 'lucide-react'
import { useApplicationContext } from '@/context/ApplicationContext'
import { useNavigate } from 'react-router-dom'

interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  })
  const appContext = useApplicationContext();
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setLoginData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('Login Data:', loginData)
    await appContext.login(loginData.email, loginData.password);
    if (localStorage.getItem("token")) {
      //get the role and roleId from local storage
      const role = localStorage.getItem("role");
      const roleId = localStorage.getItem("role_id");
      if(role == 'patient'){
        navigate(`/patientdashboard/${roleId}`);
      }
      else if(role == 'doctor'){
        navigate(`/doctordashboard/${roleId}`);
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Log in to MediConnect</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                placeholder="john.doe@example.com" 
                type="email" 
                required 
                onChange={handleInputChange}
                value={loginData.email}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  required 
                  onChange={handleInputChange}
                  value={loginData.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">Log In</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}