import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setUserToken,
    loadUserProfileData
} from '../redux/userSlice'

const Navbar = () => {

    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false)
    const { userToken, user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const logout = () => {
        dispatch(setUserToken(""))
        localStorage.removeItem("userToken")
        navigate('/login')
    }

    useEffect(() => {
        if (userToken) {
            dispatch(loadUserProfileData(userToken))
        }
    }, [userToken])

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
            <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="Logo" />
            <ul className='hidden md:flex items-start gap-5 font-medium'>

                <NavLink to='/'>
                    <li className='py-1'>HOME</li>
                    <hr className='border-none outline-none h-0.5 w-3/5 m-auto hidden bg-primary ' />
                </NavLink>

                <NavLink to='/doctors'>
                    <li className='py-1'>ALL DOCTORS</li>
                    <hr className='border-none outline-none h-0.5 w-3/5 m-auto hidden bg-primary ' />
                </NavLink>

                <NavLink to='/about'>
                    <li className='py-1'>ABOUT</li>
                    <hr className='border-none outline-none h-0.5 w-3/5 m-auto hidden bg-primary ' />
                </NavLink>

                <NavLink to='/contact'>
                    <li className='py-1'>CONTACT</li>
                    <hr className='border-none outline-none h-0.5 w-3/5 m-auto hidden bg-primary ' />
                </NavLink>
            </ul>

            <div className='flex items-center gap-4'>
                {
                    userToken ?
                        <div className='flex items-center gap-2 cursor-pointer group relative'>
                            <img className='w-8 rounded-full' src={user?.image} alt="Pic" />
                            <img className='w-2.5 cursor-pointer' src={assets.dropdown_icon} alt="Icon" />

                            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                    <p onClick={() => navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                    <p onClick={() => navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                                    <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                                </div>
                            </div>
                        </div> :

                        <button onClick={() => navigate('/login')} className='rounded-full font-light py-3 px-8 hidden md:block text-white bg-primary'>Create Account</button>
                }
                <img className='w-6 md:hidden' onClick={() => setShowMenu(true)} src={assets.menu_icon} alt="Menu Icon" />
                {/* ---------- Mobile Menu ---------- */}
                <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden fixed w-full right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                    <div className='flex items-center justify-between px-5 py-6'>
                        <img className='w-36' src={assets.logo} alt="Logo" />
                        <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="Close Icom" />
                    </div>

                    <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                        <NavLink onClick={() => setShowMenu(false)} to={'/'}><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to={'/doctors'}><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to={'/about'}><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to={'/contact'}><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar
