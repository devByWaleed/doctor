import React from 'react'
import { assets } from '../assets/assets'
import { useDispatch, useSelector } from 'react-redux';
import { setAdminToken } from '../features/admin/adminSlice';
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const dispatch = useDispatch();
    const { adminToken } = useSelector((state) => state.admin);
    const navigate = useNavigate()

    const logout = () => {
        navigate('/')
        adminToken && dispatch(setAdminToken(""))
        adminToken && localStorage.removeItem("adminToken")
    }

    return (
        <div className='flex items-center justify-between text-sm py-4 border-b border-b-gray-400'>
            <div className="flex items-center gap-2 text-xs">

                <img className='w-44 cursor-pointer' src={assets.admin_logo} alt="Logo" />
                <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{adminToken ? "Admin" : "Doctor"}</p>
            </div>
            <button onClick={logout} className="bg-primary text-white text-sm px-10 py-2 rounded-full">Logout</button>

        </div>
    )
}

export default Navbar
