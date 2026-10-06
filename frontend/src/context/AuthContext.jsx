import {
  useEffect,
  useState,
} from "react";

import AuthContext from "./authContext";

import {
  changePassword as changePasswordRequest,
  getCurrentUser,
  login as loginRequest,
} from "../services/authService";

const TOKEN_KEY = "leaveflow_access_token";

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    () => sessionStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(
    () => Boolean(
      sessionStorage.getItem(TOKEN_KEY)
    )
  );

  useEffect(() => {
    if (!accessToken) {
      return undefined;
    }

    let cancelled = false;

    async function restoreSession() {
      try {
        const currentUser =
          await getCurrentUser(accessToken);

        if (!cancelled) {
          setUser(currentUser);
        }
      } catch {
        if (!cancelled) {
          sessionStorage.removeItem(TOKEN_KEY);
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  async function loginUser(email, password) {
    const response =
      await loginRequest(email, password);

    sessionStorage.setItem(
      TOKEN_KEY,
      response.accessToken
    );

    setAccessToken(response.accessToken);

    const authenticatedUser = {
      id: response.id,
      fullName: response.fullName,
      email: response.email,
      employeeId: response.employeeId,
      department: response.department,
      role: response.role,
      mustChangePassword:
        response.mustChangePassword,
    };

    setUser(authenticatedUser);
    setLoading(false);

    return authenticatedUser;
  }

  async function changePasswordUser(
    currentPassword,
    newPassword
  ) {
    if (!accessToken) {
      throw new Error(
        "Authentication is required"
      );
    }

    const updatedUser =
      await changePasswordRequest(
        accessToken,
        currentPassword,
        newPassword
      );

    setUser(updatedUser);

    return updatedUser;
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setAccessToken(null);
    setUser(null);
    setLoading(false);
  }

  const value = {
    user,
    accessToken,
    loading,
    isAuthenticated: Boolean(
      user && accessToken
    ),
    loginUser,
    changePasswordUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
