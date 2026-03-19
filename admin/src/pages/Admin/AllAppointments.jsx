import { currency, getAllAppointments } from '../../features/admin/adminSlice'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { assets } from '../../assets/assets';

const AllAppointments = () => {
    const { adminToken, appointments } = useSelector((state) => state.admin);
    const dispatch = useDispatch()
    const months = ["", "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split("_")
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    const calculateAge = (dob) => {
        const today = new Date()
        const birthDate = new Date(dob)

        let age = today.getFullYear() - birthDate.getFullYear()
        return age
    }

    useEffect(() => {
        if (adminToken) {
            dispatch(getAllAppointments(adminToken))
        }
    }, [adminToken])
    return (
        <div className='w-full max-w-6xl m-5'>
            <p className='mb-3 text-lg font-medium'>All Appointments</p>

            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[80vh] overflow-y-scroll'>
                <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Doctor</p>
                    <p>Fees</p>
                    <p>Actions</p>
                </div>

                {appointments.map((item, index) => (
                    <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid-sm sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={item._id}>
                        <p className='max-sm:hidden'>{index + 1}</p>
                        <div className='flex items-center gap-2'>
                            <img className='w-8 rounded-full' src={item.userData.image} alt="User Profile Pic" />
                            <p>{item.userData.name}</p>
                        </div>
                        <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
                        <p className='max-sm:hidden'>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                        <div className='flex items-center gap-2'>
                            <img className='w-8 rounded-full bg-gray-200' src={item.docData.image} alt="Doctor Profile Pic" />
                            <p>{item.docData.name}</p>
                        </div>
                        <p className='max-sm:hidden'>{item.amount} {currency}</p>
                        {item.cancelled ?
                            <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                            :
                            <img className='w-10 cursor-pointer' src={assets.cancel_icon} alt="Cancel Icon" />
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AllAppointments
