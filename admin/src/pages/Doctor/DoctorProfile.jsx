import { useState, useEffect } from 'react'
import { backendURL, currency, getProfileData } from '../../features/doctors/doctorSlice'
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorProfile = () => {
    const { doctorToken, doctorProfile } = useSelector((state) => state.doctor);
    const dispatch = useDispatch()

    const [isEdit, setIsEdit] = useState(false)
    const [profileData, setProfileData] = useState(null)


    const updateDoctorProfile = async () => {
        try {
            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                available: profileData.available,
            }

            const { data } = await axios.post(backendURL + "/api/doctor/update-profile", updateData, { headers: { doctorToken } })

            if (data.success === false) {
                toast.error(data.message)
                return
            }

            toast.success(data.message)
            setIsEdit(false)
            dispatch(getProfileData(doctorToken))

        } catch (error) {
            toast.error(error.message)
        }
    }


    useEffect(() => {
        if (doctorToken) {
            dispatch(getProfileData(doctorToken))
        }
    }, [doctorToken, dispatch])

    // SYNC local state when doctorProfile loads from API
    useEffect(() => {
        if (doctorProfile) {
            setProfileData(doctorProfile)
        }
    }, [doctorProfile])

    // Guard clause: If profileData hasn't loaded yet, show nothing or a loader
    if (!doctorProfile || !profileData) return null;

    return (
        <div>
            <div className='flex flex-col gap-4 m-5'>
                <div>
                    <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={doctorProfile.image} alt="Doctor Pic" />
                </div>

                <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{doctorProfile.name}</p>

                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{doctorProfile.degree} - {doctorProfile.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{doctorProfile.experience}</button>
                    </div>

                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
                        <p className='text-sm text-gray-600 max-w-175 mt-1'>{doctorProfile.about}</p>
                    </div>

                    <p className='text-gray-600 font-medium mt-4'>
                        Appointment Fee:
                        <span className='text-gray-800 ml-2'>
                            {isEdit
                                ? <input className='border px-2' type="number" onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} />
                                : doctorProfile.fees
                            } {currency}
                        </span>
                    </p>

                    <div className='flex gap-2 py-2'>
                        <p>Address:</p>
                        <div className='text-sm'>
                            {isEdit
                                ? <input className='border px-2 mb-1' type="text" onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData.address.line1} />
                                : doctorProfile.address.line1
                            }
                            <br />
                            {isEdit
                                ? <input className='border px-2' type="text" onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileData.address.line2} />
                                : doctorProfile.address.line2
                            }
                        </div>
                    </div>

                    <div className='flex gap-1 pt-2'>
                        {/* Tie the checkbox to profileData.available */}
                        <input
                            onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
                            checked={isEdit ? profileData.available : doctorProfile.available}
                            type="checkbox"
                            id='status'
                        />
                        <label htmlFor='status'>
                            {profileData.available ?
                                <>
                                    <p>Available</p>
                                </> :
                                <>
                                    <p>Not Available</p>
                                </>
                            }
                        </label>
                    </div>

                    <div className='mt-5'>
                        {isEdit ? (
                            <button
                                onClick={updateDoctorProfile} // You'll need to dispatch an update API call here later
                                className='px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all'>
                                Save
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEdit(true)}
                                className='px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all'>
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile