import {useState} from 'react'
import toast from 'react-hot-toast'
import {useAuthContext} from '../../context/AuthContext.jsx'
import { useAppContext } from '../../context/AppContext.jsx';
import { useMutation } from "@tanstack/react-query";
 
 const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const {setAuthUser,setTempUserId} = useAuthContext();
    const { backendUrl, setShowVerifyEmail } = useAppContext();

    const mutation = useMutation({
        mutationFn: async ({ email, password }) => {
            const res = await fetch(`${backendUrl}/api/auth/login`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email, password})
            })
            const data = await res.json();
            if(!res.ok){
                if(data.message === "Email is not verified"){
                    setTempUserId(data.userId);
                    setShowVerifyEmail(true)
                }
                throw new Error(data.message)
            }
            return data;
        }
    });

    const login = async (email, password) => {
        const success = handleInputError(email, password);
        if(!success) return;
        setLoading(true)
        try{
            const data = await mutation.mutateAsync({ email, password });
            localStorage.setItem("ccps-user", JSON.stringify(data.userData))
            localStorage.setItem("ccps-token", data.token)
            setAuthUser(data)
            toast.success("Login Successful!");
        }
        catch(error){ 
            toast.error(error.message);
        }
        finally{
            setLoading(false) 
        }
    }
    return {loading, login} 
 }

 export default useLogin;

 function handleInputError(email, password){
    if(!email || !password){
        toast.error('All fields are required')
        return false;
    } 
    return true;
}