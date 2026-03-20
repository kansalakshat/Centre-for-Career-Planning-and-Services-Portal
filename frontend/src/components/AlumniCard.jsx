
import { useRef, useState, useEffect } from "react";

import { MdEmail, MdSchool, MdBadge, MdWork } from "react-icons/md";
import { FaLinkedin, FaUser } from "react-icons/fa6";
import { RiPhoneFill } from "react-icons/ri";
import { useMenuClose } from "../utils/closeMenuEffect";
import useConnect from "../api/alumni/useConnect";
import ConnectModal from "./ConnectModal";
import { useNavigate } from "react-router-dom";

function AlumniCard({ alum, index, authUser,requests, onEditAlumni, onDeleteAlumni,setRequests }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { connect, loading } = useConnect();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeclinedMsg, setShowDeclinedMsg] = useState(true);
  const [showAcceptedMsg, setShowAcceptedMsg] = useState(true);

  const navigate = useNavigate();

  const existingRequest = requests?.find(
    (r) => String(r.alumniId?._id || r.alumniId) === String(alum._id)
  );

  useEffect(() => {
    let timer;
    if (existingRequest?.status === "declined") {
      setShowDeclinedMsg(true);
      timer = setTimeout(() => setShowDeclinedMsg(false), 5000);
    } else if (existingRequest?.status === "accepted") {
      setShowAcceptedMsg(true);
      timer = setTimeout(() => setShowAcceptedMsg(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [existingRequest?.status, existingRequest?.attempts]);

  const handleContextMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEditAlumni = (id) => {
    onEditAlumni(id);
    setIsMenuOpen(false);
  };

  const handleDeleteAlumni = (id) => {
    onDeleteAlumni(id);
    setIsMenuOpen(false);
  };

  useMenuClose(menuRef, () => {
    setIsMenuOpen(false);
  });

  return (
    <div
      key={alum._id}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-md transition dark:text-gray-200"
    >
      <div className="grid grid-cols-2">
        <div className="col-start-1 col-end-3 flex items-center gap-2">
          <div className="w-[45px] h-[45px] rounded-[50%] border dark:border-gray-600 flex items-center justify-center overflow-hidden">
            <FaUser size={28} color="#14B8A6" />
          </div>
          <h3 className="text-xl font-semibold text-[#13665b] dark:text-teal-400 relative bottom-1">{alum.name}</h3>
        </div>
        {authUser?.role == "admin" && (
          <div className="col-span-2 col-end-7" ref={menuRef}>
            <div className="relative">
              <div className="flex flex-col space-y-1" role="button" onClick={() => handleContextMenuToggle()} tabIndex={index}>
                <span className="block w-1 h-1 bg-gray-600 dark:bg-gray-400 rounded-full"></span>
                <span className="block w-1 h-1 bg-gray-600 dark:bg-gray-400 rounded-full"></span>
                <span className="block w-1 h-1 bg-gray-600 dark:bg-gray-400 rounded-full"></span>
              </div>
              {isMenuOpen && (
                <ul tabIndex={index} className="absolute right-0 z-10 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                  <li><button onClick={handleEditAlumni} className="block w-full px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-hidden">Edit</button></li>
                  <li><button onClick={handleDeleteAlumni} className="block w-full px-4 py-2 text-center text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-hidden">Delete</button></li>
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <MdEmail size={20} color="#14B8A6" className="relative top-[1.2px]" />
        <p>{alum.Email || "N/A"}</p>
      </div>
      <div className="flex items-center gap-2">
        <RiPhoneFill size={20} color="#14B8A6" className="relative top-[1.2px]" />
        <p>Mobile: {alum.MobileNumber || "N/A"}</p>
      </div>
      <div className="flex items-center gap-2">
        <MdWork size={20} color="#14B8A6" className="relative top-[1.2px]" />
        <p>Company: {alum.company || "N/A"}</p>
      </div>
      <div className="flex items-center gap-2">
        <MdSchool size={20} color="#14B8A6" className="relative top-[1.2px]" />
        <p>Batch: {alum.batch || "N/A"}</p>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <MdBadge size={20} color="#14B8A6" className="relative top-[1.2px]" />
        <p>Institute ID: {alum.InstituteId || "N/A"}</p>
      </div>


      {alum.linkedin && (
        <a href={alum.linkedin} target="_blank" rel="noopener noreferrer" className="text-teal-600  hover:underline">
          <div className="flex items-center justify-center h-8 gap-[9px] text-[white] rounded-md bg-[linear-gradient(135deg,#1466C2,#4F9AE3)]">
            <FaLinkedin color="white" />
            <p>View LinkedIn Profile</p>
          </div>
        </a>
      )}
      {/* Connect Button for Students */}
      {authUser?.role === "student" && (
        <div className="mt-4">
          {existingRequest ? (
            existingRequest.status === "accepted" ? (
              <div className="flex flex-col gap-2">
                {showAcceptedMsg && (
                  <p className="text-green-600 text-xs text-center font-medium bg-green-50 p-2 rounded-lg border border-green-100 transition-opacity duration-500">
                    Your request was accepted!
                  </p>
                )}
                <button
                  onClick={() => navigate(`/chat/${alum._id}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
                >
                  Chat
                </button>
              </div>
            ) : existingRequest.status === "pending" ? (
              <button
                disabled
                className="bg-gray-400 text-white px-4 py-2 rounded-lg w-full"
              >
                Request Sent
              </button>
            ) : existingRequest.status === "declined" && (existingRequest.attempts || 1) < 3 ? (
              <div className="flex flex-col gap-2">
                {showDeclinedMsg && (
                  <p className="text-red-600 text-xs text-center font-medium bg-red-50 p-2 rounded-lg border border-red-100 transition-opacity duration-500">
                    Your previous request was declined.
                  </p>
                )}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition w-full"
                >
                  Retry Request ({3 - (existingRequest.attempts || 1)} left)
                </button>
              </div>
            ) : (
              <button
                disabled
                className="bg-red-400 text-white px-4 py-2 rounded-lg w-full"
              >
                Declined
              </button>
            )
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#13665b] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition w-full"
            >
              Connect
            </button>
          )}
        </div>
      )}
      <ConnectModal
        isOpen={isModalOpen}
        loading={loading}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async ({ purpose, message }) => {
          const success = await connect(alum._id, purpose, message);
          if (success) {
            setRequests((prev) => {
              const filtered = prev.filter(
                (r) => String(r.alumniId?._id || r.alumniId) !== String(alum._id)
              );
              return [
                ...filtered,
                {
                  alumniId: { _id: alum._id },
                  status: "pending"
                }
              ];
            });
            setIsModalOpen(false);
          }
        }}
      />
    </div>
  );
}

export default AlumniCard;
