import { useState } from 'react'
import { assets } from '../assets/assets'


const MyProfile = () => {

    const [userData, setUserData] = useState({
        name: "Waleed Ahmed",
        image: assets.profile_pic,
        email: "abc@gmail.com",
        phone: "+92 123 4567890",
        address: {
            line1: "57th Cross, Richmond",
            line2: "Circle, Church Road, London"
        },
        gender: "Male",
        dob: "2000-01-20"
    })

    const [isEdit, setIsEdit] = useState(true)

    return (
        <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>
            <img className='w-36 rounded' src={userData.image} alt="Profile Pic" />

            {
                isEdit
                    ? <input className='bg-gray-50 text-3xl font-medium max-w-60' type="text" value={userData.name} onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} />
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
                            ? <input className='bg-gray-50 max-w-52' type="phone" value={userData.phone} onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
                            : <p className='text-blue-500'>{userData.phone}</p>
                    }
                    <p className='font-medium'>Address:</p>
                    {
                        isEdit
                            ?
                            <p>

                                <input className='bg-gray-50' type="text" value={userData.address.line1} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} />
                                <br />
                                <input className='bg-gray-50' type="text" value={userData.address.line2} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} />

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
                            ? <select className='max-w-20 bg-gray-50' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
                                <option value="Not Selected">Not Selected</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            : <p className='text-gray-500'>{userData.gender}</p>
                    }
                    <p className='font-medium'>Birthday:</p>
                    {
                        isEdit
                            ? <input className='max-w-28 bg-gray-50' type="date" value={userData.dob} onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} />
                            : <p className='text-gray-500'>{userData.dob}</p>
                    }
                </div>
            </div>

            <div>
                {
                    isEdit
                        ? <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={() => setIsEdit(false)}>Save Information</button>
                        : <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={() => setIsEdit(true)}>Edit</button>
                }
            </div>
        </div>
    )
}

export default MyProfile
// WAR12345