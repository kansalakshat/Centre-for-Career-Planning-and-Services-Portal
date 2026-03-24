import toast from 'react-hot-toast';
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuthContext } from '../../context/AuthContext';
import { useMutation } from "@tanstack/react-query";

const useVerifyEmail = () => {
    const [loading, setLoading] = useState(false);
    const { backendUrl, setShowVerifyEmail } = useAppContext();
    const { tempUserId, setAuthUser } = useAuthContext();

    const verifyMutation = useMutation({
        mutationFn: async ({ verificationCode }) => {
            const res = await fetch(`${backendUrl}/api/auth/verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: tempUserId, code: verificationCode })
            })
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        }
    });

    const resendMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`${backendUrl}/api/auth/send-code-again`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: tempUserId })
            })
            const data = await res.json();
            console.log(data);
            if (!res.ok) throw new Error(data.message);
            return data;
        }
    });

    const verifyEmail = async (verificationCode) => {
        const success = handleInputError({ verificationCode, tempUserId });
        if (!success) return;

        setLoading(true);
        try {
            const data = await verifyMutation.mutateAsync({ verificationCode });

            localStorage.setItem("ccps-user", JSON.stringify(data.userData))
            localStorage.setItem("ccps-token", data.token)
            setAuthUser(data)

            toast.success("Account verified successfully!");
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
            setShowVerifyEmail(false);
        }
    };

    const sendCodeAgain = async () => {
        const success = handleInputError1({ tempUserId });
        if (!success) return;

        setLoading(true);
        try {
            await resendMutation.mutateAsync();

            toast.success("Verification email sent successfully!");

        } catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }


    return { loading, verifyEmail, sendCodeAgain };
}

export default useVerifyEmail


function handleInputError({ verificationCode, tempUserId }) {
    if (!verificationCode || !tempUserId) {
        toast.error('All fields are required');
        return false;
    }
    return true;
}

function handleInputError1({ tempUserId }) {
    if (!tempUserId) {
        toast.error('Missing Details');
        return false;
    }
    return true;
}