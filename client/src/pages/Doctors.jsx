import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doctors, specialityData } from '../assets/assets'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux';
import { setDoctors } from '../../../admin/src/features/admin/adminSlice'

const Doctors = () => {
    const { speciality } = useParams()

    const [filterDoc, setFilterDoc] = useState([])
    const [showFilter, setShowFilter] = useState(false)
    const navigate = useNavigate();

    const applyFilter = () => {
        if (speciality) {
            setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
        }
        else {
            setFilterDoc(doctors)
        }
    }

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/doctor/list")

            if (data.success === false) {
                toast.error(data.message)
                return

            }
            dispatch(setDoctors(data.message));
            toast.success(data.message)


        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        applyFilter()
    }, [doctors, speciality])
    
    useEffect(() => {
        getDoctorsData()
    }, [])

    return (
        <div>
            <p className='text-gray-600'>Browse through the doctors specialist.</p>
            <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
                <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={() => setShowFilter(prev => !prev)}>Filters</button>
                <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
                    {specialityData.map((item) => (
                        <p key={item.id} onClick={() => speciality === `${item.speciality}` ? navigate('/doctors') : navigate(`/doctors/${item.speciality}`)} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === item.speciality ? "bg-indigo-100 text-black" : ""}`}>{item.speciality}</p>
                    ))}
                </div>

                <div className='w-full grid my-custom-grid gap-4 gap-y-6'>
                    {
                        filterDoc.map((item) => (
                            <div onClick={() => navigate(`/appointment/${item._id}`)} className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2.5 transition-all duration-500" key={item._id}>
                                <img src={item.image} alt="" className='bg-[#EAEFFF]' />
                                <div className="p-4">
                                    <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                                        <p className='w-2 h-2 rounded-full bg-green-500'></p>
                                        <p>Available</p>
                                    </div>

                                    <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                                    <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Doctors
