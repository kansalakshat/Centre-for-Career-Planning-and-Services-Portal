import { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useMutation } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/referrals" || 'http://localhost:3000/api/referrals';

export const useProvideReferral = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { authUser } = useAuthContext();

  const mutation = useMutation({
    mutationFn: async ({ referralId, referralLink }) => {
      const response = await fetch(`${BASE_URL}/provide`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
          referralId,
          referralLink,
          alumniEmail: authUser.email
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to provide referral');
      }

      const data = await response.json();
      return data;
    }
  });

  const provideReferral = async (referralId, referralLink) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const data = await mutation.mutateAsync({ referralId, referralLink });
      return data;
    } catch (error) {
      setError(error.message || 'Error providing referral');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { provideReferral, isSubmitting, error };
};