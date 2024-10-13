import React, { useState } from 'react';
import Input from '../components/Input';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail } from "lucide-react";
import { z } from 'zod';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const loginSchema = z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    });

    function loginHandler(e) {
        e.preventDefault();

        const validationResult = loginSchema.safeParse({ email, password });
        if (!validationResult.success) {
            alert(validationResult.error.errors.map(err => err.message).join(", "));
            return;
        }

        const user = { email, password };

        axios.post('https://backend-to-do-e48o.onrender.com/api/v1/login', user)
            .then(response => {
                const data = response.data;
                const token = data.token;

                if (data.success && token) {
                    alert("Login successful!");
                    localStorage.setItem('token', token);
                    navigate('/todos');
                } else {
                    alert(data.message);
                }
            })
            .catch(err => {
                console.error("Error:", err);
                alert("An error occurred during login.");
            });
    }

    return (
        <div className="w-full h-full flex justify-center items-center p-4">
            <form className="bg-[#1e1e1e] flex flex-col p-6 sm:p-8 w-full max-w-md rounded-lg shadow-md">
                <h2 className="text-2xl sm:text-3xl font-bold text-purple-500 mb-6 sm:mb-8 text-center">Login</h2>

                <Input icon={Mail} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <div className="w-full flex justify-center mt-4 sm:mt-6">
                    <button
                        className="py-2 px-4 sm:py-2 sm:px-6 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition duration-200"
                        onClick={loginHandler}
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
