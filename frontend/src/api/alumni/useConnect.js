import { useState } from "react";
import { sendConnectionRequest } from "../../services/ConnectService";
import { useMutation } from "@tanstack/react-query";

const useConnect = () => {
  const [loading, setLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({ alumniId, purpose, message }) => {
      return await sendConnectionRequest(alumniId, purpose, message);
    },
  });

  const connect = async (alumniId, purpose, message) => {
    try {
      setLoading(true);
      await mutation.mutateAsync({ alumniId, purpose, message });
      return true; // ✅ success
    } catch (error) {
      alert(error.message);
      return false; // ❌ failure
    } finally {
      setLoading(false);
    }
  };

  return { connect, loading };
};

export default useConnect;