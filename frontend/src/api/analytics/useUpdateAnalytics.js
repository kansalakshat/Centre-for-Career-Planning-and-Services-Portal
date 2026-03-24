import {useState} from 'react'
import toast from 'react-hot-toast'
import { useMutation } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api" || 'http://localhost:3000/api';

const useUpdateAnalytics = () => {
    
    const [editLoading, setEditLoading] = useState(false);

    const mutation = useMutation({
        mutationFn: async (data) => {
            const res = await fetch(`${BASE_URL}/stats`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
        }
    });

    const updateAnalytics = async(data) => {
        setEditLoading(true)
        try {
            await mutation.mutateAsync(data);
        }
        catch(error){
            toast.error(error.message);
        }
        finally{
            setEditLoading(false)
        }
    }

    return {editLoading, updateAnalytics}
}

export default useUpdateAnalytics;