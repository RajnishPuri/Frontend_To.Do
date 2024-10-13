import { useEffect } from "react";
import Todo from "./components/Todo";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/todos');
    }
  }, [navigate]);

  return (
    <div className="w-screen h-screen bg-custom-gradient flex justify-center items-center p-4">
      <div className="h-full w-full sm:h-5/6 sm:w-2/3 bg-[#121215] rounded-lg shadow-custom-2xl shadow-black p-8 sm:p-16 gap-6 sm:gap-10 flex flex-col justify-center items-center">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <Todo />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
          <Route
            path="/"
            element={
              <>
                <div className="flex cursor-pointer">
                  <h1 className="text-5xl sm:text-7xl text-purple-500">To</h1>
                  <h1 className="text-5xl sm:text-7xl text-purple-500">.Do</h1>
                </div>
                <div className="flex flex-col gap-3 w-full sm:w-2/6">
                  <button
                    className="bg-slate-700 p-2 sm:p-3 hover:bg-purple-500 hover:text-white transition duration-100"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </button>
                  <button
                    className="bg-slate-700 p-2 sm:p-3 hover:bg-purple-500 hover:text-white transition duration-100"
                    onClick={() => navigate('/signup')}
                  >
                    SignUp
                  </button>
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
