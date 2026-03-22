import {useState} from 'react'
import toast from 'react-hot-toast'
import { useMutation } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api" || 'http://localhost:3000/api';

const useGetAnalytics = () => {
    const [loading, setLoading] = useState(false);

    const mutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`${BASE_URL}/stats`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await res.json();
            if(!res.ok || !data){
                throw new Error(data.message)
            }
            return data[0];
        }
    });

    const getAnalytics = async() => {
        setLoading(true)
        try {
            const data = await mutation.mutateAsync();
            return data;
        } catch (error) {
            toast.error(error.message);
        }
        finally{
            setLoading(false)
        }
    }
    return {loading, getAnalytics}
}

export default useGetAnalytics;