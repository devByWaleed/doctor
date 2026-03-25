import { assets } from '../assets/assets'
import { useDispatch, useSelector } from 'react-redux';
import { setAdminToken } from '../features/admin/adminSlice';
import { setDoctorToken } from '../features/doctors/doctorSlice';
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const { adminToken } = useSelector((state) => state.admin);
    const { doctorToken } = useSelector((state) => state.doctor);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const logout = () => {
        navigate('/')
        adminToken && dispatch(setAdminToken(""))
        adminToken && localStorage.removeItem("adminToken")
        doctorToken && dispatch(setDoctorToken(""))
        doctorToken && localStorage.removeItem("doctorToken")
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
