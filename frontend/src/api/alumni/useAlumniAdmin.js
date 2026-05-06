import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL =
  (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") +
  "/api/alumni";

const useAlumniAdmin = () => {
  const queryClient = useQueryClient();

  // Fetch all alumni
  const fetchAllAlumni = async () => {
    const res = await fetch(BASE_URL);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch alumni");
    }

    return data;
  };

  const { data: alumni = [], isLoading } = useQuery({
    queryKey: ["alumni"],
    queryFn: fetchAllAlumni,
    onError: (error) => {
      toast.error(error.message || "Error loading alumni");
    },
  });

  // Add alumni
  const addMutation = useMutation({
    mutationFn: async ({ formData, token }) => {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add alumni");
      return data;
    },
    onSuccess: () => {
      toast.success("Alumni added successfully!");
      queryClient.invalidateQueries(["alumni"]);
    },
    onError: (error) => {
      toast.error(error.message || "Error adding alumni");
    },
  });

  const addAlumni = (formData, token) =>
    addMutation.mutateAsync({ formData, token });

  // Delete alumni
  const deleteMutation = useMutation({
    mutationFn: async ({ id, token }) => {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete alumni");
      return data;
    },
    onSuccess: () => {
      toast.success("Alumni deleted successfully!");
      queryClient.invalidateQueries(["alumni"]);
    },
    onError: (error) => {
      toast.error(error.message || "Error deleting alumni");
    },
  });

  const deleteAlumni = (id, token) =>
    deleteMutation.mutateAsync({ id, token });

  // Update alumni
  const updateMutation = useMutation({
    mutationFn: async ({ id, updatedData, token }) => {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update alumni");
      return data;
    },
    onSuccess: () => {
      toast.success("Alumni updated successfully!");
      queryClient.invalidateQueries(["alumni"]);
    },
    onError: (error) => {
      toast.error(error.message || "Error updating alumni");
    },
  });

  const updateAlumni = (id, updatedData, token) =>
    updateMutation.mutateAsync({ id, updatedData, token });

  return {
    alumni,
    loading: isLoading,
    addAlumni,
    deleteAlumni,
    updateAlumni,
  };
};

export default useAlumniAdmin;