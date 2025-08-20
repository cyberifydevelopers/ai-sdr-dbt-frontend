import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function IsUserRoute({ children }) {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) {
      toast.error("Authentication required. Please log in.");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login", { replace: true });
      return;
    }

    if (role === "user") {
      setAuthorized(true);
    } else if (role === "admin") {
      toast.error("You are not authorized to access this page.");
      navigate("/admin", { replace: true });
    } else {
      toast.error("Unknown user role. Please log in again.");
      localStorage.clear();
      navigate("/login", { replace: true });
    }

    setChecking(false);
  }, [navigate]);

  if (checking) return <div>Loading...</div>; // Optional UX improvement

  return authorized ? children : null;
}
