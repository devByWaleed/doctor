import { useState } from 'react'
import { assets } from '../../assets/assets'
import { specialityData } from '../../../../client/src/assets/assets'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [formInput, setFormInput] = useState({
        name: "",
        email: "",
        password: "",
        experience: "1 Year",
        fees: "",
        about: "",
        speciality: "General physician",
        degree: "",
        address1: "",
        address2: "",
    });

    // const dispatch = useDispatch();
    const { adminToken } = useSelector((state) => state.admin);

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        console.log(formInput);

        try {
            if (!docImg) {
                return toast.error("Image not selected")
            }

            let formData = new FormData()

            formData.append('image', docImg)
            formData.append('name', formInput.name)
            formData.append('email', formInput.email)
            formData.append('password', formInput.password)
            formData.append('experience', formInput.experience)
            formData.append('fees', Number(formInput.fees))
            formData.append('about', formInput.about)
            formData.append('speciality', formInput.speciality)
            formData.append('degree', formInput.degree)
            formData.append('address', JSON.stringify({ line1: formInput.address1, line2: formInput.address2 }))

            // Log formInput
            formData.forEach((value, key) => {
                console.log(`${key} : ${value}`);
            });

            const { data } = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/admin/add-doctor', formData, { headers: { adminToken } })

            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setFormInput({
                    name: "",
                    email: "",
                    password: "",
                    experience: "1 Year",
                    fees: "",
                    about: "",
                    speciality: "General physician",
                    degree: "",
                    address1: "",
                    address2: "",
                })
            } else {
                toast.error(data.message)
            }
        } catch (error) {

        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Doctor</p>

            <div className='bg-white p-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor='doc-img'>
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer'
                            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="Upload Area" />
                    </label>
                    <input
                        onChange={(e) => setDocImg(e.target.files[0])}
                        type="file" id="doc-img" />
                    <p>Upload Doctor <br /> Picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor name</p>
                            <input
                                id='name'
                                onChange={(e) => setFormInput({
                                    ...formInput,
                                    [e.target.id]: e.target.value
                                })}
                                value={formInput.name}
                                className='border rounded px-3 py-2'
                                type="text" placeholder='Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input
                                id='email'
                                onChange={(e) => setFormInput({
                                    ...formInput,
                                    [e.target.id]: e.target.value
                                })}
                                value={formInput.email}
                                className='border rounded px-3 py-2'
                                type="email" placeholder='Email' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Password</p>
                            <input
                                id='password'
                                onChange={(e) => setFormInput({
                                    ...formInput,
                                    [e.target.id]: e.target.value
                                })}
                                value={formInput.password}
                                className='border rounded px-3 py-2'
                                type="password" placeholder='Password' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Experience</p>
                            <select
                                id='experience'
                                onChange={(e) => setFormInput({
                                    ...formInput,
                                    [e.target.id]: e.target.value
                                })}
                                value={formInput.experience}
                                className='border rounded px-3 py-2'>
                                <option value="1 Year">1 Year</option>
                                <option value="2 Year">2 Year</option>
                                <option value="3 Year">3 Year</option>
                                <option value="4 Year">4 Year</option>
                                <option value="5 Year">5 Year</option>
                                <option value="6 Year">6 Year</option>
                                <option value="7 Year">7 Year</option>
                                <option value="8 Year">8 Year</option>
                                <option value="9 Year">9 Year</option>
                                <option value="10 Year">10 Year</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Fees</p>
                            <input
                                id='fees'
                                onChange={(e) => setFormInput({
                                    ...formInput,
                                    [e.target.id]: e.target.value
                                })}
                                value={formInput.fees}
                                className='border rounded px-3 py-2'
                                type="numbers" placeholder='Fees' required />
                        </div>
                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select
                                id='speciality'
                                onChange={(e) => setFormInput({
                                    ...formInput,
                                    [e.target.id]: e.target.value
                                })}
                                value={formInput.speciality}
                                className='border rounded px-3 py-2'>
                                {
                                    specialityData.map((item, index) => (
                                        <option key={index} value={item.speciality}>{item.speciality}</option>
                                    ))}
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Education</p>
                            <input
                                id='degree'
                                onChange={(e) => setFormInput({
                                    ...formInput,
                                    [e.target.id]: e.target.value
                                })}
                                value={formInput.degree}
                                className='border rounded px-3 py-2'
                                type="text" placeholder='Education' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Address</p>
                            <input
                                id='address1'
                                onChange={(e) => setFormInput({
                                    ...formInput,
                                    [e.target.id]: e.target.value
                                })}
                                value={formInput.address1}
                                className='border rounded px-3 py-2'
                                type="text" placeholder='Address 1' required />
                            <input
                                id='address2'
                                onChange={(e) => setFormInput({
                                    ...formInput,
                                    [e.target.id]: e.target.value
                                })}
                                value={formInput.address2}
                                className='border rounded px-3 py-2'
                                type="text" placeholder='Address 2' required />
                        </div>
                    </div>

                    <div className='flex-1 flex flex-col gap-1'>
                        <p className='mt-4 mb-2'>About Doctor</p>
                        <textarea
                            id='about'
                            onChange={(e) => setFormInput({
                                ...formInput,
                                [e.target.id]: e.target.value
                            })}
                            value={formInput.about}
                            className='w-full x-4 pt-2 border rounded' placeholder='Write About Doctor' rows={5} required />
                    </div>

                    <button type='Submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add Doctor</button>
                </div>
            </div>
        </form>
    )
}

export default AddDoctor
