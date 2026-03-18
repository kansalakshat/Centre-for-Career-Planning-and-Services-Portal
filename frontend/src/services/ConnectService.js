export const sendConnectionRequest = async (alumniId, purpose, message) => {
  const token = localStorage.getItem("ccps-token");

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/connect/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      alumniId,
      purpose,
      message,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};