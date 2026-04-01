import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { backendURL, currency, getDoctorsData } from '../redux/userSlice'
import axios from 'axios'

const Appointment = () => {
    const { docID } = useParams()
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    // Redux State
    const { userToken, doctors, doctorsLoading } = useSelector((state) => state.user);

    // Local State
    const [docInfo, setDocInfo] = useState(null)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState("")

    // 1. Fetch doctors if the list is empty
    useEffect(() => {
        if (!doctors || doctors.length === 0) {
            dispatch(getDoctorsData())
        }
    }, [dispatch, doctors])

    // 2. Find the specific doctor from the list
    const fetchDocInfo = () => {
        if (doctors && doctors.length > 0) {
            const foundDoc = doctors.find(doc => doc._id === docID)
            if (foundDoc) {
                setDocInfo(foundDoc)
            } else if (!doctorsLoading) {
                toast.error("Doctor not found")
                navigate('/doctors')
            }
        }
    }

    useEffect(() => {
        fetchDocInfo()
    }, [doctors, docID])

    // 3. Generate Available Slots
    const getAvailableSlots = async () => {
        if (!docInfo) return; // Wait until doctor info is loaded

        setDocSlots([])
        let today = new Date()

        let allSlots = [] // Temp array to build slots

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            let endTime = new Date(currentDate)
            endTime.setHours(21, 0, 0, 0)

            // Adjust start time for today or future days
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let daySlots = []
            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                daySlots.push({
                    datetime: new Date(currentDate),
                    time: formattedTime
                })
                currentDate.setMinutes(currentDate.getMinutes() + 30)
            }
            allSlots.push(daySlots)
        }
        setDocSlots(allSlots)
    }

    useEffect(() => {
        getAvailableSlots()
    }, [docInfo])

    const bookAppointment = async () => {
        if (!userToken) {
            toast.warn("Login to book appointment")
            return navigate("/login")
        }

        if (!slotTime) {
            return toast.warn("Please select a time slot before booking")
        }

        try {
            const date = docSlots[slotIndex][0].datetime
            const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`

            const { data } = await axios.post(
                backendURL + "/api/user/book-appointment",
                { docID, slotDate, slotTime },
                { headers: { userToken } }
            )

            if (data.success) {
                toast.success(data.message)
                navigate("/my-appointments")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    if (doctorsLoading || !docInfo) {
        return <div className="text-center py-20 text-gray-500">Loading Doctor Details...</div>
    }

    return (
        <div>
            {/* ----- Doctor Details ----- */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img src={docInfo.image} alt="" className='bg-primary w-full sm:max-w-72 rounded-lg' />
                </div>

                <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 -mt-20 sm:mt-0'>
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
                        {docInfo.name} <img src={assets.verified_icon} alt="" className='w-5' />
                    </p>

                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>

                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>
                            About <img src={assets.info_icon} alt="" className='w-3' />
                        </p>
                        <p className='text-sm text-gray-600 max-w-175 mt-1'>{docInfo.about}</p>
                    </div>
                    <p className='text-gray-500 font-medium mt-4'>
                        Appointment fee: <span className='text-gray-600'>{docInfo.fees} {currency}</span>
                    </p>
                </div>
            </div>

            {/* ----- Booking Slots ----- */}
            <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
                <p>Booking slots</p>
                <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                    {docSlots.length > 0 && docSlots.map((item, index) => (
                        <div onClick={() => setSlotIndex(index)} key={index}
                            className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-all ${slotIndex === index ? 'bg-primary text-white' : 'border border-[#DDDDDD]'}`}>
                            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
                    {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
                        <p onClick={() => setSlotTime(item.time)} key={index}
                            className={`text-sm font-light shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all ${item.time === slotTime ? 'bg-primary text-white' : 'text-[#949494] border border-[#DDDDDD]'}`}>
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                <button
                    onClick={bookAppointment}
                    className='bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6 hover:scale-105 transition-all'>
                    Book an appointment
                </button>
            </div>

            <RelatedDoctors docID={docID} speciality={docInfo.speciality} />
        </div>
    )
}

export default Appointment