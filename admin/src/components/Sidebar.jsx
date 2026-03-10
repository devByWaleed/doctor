import React from 'react'
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {

    const { adminToken } = useSelector((state) => state.admin);
    return (
        <div className='min-h-screen bg-white border-r'>
            {
                adminToken &&
                <ul className='text-gray-600 mt-5'>
                    <NavLink
                        className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}
                        to={`/admin-dashboard`}>
                        <img src={assets.home_icon} alt="Home Icon" />
                        <p>Dashboard</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}
                        to={`/all-appointments`}>
                        <img src={assets.appointment_icon} alt="Appointment Icon" />
                        <p>Appointments</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}
                        to={`/add-doctor`}>
                        <img src={assets.add_icon} alt="Add Icon" />
                        <p>Add Doctor</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}
                        to={`/doctor-list`}>
                        <img src={assets.people_icon} alt="People Icon" />
                        <p>Doctors List</p>
                    </NavLink>
                </ul>
            }
        </div>
    )
}

export default Sidebar
