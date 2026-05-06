import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/alumni" || 'http://localhost:3000/api/alumni';

const useGetAllAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllAlumni = async () => {
    const res = await fetch(`${BASE_URL}`);
    const data = await res.json();
    if (!res.ok || data.message) {
      throw new Error(data.message || "Failed to fetch alumni");
    }
    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["alumni"],
    queryFn: fetchAllAlumni,
    onError: (error) => {
      toast.error(error.message || "Error loading alumni");
    },
  });

  useEffect(() => {
    if (data) {
      setAlumni(data);
    }
    setLoading(isLoading);
  }, [data, isLoading]);

  return { alumni, loading };
};

export default useGetAllAlumni;