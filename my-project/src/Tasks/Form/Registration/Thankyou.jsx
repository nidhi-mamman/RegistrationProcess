import { useAuth } from "../../Context/ContextProvider"

const Thankyou = () => {
    const {user}=useAuth()
        return (
        <>
            <div className="flex  flex-col m-40">
                <h1 className="text-5xl font-bold text-purple-800">WELCOME {user.firstName}</h1>
                <h1 className="text-5xl font-bold text-purple-800 mt-10">You have been successfully Logged In</h1>
            </div>
        </>
    )
}

export default Thankyou