import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import {
    signInStart,
    signInSuccess,
    signInFailure,
    setAdminToken,
    backendURL
} from '../features/admin/adminSlice'
import {
    doctorSignInStart,
    doctorSignInSuccess,
    doctorSignInFailure,
    setDoctorToken
} from '../features/doctors/doctorSlice'

const Login = () => {
    const [state, setState] = useState('Admin')

    const { loading, error } = useSelector((state) => state.admin);
    const { doctorLoading, doctorError, doctorToken } = useSelector((state) => state.doctor);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLoading = state === "Admin" ? loading : doctorLoading;
    const currentError = state === "Admin" ? error : doctorError;

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        try {
            if (state === "Admin") {
                dispatch(signInStart());
                const { data } = await axios.post(backendURL + "/api/admin/login", { email, password })

                if (data.success === false) {
                    dispatch(signInFailure(data.message))
                    toast.error(data.message)
                    return

                }
                dispatch(signInSuccess(data));
                dispatch(setAdminToken(data.adminToken));
                localStorage.setItem('adminToken', data.adminToken)
                navigate("/admin-dashboard")
                console.log(data.adminToken);
                toast.success(data.message)
            }
            else {
                dispatch(doctorSignInStart());
                const { data } = await axios.post(backendURL + "/api/doctor/login", { email, password })

                if (data.success === false) {
                    dispatch(doctorSignInFailure(data.message))
                    toast.error(data.message)
                    return

                }
                dispatch(doctorSignInSuccess(data));
                dispatch(setDoctorToken(data.doctorToken));
                localStorage.setItem('doctorToken', data.doctorToken)
                navigate("/doctor-dashboard")
                console.log(data.doctorToken);
                toast.success(data.message)
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            if (state === "Admin") {
                dispatch(signInFailure(errorMessage));
            } else {
                dispatch(doctorSignInFailure(errorMessage));
            }
            toast.error(errorMessage);
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
                        disabled={isLoading}
                        className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        disabled={isLoading}
                        className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
                </div>

                <button
                    disabled={isLoading}
                    className='bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-80'>
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
                {currentError && <p className='text-red-500 mt-5'>{currentError}</p>}
            </div>
        </form>
    )
}

export default Login
