import { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux';
import { loadUserProfileData } from '../redux/userSlice';

const MyProfile = () => {
    const { userToken, user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const [userData, setUserData] = useState(false)


    const updateUserProfile = async () => {
        try {
            const formData = new FormData()

            formData.append("name", userData.name)
            formData.append("phone", userData.phone)
            formData.append("address", JSON.stringify(userData.address))
            formData.append("gender", userData.gender)
            formData.append("dob", userData.dob)

            image && formData.append("image", image)

            const { data } = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/update-profile", formData, { headers: { userToken } })

            if (data.success === false) {
                toast.error(data.message)
                return
            }

            toast.success(data.message)
            dispatch(loadUserProfileData(userToken))
            setIsEdit(false)
            setImage(false)

        } catch (error) {
            toast.error(error.message)
        }
    }

    // Sync Redux data to Local State when it's fetched
    useEffect(() => {
        if (user) {
            setUserData(user);
        }
    }, [user]);

    useEffect(() => {
        if (userToken) {
            dispatch(loadUserProfileData(userToken))
        } else {
            setUserData(false)
        }
    }, [userToken])

    if (!user || !userData) {
        return <div className='p-5'>Loading profile...</div>;
    }


    return (
        <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>

            {
                isEdit ?
                    <label htmlFor="image">
                        <div className='inline-block relative cursor-pointer'>
                            <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : user.image} alt="" />
                            <img className='w-10 absolute bottom-12 right-12' src={image ? "" : assets.upload_icon} alt="" />
                        </div>
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                    </label>
                    :

                    <img className='w-36 rounded' src={user.image} alt="Profile Pic" />
            }

            {
                isEdit
                    ? <input className='bg-gray-50 text-3xl font-medium max-w-60' type="text" value={user.name} onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} />
                    : <p className='font-medium text-3xl text-[#262626] mt-4'>{user.name}</p>
            }

            <hr className='bg-[#ADADAD] h-px border-none' />

            <div>
                <p className='text-gray-600 underline mt-3'>Contact Information</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]'>
                    <p className='font-medium'>Email ID:</p>
                    <p className='text-blue-500'>{user.email}</p>
                    <p className='font-medium'>Phone:</p>
                    {
                        isEdit
                            ? <input className='bg-gray-50 max-w-52' type="phone" value={user.phone} onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
                            : <p className='text-blue-500'>{user.phone}</p>
                    }
                    <p className='font-medium'>Address:</p>
                    {
                        isEdit
                            ?
                            <p>

                                <input className='bg-gray-50' type="text" value={user.address.line1} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} />
                                <br />
                                <input className='bg-gray-50' type="text" value={user.address.line2} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} />

                            </p>
                            : <p>
                                {user.address.line1}
                                <br />
                                {user.address.line2}
                            </p>
                    }
                </div>
            </div>

            <div>
                <p className='text-[#797979] underline mt-3'>BASIC INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
                    <p className='font-medium'>Gender:</p>
                    {
                        isEdit
                            ? <select className='max-w-20 bg-gray-50' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={user.gender}>
                                <option value="Not Selected">Not Selected</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            : <p className='text-gray-500'>{user.gender}</p>
                    }
                    <p className='font-medium'>Birthday:</p>
                    {
                        isEdit
                            ? <input className='max-w-28 bg-gray-50' type="date" value={user.dob} onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} />
                            : <p className='text-gray-500'>{user.dob}</p>
                    }
                </div>
            </div>

            <div>
                {
                    isEdit
                        ? <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'
                            onClick={updateUserProfile}>Save Information
                        </button>
                        : <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'
                            onClick={() => setIsEdit(true)}>Edit
                        </button>
                }
            </div>
        </div>
    )
}

export default MyProfile