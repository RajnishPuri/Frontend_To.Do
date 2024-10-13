import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Todo.css';
import { Star, Edit, Trash } from 'lucide-react';

const Todo = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [todos, setTodos] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [todoIdToEdit, setTodoIdToEdit] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://backend-to-do-e48o.onrender.com/api/v1/todos', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTodos(response.data.todos);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const createOrUpdateTodo = async (e) => {
        e.preventDefault();
        if (!title || !description) {
            setError("All fields are required!");
            return;
        }

        try {
            const token = localStorage.getItem('token');

            if (editMode) {
                const response = await axios.put(`https://backend-to-do-e48o.onrender.com/api/v1/todos/${todoIdToEdit}`, { title, description }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const updatedTodo = response.data.todo;

                setTodos((prevTodos) =>
                    prevTodos.map((todo) => (todo._id === todoIdToEdit ? updatedTodo : todo))
                );
            } else {
                const response = await axios.post('https://backend-to-do-e48o.onrender.com/api/v1/todos', { title, description }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const newTodo = response.data.todo;
                setTodos((prevTodos) => [...prevTodos, newTodo]);
            }

            setTitle('');
            setDescription('');
            setEditMode(false);
            setTodoIdToEdit(null);
            setError(null);
        } catch (e) {
            setError(`Error: ${e.message}`);
        }
    };


    const deleteTodo = async (todoId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://backend-to-do-e48o.onrender.com/api/v1/todos/${todoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== todoId));
        } catch (e) {
            setError(`Error: ${e.message}`);
        }
    };


    const toggleStarred = async (todoId, isStarred) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo._id === todoId ? { ...todo, isStarred: !isStarred } : todo
            )
        );

        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://backend-to-do-e48o.onrender.com/api/v1/startodos/${todoId}`, {
                isStarred: !isStarred
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (e) {
            setError(`Error: ${e.message}`);
        }
    };


    const editTodo = (todo) => {
        setTitle(todo.title);
        setDescription(todo.description);
        setEditMode(true);
        setTodoIdToEdit(todo._id);
    };

    const signOut = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-24">
            <h1 className="text-4xl md:text-5xl font-bold text-purple-500 mb-4 text-center">Your Todos</h1>
            <form
                onSubmit={createOrUpdateTodo}
                className="bg-[#1e1e1e] p-6 w-full max-w-sm md:max-w-md rounded-lg shadow-md mb-6 flex flex-col"
            >
                <h2 className="text-2xl md:text-3xl font-bold text-purple-500 mb-4 text-center">{editMode ? 'Edit Todo' : 'Add New Todo'}</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="p-2 mb-3 border border-gray-600 rounded w-full"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="p-2 mb-3 border border-gray-600 rounded w-full"
                />
                <button
                    type="submit"
                    className="py-2 px-4 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition duration-200"
                >
                    {editMode ? 'Update Todo' : 'Add Todo'}
                </button>
            </form>

            <button
                onClick={signOut}
                className="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200 mb-6"
            >
                Sign Out
            </button>

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <div className="w-full max-w-sm md:max-w-md overflow-y-auto h-64 border border-gray-600 rounded-lg">
                    <ul className="w-full">
                        {todos.map((todo) => (
                            <li key={todo._id} className="bg-gray-800 p-4 mb-2 rounded-lg shadow flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg md:text-xl font-semibold text-purple-500">{todo.title}</h3>
                                    <p className="text-gray-300">{todo.description}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <Star
                                        className={`cursor-pointer ${todo.isStarred ? 'text-yellow-500' : 'text-gray-400'}`}
                                        onClick={() => toggleStarred(todo._id, todo.isStarred)}
                                    />
                                    <Edit
                                        className="cursor-pointer text-blue-500"
                                        onClick={() => editTodo(todo)}
                                    />
                                    <Trash
                                        className="cursor-pointer text-red-500"
                                        onClick={() => deleteTodo(todo._id)}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Todo;
