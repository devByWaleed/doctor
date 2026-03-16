import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios'
import {
    setDoctors
} from '../redux/userSlice'

const Appointment = () => {

    const { docID } = useParams()
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const [docInfo, setDocInfo] = useState(null)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState("")
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userToken, doctors } = useSelector((state) => state.user);


    const fetchDocInfo = async () => {

        if (doctors && doctors.length > 0) {
            const foundDoc = doctors.find(doc => doc._id === docID)
            if (foundDoc) {
                setDocInfo(foundDoc)
                return // Exit early if found
            }
        }

        try {
            const { data } = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/doctor/list")
            if (data.success) {
                // Update Redux so other components also have the data now
                dispatch(setDoctors(data.message))

                // Find the specific doctor from the fresh data
                const foundDoc = data.message.find(doc => doc._id === docID)
                setDocInfo(foundDoc)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to load doctor information")
        }

    }


    const getAvailableSlots = async () => {
        setDocSlots([])

        let today = new Date()

        for (let i = 0; i < 7; i++) {
            // Get Date with index
            let currentDate = new Date(today)

            // Set future date
            currentDate.setDate(today.getDate() + i)

            // Setting end time in date with index
            let endTime = new Date(currentDate)
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            // Setting hours
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            }
            else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = []
            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                // Add slot to array
                timeSlots.push({
                    datetime: new Date(currentDate),
                    time: formattedTime
                })

                // Increment current time by 30 min
                currentDate.setMinutes(currentDate.getMinutes() + 30)

            }
            setDocSlots(prev => ([...prev, timeSlots]))
        }
    }

    const bookAppointment = async () => {
        if (!userToken) {
            toast.warn("Login to book appointment")
            return navigate("/login")
        }

        try {
            const date = docSlots[slotIndex][0].datetime

            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()

            const slotDate = day + "_" + month + "_" + year
            // console.log(slotDate);

            const { data } = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/book-appointment", { docID, slotDate, slotTime }, { headers: { userToken } })

            if (data.success === false) {
                toast.error(data.message)
                return
            }
            // dispatch(setDoctors(data.message));
            toast.success(data.message)
            navigate("/my-appointments")

        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchDocInfo()
    }, [doctors, docID])


    useEffect(() => {
        getAvailableSlots()
    }, [docInfo])


    useEffect(() => {
        console.log(docSlots);

    }, [docSlots])

    return docInfo && (
        <div>
            {/* ----- Doctor Details ----- */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img src={docInfo.image} alt="Doctor" className='bg-primary w-full sm:max-w-72 rounded-lg' />
                </div>

                <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 -mt-20 sm:mt-0'>
                    {/* ----- Doctor Info: name, degree, experience ----- */}
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
                        {docInfo.name} <img src={assets.verified_icon} alt="Verified Icon" className='w-5' />
                    </p>

                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>

                    {/* ----- Doctor About ----- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About <img src={assets.info_icon} alt="Info Icon" className='w-3' /></p>
                        <p className='text-sm text-gray-600 max-w-175 mt-1'>{docInfo.about}</p>
                    </div>
                    <p className='text-gray-500 font-medium mt-4'>
                        Appointment fee: <span className='text-gray-600'>{docInfo.fees}</span>
                    </p>
                </div>
            </div>


            {/* ----- Appointment ----- */}
            <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
                <p>Booking slots</p>
                <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                    {docSlots.length && docSlots.map((item, index) => (
                        <div onClick={() => setSlotIndex(index)} key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-[#DDDDDD]'}`}>
                            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
                    {docSlots.length && docSlots[slotIndex].map((item, index) => (
                        <p onClick={() => setSlotTime(item.time)} key={index} className={`text-sm font-light  shrink-0 px-5 py-2 rounded-full cursor-pointer text-[#949494] border border-[#B4B4B4] ${item.time === slotTime ? 'bg-primary text-white' : 'border border-[#DDDDDD]'}`}>
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                <button
                    onClick={bookAppointment}
                    className='bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6'>
                    Book an appointment
                </button>
            </div>


            {/* ----- Related Doctors ----- */}
            <RelatedDoctors docID={docID} speciality={docInfo.speciality} />
        </div>
    )
}

export default Appointment
