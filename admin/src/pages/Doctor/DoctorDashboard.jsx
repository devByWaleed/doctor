import { useEffect } from 'react'
import { currency, getDashData, cancelAppointment, completeAppointment } from '../../features/doctors/doctorSlice'
import { useSelector, useDispatch } from 'react-redux';
import { assets } from '../../assets/assets';

const DoctorDashboard = () => {
    const { doctorToken, dashData } = useSelector((state) => state.doctor);
    const dispatch = useDispatch()

    const months = ["", "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split("_")
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    useEffect(() => {
        if (doctorToken) {
            dispatch(getDashData(doctorToken))
        }
    }, [doctorToken, dispatch])

    return dashData && (
        <div className='m-5'>
            <div className='flex flex-wrap gap-3'>
                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.earning_icon} alt="Doctor Icon" />

                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.earnings} {currency}</p>
                        <p className='text-gray-400'>Earnings</p>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.appointments_icon} alt="Doctor Icon" />

                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
                        <p className='text-gray-400'>Appointments</p>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.patients_icon} alt="Doctor Icon" />

                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
                        <p className='text-gray-400'>Patients</p>
                    </div>
                </div>
            </div>

            <div className='bg-white '>
                <div className='flex items-center gap-2.5 p-4 mt-10 rounded-t border'>
                    <img className='' src={assets.list_icon} alt="List Icon" />
                    <p className='font-semibold'>Latest Bookings</p>
                </div>
            </div>

            <div className="pt-4 border border-t-0">
                {
                    dashData.latestAppointments.map((item, index) => (
                        <div key={index} className="flex items-center px-6 py-3 gap-3 bg-gray-100">
                            <img className='rounded-full w-10' src={item.userData.image} alt="Doctor Image" />

                            <div className='flex-1 text-sm'>
                                <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                                <p className='text-gray-600'>{slotDateFormat(item.slotDate)}</p>
                            </div>

                            {
                                item.cancelled ?
                                    <p className='text-red-600 text-xs font-medium hover:bg-gray-300'>Cancelled</p>
                                    : item.isCompleted ? <p className='text-green-600 text-xs font-medium hover:bg-gray-300'>Completed</p>
                                        :

                                        <div className='flex'>
                                            <img
                                                onClick={() => dispatch(cancelAppointment({ doctorToken, appointmentId: item._id }))}
                                                className='w-10 cursor-pointer' src={assets.cancel_icon} alt="Cancel Icon" />
                                            <img
                                                onClick={() => dispatch(completeAppointment({ doctorToken, appointmentId: item._id }))}
                                                className='w-10 cursor-pointer' src={assets.tick_icon} alt="Tick Icon" />
                                        </div>
                            }
                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default DoctorDashboard
