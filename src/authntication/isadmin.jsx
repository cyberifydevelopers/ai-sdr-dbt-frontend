import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function IsAdminRoute({ children }) {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || !role) {
        toast.error("Authentication required. Please log in.");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login", { replace: true });
        return;
      }

      if (role === "admin") {
        setAuthorized(true);
      } else if (role === "user") {
        toast.error("You are not authorized to access this page.");
        navigate("/user", { replace: true });
      } else {
        toast.error("Unknown user role. Please log in again.");
        localStorage.clear();
        navigate("/login", { replace: true });
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please log in again.");
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return authorized ? children : null;
}
