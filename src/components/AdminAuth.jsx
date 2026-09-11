import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function AdminAuth({ children }) {

  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {

    const token =
      localStorage.getItem("adminToken");

    if (!token) {
      setChecking(false);
      return;
    }

    const verifyToken = async () => {

      try {

        const response = await fetch(
          "http://localhost:8080/api/enquiries",
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        if (
          response.ok
        ) {
          setAuthenticated(true);
        } else {

          localStorage.removeItem(
            "adminToken"
          );

          localStorage.removeItem(
            "adminUsername"
          );

          setAuthenticated(false);
        }

      } catch (error) {

        console.error(
          "Authentication check failed:",
          error
        );

        setAuthenticated(false);

      } finally {

        setChecking(false);
      }
    };

    verifyToken();

  }, []);


  if (checking) {

    return (
      <div className="admin-auth-loading">
        Checking authentication...
      </div>
    );
  }


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

export default AdminAuth;