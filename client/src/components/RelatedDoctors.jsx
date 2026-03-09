import { useEffect, useState } from 'react'
import { doctors } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({ docID, speciality }) => {
    const [relDocs, setRelDocs] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (doctors.length > 0 && speciality) {

            // Filtering doctors by speciality 
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docID)
            setRelDocs(doctorsData);
        }
    }, [doctors, docID, speciality])
    return (
        <div className='flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10'>
            <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>

            <div className="w-full grid my-custom-grid gap-4 pt-5 gap-y-6 px-3 sm:px-0">
                {relDocs.slice(0, 5).map((item) => (
                    <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2.5 transition-all duration-500" key={item._id}>
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
                ))}
            </div>
            <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='bg-[#EAEFFF] text-gray-600 px-12 py-3 rounded-full mt-10'>More</button>
        </div>
    )
}

export default RelatedDoctors
