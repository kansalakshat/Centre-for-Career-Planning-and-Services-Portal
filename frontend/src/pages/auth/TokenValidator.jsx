import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const TokenValidator = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkTokenValidity = () => {
            const token = localStorage.getItem("ccps-token");
            const publicPaths = ["/", "/login", "/signup"];

            // If user is on a public page, don't force login redirect
            if (publicPaths.includes(location.pathname)) {
                return;
            }

            if(!token){
                navigate("/login");
                return;
            }

            try{
                const {exp} = jwtDecode(token);
                // if the token is expired then it will navigate to login page
                if(Date.now() >= exp*1000){
                    localStorage.removeItem("ccps-token");
                    navigate("/login");
                }
            }
            catch(err){
                // Invalid token format
                localStorage.removeItem("ccps-token");
                navigate("/login");
            }
        }
        checkTokenValidity();
    }, [location.pathname, navigate]);

    return null;
}

export default TokenValidator;
