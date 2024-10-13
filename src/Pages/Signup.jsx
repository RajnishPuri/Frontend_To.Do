import React, { useState } from 'react';
import Input from '../components/Input';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from "lucide-react";
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { z } from 'zod';

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [verificationStep, setVerificationStep] = useState(false);
    const [signupToken, setSignupToken] = useState("");
    const [verificationCode, setVerificationCode] = useState("");

    const navigate = useNavigate();

    const passwordSchema = z.string()
        .min(6, "Password must be at least 6 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character");

    const signupSchema = z.object({
        email: z.string().email("Invalid email address"),
        password: passwordSchema,
        confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
    }).refine(data => data.password === data.confirmPassword, {
        message: "Password and Confirm Password should be the same",
        path: ["confirmPassword"],
    });

    function createHandler(e) {
        e.preventDefault();

        const validationResult = signupSchema.safeParse({ email, password, confirmPassword });
        if (!validationResult.success) {
            alert(validationResult.error.errors.map(err => err.message).join(", "));
            return;
        }

        const user = { email, password };

        fetch('https://backend-to-do-e48o.onrender.com/api/v1/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSignupToken(data.signupToken);
                    setVerificationStep(true);
                } else {
                    alert(data.message);
                }
            })
            .catch(err => {
                console.error("Error:", err);
                alert("An error occurred during signup.");
            });
    }

    function verifyHandler(e) {
        e.preventDefault();

        const verificationData = { signupToken, verificationToken: verificationCode };

        fetch('https://backend-to-do-e48o.onrender.com/api/v1/verify-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(verificationData),
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    navigate('/login');
                } else {
                    alert(data.message);
                }
            })
            .catch(err => {
                console.error("Error:", err);
                alert("An error occurred during verification.");
            });
    }

    return (
        <div className="w-full h-full flex justify-center items-center p-4">
            <form className="bg-[#1e1e1e] flex flex-col p-6 sm:p-8 w-full max-w-md rounded-lg shadow-md">
                <h2 className="text-2xl sm:text-3xl font-bold text-purple-500 mb-6 sm:mb-8 text-center">
                    {verificationStep ? 'Verify Account' : 'Sign Up'}
                </h2>

                {!verificationStep ? (
                    <>
                        <Input icon={Mail} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Input icon={Lock} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                        <PasswordStrengthMeter password={password} />
                        <div className="w-full flex justify-center mt-4 sm:mt-6">
                            <button
                                className="py-2 px-4 sm:py-2 sm:px-6 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition duration-200"
                                onClick={createHandler}
                            >
                                Create Account
                            </button>
                        </div>
                        <div className="w-full flex justify-center mt-2">
                            <button
                                className="py-2 px-4 sm:py-2 sm:px-6 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-200"
                                onClick={() => navigate('/login')}
                            >
                                Already have an account? Login
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Input icon={Lock} type="text" placeholder="Enter Verification Code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                        <div className="w-full flex justify-center mt-4 sm:mt-6">
                            <button
                                className="py-2 px-4 sm:py-2 sm:px-6 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition duration-200"
                                onClick={verifyHandler}
                            >
                                Verify Account
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default Signup;
