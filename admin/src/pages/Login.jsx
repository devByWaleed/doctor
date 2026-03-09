import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux';
import {
    signInStart,
    signInSuccess,
    signInFailure,
    setAdminToken
} from '../features/admin/adminSlice'

const Login = () => {
    const [state, setState] = useState('Admin')

    const { loading, error } = useSelector((state) => state.admin);
    const dispatch = useDispatch();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        try {
            if (state === "Admin") {
                dispatch(signInStart());
                const { data } = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/admin/login", { email, password })

                if (data.success === false) {
                    dispatch(signInFailure(data.message))
                    toast.error(data.message)
                    return

                }
                dispatch(signInSuccess(data));
                dispatch(setAdminToken(data.adminToken));
                localStorage.setItem('adminToken', data.adminToken)
                console.log(data.adminToken);
                toast.success(data.message)
            }
            // else {

            // }
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    }


    return (
        <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="min-h-[80vh] flex items-center">
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-85 sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">

                <p className='text-2xl font-semibold m-auto'>
                    <span className='text-primary'>{state === "Admin" ? "Admin" : "Doctor"}</span> Login
                </p>

                <div className='w-full'>
                    <p>Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        disabled={loading}
                        className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        disabled={loading}
                        className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
                </div>

                <button
                    disabled={loading}
                    className='bg-primary text-white w-full py-2 rounded-md text-base'>
                    {loading ? 'Loading...' : 'Login'}
                </button>
                {state === "Admin" ?
                    <p>
                        Doctor Login? <span onClick={() => setState("Doctor")} className="text-primary underline cursor-pointer">Click here</span>
                    </p>
                    :
                    <p>
                        Admin Login? <span onClick={() => setState("Admin")} className="text-primary underline cursor-pointer">Click here</span>
                    </p>
                }
                {error && <p className='text-red-500 mt-5'>{error}</p>}
            </div>
        </form>
    )
}

export default Login
