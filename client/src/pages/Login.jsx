import { useState } from 'react'

const Login = () => {
    const [state, setState] = useState('register')

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        e.preventDefault()
    }


    return (
        <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="min-h-[80vh] flex items-center">
            <div className='flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-88 text-gray-500 rounded-xl shadow-xl border border-gray-200 bg-white'>
                <p className="text-2xl font-semibold"> {state === "login" ? "Login" : "Create Account"}
                </p>
                <p>Please {state === "login" ? "log in" : "sign"} to book appointment</p>
                {state === "register" && (
                    <div className="w-full">
                        <p>Full Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder="Type Name" className="border border-[#DADADA] rounded w-full p-2 mt-1" type="text" required />
                    </div>
                )}
                <div className="w-full ">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Type Email" className="border border-[#DADADA] rounded w-full p-2 mt-1" type="email" required />
                </div>
                <div className="w-full ">
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Type Password" className="border border-[#DADADA] rounded w-full p-2 mt-1" type="password" required />
                </div>
                <button className="bg-primary text-white w-full py-2 my-2 rounded-md text-base">
                    {state === "register" ? "Create Account" : "Login"}
                </button>

                {state === "register" ? (
                    <p>
                        Already have account? <span onClick={() => setState("login")} className="text-primary underline cursor-pointer">Login here</span>
                    </p>
                ) : (
                    <p>
                        Create a new account? <span onClick={() => setState("register")} className="text-primary underline cursor-pointer">click here</span>
                    </p>
                )}
            </div>
        </form>
    )
}

export default Login
