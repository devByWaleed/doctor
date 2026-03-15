import { useState, useEffect, useCallback } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, setUserData } from '../redux/userSlice'

const MyProfile = () => {
    const { userToken, userData, loading } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(null)
    const [localUserData, setLocalUserData] = useState(null)

    // Sync local state when userData changes (only when editing)
    useEffect(() => {
        if (userData && isEdit) {
            setLocalUserData(userData);
        }
    }, [userData, isEdit]);

    // Fetch profile on mount if token exists
    useEffect(() => {
        if (userToken && !userData) {
            dispatch(fetchUserProfile(userToken));
        }
    }, [userToken, userData, dispatch]);

    const updateUserProfile = useCallback(async () => {
        if (!localUserData) return;

        try {
            const formData = new FormData();
            formData.append("name", localUserData.name);
            formData.append("phone", localUserData.phone);
            formData.append("address", JSON.stringify(localUserData.address));
            formData.append("gender", localUserData.gender);
            formData.append("dob", localUserData.dob);
            if (image) formData.append("image", image);

            const { data } = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/user/update-profile",
                formData,
                { headers: { userToken } }
            );

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            toast.success(data.message);

            // Refresh profile data from server
            await dispatch(fetchUserProfile(userToken));

            setIsEdit(false);
            setImage(null);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }, [localUserData, image, userToken, dispatch]);

    const handleEditClick = () => {
        if (userData) {
            setLocalUserData(userData);
            setIsEdit(true);
        }
    };

    if (loading || !userData) {
        return <div className='max-w-lg p-8'>Loading profile...</div>;
    }


    return userData && (
        <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>

            {
                isEdit ?
                    <label htmlFor="image">
                        <div className='inline-block relative cursor-pointer'>
                            <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="Profile" />
                            <img className='w-10 absolute bottom-12 right-12' src={image ? "" : assets.upload_icon} alt="" />
                        </div>
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                    </label>
                    :

                    <img className='w-36 rounded' src={userData.image} alt="Profile Pic" />
            }

            {
                isEdit
                    ? <input className='bg-gray-50 text-3xl font-medium max-w-60' type="text" value={localUserData?.name || ''}
                        onChange={(e) => setLocalUserData(prev => ({ ...prev, name: e.target.value }))} />
                    : <p className='font-medium text-3xl text-[#262626] mt-4'>{userData.name}</p>
            }

            <hr className='bg-[#ADADAD] h-px border-none' />

            <div>
                <p className='text-gray-600 underline mt-3'>Contact Information</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]'>
                    <p className='font-medium'>Email ID:</p>
                    <p className='text-blue-500'>{userData.email}</p>
                    <p className='font-medium'>Phone:</p>
                    {
                        isEdit
                            ? <input className='bg-gray-50 max-w-52' type="phone" value={localUserData?.phone}
                                onChange={(e) => setLocalUserData(prev => ({ ...prev, phone: e.target.value }))} />
                            : <p className='text-blue-500'>{userData.phone}</p>
                    }
                    <p className='font-medium'>Address:</p>
                    {
                        isEdit
                            ?
                            <p>

                                <input className='bg-gray-50' type="text" value={localUserData?.address.line1}
                                    onChange={(e) => setLocalUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} />
                                <br />
                                <input className='bg-gray-50' type="text" value={localUserData?.address.line2}
                                    onChange={(e) => setLocalUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} />

                            </p>
                            : <p>
                                {userData.address.line1}
                                <br />
                                {userData.address.line2}
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
                            ? <select className='max-w-20 bg-gray-50'
                                onChange={(e) => setLocalUserData(prev => ({ ...prev, gender: e.target.value }))}
                                value={localUserData?.gender}>
                                <option value="Not Selected">Not Selected</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            : <p className='text-gray-500'>{userData.gender}</p>
                    }
                    <p className='font-medium'>Birthday:</p>
                    {
                        isEdit
                            ? <input className='max-w-28 bg-gray-50' type="date" value={localUserData?.dob}
                                onChange={(e) => setLocalUserData(prev => ({ ...prev, dob: e.target.value }))} />
                            : <p className='text-gray-500'>{userData.dob}</p>
                    }
                </div>
            </div>

            <div>
                {
                    isEdit
                        ? <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={updateUserProfile}>Save Information</button>
                        : <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={handleEditClick}>Edit</button>
                }
            </div>
        </div>
    )
}

export default MyProfile