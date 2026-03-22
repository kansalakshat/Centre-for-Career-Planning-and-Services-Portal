import { useQuery } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api" || 'http://localhost:3000/api';

export const useReferrals = () => {

    const { data } = useQuery({
        queryKey: ['referrals'],
        queryFn: async () => {
            const res = await fetch(`${BASE_URL}/referrals`);
            const data = await res.json();
            return data;
        }
    });

    const referrals = data || [];

    return { referrals };
};