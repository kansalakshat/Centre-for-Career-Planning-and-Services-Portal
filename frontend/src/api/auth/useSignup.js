import { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { useMutation } from "@tanstack/react-query";

const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const { setTempUserId } = useAuthContext();
    const { backendUrl, setShowVerifyEmail } = useAppContext();

    const mutation = useMutation({
        mutationFn: async ({ body }) => {
            const res = await fetch(`${backendUrl}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        }
    });

    const signup = async ({ name, email, password, confirmPassword, role, instituteId, mobileNumber, batch, company, linkedin }) => {
        const success = handleInputError({ name, email, password, confirmPassword, role, instituteId, mobileNumber, batch });
        if (!success) return;
        setLoading(true);
        try {
            const body = { name, email, password, role };
            if (role === 'alumni') {
                body.instituteId = instituteId;
                body.mobileNumber = mobileNumber;
                body.batch = Number(batch);
                body.company = company;
                body.linkedin = linkedin;
            }
            const data = await mutation.mutateAsync({ body });
            //   localStorage.setItem('ccps-user',JSON.stringify(data));
            //   setAuthUser(data);
            // not setting authUser here because user is not verified yet
            setTempUserId(data.userId);
            setShowVerifyEmail(true);
            toast.success("Verification email sent successfully!");
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    };
    return { loading, signup };
}

function handleInputError({ name, email, password, confirmPassword, role, instituteId, mobileNumber, batch }) {
    if (!name || !email || !password || !confirmPassword || !role) {
        toast.error('All fields are required');
        return false;
    }
    if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return false;
    }
    if (role === 'alumni') {
        if (!instituteId || !mobileNumber || !batch) {
            toast.error('Institute ID, Mobile Number, and Batch are required for alumni signup');
            return false;
        }
    }
    return true;
}


export default useSignup