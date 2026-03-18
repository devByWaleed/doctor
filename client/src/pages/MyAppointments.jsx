import { useState } from 'react'
import { useSelector } from 'react-redux';
import { backendURL } from '../redux/userSlice'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const MyAppointments = () => {
    const { userToken } = useSelector((state) => state.user);


    const [appointments, setAppointments] = useState([])
    const months = ["", "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split("_")
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }


    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendURL + "/api/user/appointments", { headers: { userToken } })

            if (data.success === false) {
                toast.error(data.message)
                return
            }
            setAppointments(data.appointments.reverse())
            console.log(data.appointments.reverse())

        } catch (error) {
            toast.error(error.message)
        }
    }


    const cancelAppointments = async (appointmentID) => {
        try {
            const { data } = await axios.post(backendURL + "/api/user/cancel-appointment", { appointmentID }, { headers: { userToken } })

            if (data.success === false) {
                toast.error(data.message)
                return
            }
            toast.success(data.message)
            getUserAppointments()
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (userToken) {
            getUserAppointments()
        }
    }, [userToken])

    return (
        <div>
            <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">My appointments</p>

            <div>
                {appointments.slice(0, 2).map((item) => (
                    <div key={item._id} className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b">
                        {/* Image */}
                        <div>
                            <img className='w-36 bg-[#EAEFFF]' src={item.docData.image} alt="Doctor" />
                        </div>

                        {/* Details */}
                        <div className='flex-1 text-sm text-[#5E5E5E]'>
                            <p className='text-[#262626] text-base font-semibold'>{item.docData.name}</p>
                            <p>{item.docData.speciality}</p>
                            <p className="text-[#464646] font-medium mt-1">Address:</p>
                            <p>{item.docData.address.line1}</p>
                            <p>{item.docData.address.line2}</p>
                            <p className='mt-1'>
                                <span className='text-sm text-[#3C3C3C]'>Date & Time:</span>
                                {slotDateFormat(item.slotDate)} | {item.slotTime}
                            </p>
                        </div>

                        <div></div>

                        {/* Payment */}
                        <div className="flex flex-col gap-2 justify-end text-sm text-center">
                            {!item.cancelled &&
                                <>
                                    <button className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>
                                    <button className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'
                                        onClick={() => cancelAppointments(item._id)}
                                    >Cancel Appointment</button>
                                </>
                            }

                            {item.cancelled &&
                                <button className='sm:min-w-48 py-2 border border-red-500 text-red-500'>Appointment Cancelled</button>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyAppointments
