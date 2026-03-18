import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { specialityData } from '../assets/assets'
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorsData } from '../redux/userSlice'

const Doctors = () => {
    const { speciality } = useParams()

    const [filterDoc, setFilterDoc] = useState([])
    const [showFilter, setShowFilter] = useState(false)
    const { doctors } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const applyFilter = () => {
        if (speciality) {
            setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
        }
        else {
            setFilterDoc(doctors)
        }
    }

    useEffect(() => {
        applyFilter()
    }, [doctors, speciality])

    useEffect(() => {
        dispatch(getDoctorsData());
    }, [dispatch])

    return (
        <div>
            <p className='text-gray-600'>Browse through the doctors specialist.</p>
            <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
                <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}
                    onClick={() => setShowFilter(prev => !prev)}>Filters</button>
                <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
                    {specialityData.map((item, index) => (
                        <p key={index} onClick={() => speciality === item.speciality ? navigate('/doctors') : navigate(`/doctors/${item.speciality}`)} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === item.speciality ? "bg-indigo-100 text-black" : ""}`}>{item.speciality}</p>
                    ))}
                </div>

                <div className='w-full grid my-custom-grid gap-4 gap-y-6'>
                    {
                        filterDoc.map((item) => (
                            <div onClick={() => navigate(`/appointment/${item._id}`)} className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2.5 transition-all duration-500" key={item._id}>
                                <img src={item.image} alt="" className='bg-[#EAEFFF]' />
                                <div className="p-4">
                                    <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                                        {item.available ?
                                            <>
                                                <p className='w-2 h-2 rounded-full bg-green-500'></p>
                                                <p>Available</p>
                                            </> :
                                            <>
                                                <p className='w-2 h-2 rounded-full bg-red-500'></p>
                                                <p>Not Available</p>
                                            </>
                                        }
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
