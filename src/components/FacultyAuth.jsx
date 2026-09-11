import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function FacultyAuth({ children }) {

  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {

    const token =
      localStorage.getItem("authToken");

    const role =
      localStorage.getItem("authRole");


    // =====================================================
    // CHECK TOKEN + ROLE
    // =====================================================

    if (!token || role !== "FACULTY") {

      setChecking(false);
      return;

    }


    // =====================================================
    // VERIFY TOKEN WITH BACKEND
    // =====================================================

    const verifyToken = async () => {

      try {

        const response = await fetch(
          "https://sigma-classes-backend-ajkh.onrender.com/api/faculty/profile",
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        if (response.ok) {

          setAuthenticated(true);

        } else {

          clearFacultyAuth();

        }

      } catch (error) {

        console.error(
          "Faculty authentication check failed:",
          error
        );

        clearFacultyAuth();

      } finally {

        setChecking(false);

      }

    };


    verifyToken();

  }, []);


  // =====================================================
  // CLEAR AUTH
  // =====================================================

  const clearFacultyAuth = () => {

    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    localStorage.removeItem("authIdentifier");

    localStorage.removeItem("facultyToken");
    localStorage.removeItem("facultyUsername");
    localStorage.removeItem("facultyName");

  };


  // =====================================================
  // CHECKING
  // =====================================================

  if (checking) {

    return (
      <div className="admin-auth-loading">
        Checking authentication...
      </div>
    );

  }


  // =====================================================
  // NOT AUTHENTICATED
  // =====================================================

  if (!authenticated) {

    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );

  }


  return children;

}

export default FacultyAuth;