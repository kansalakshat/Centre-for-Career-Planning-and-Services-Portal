import { useState } from "react";
import { sendConnectionRequest } from "../../services/ConnectService";

const useConnect = () => {
  const [loading, setLoading] = useState(false);

  const connect = async (alumniId, purpose, message) => {
    try {
      setLoading(true);
      await sendConnectionRequest(alumniId, purpose, message);
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