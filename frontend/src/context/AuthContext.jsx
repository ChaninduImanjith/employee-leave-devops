import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  login,
} from "../services/authService";

const AuthContext = createContext(null);

const TOKEN_KEY = "leaveflow_access_token";

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    () => sessionStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const currentUser =
          await getCurrentUser(accessToken);

        setUser(currentUser);
      } catch {
        sessionStorage.removeItem(TOKEN_KEY);
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, [accessToken]);

  async function loginUser(email, password) {
    const response = await login(email, password);

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
    };

    setUser(authenticatedUser);

    return authenticatedUser;
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setAccessToken(null);
    setUser(null);
  }

  const value = {
    user,
    accessToken,
    loading,
    isAuthenticated: Boolean(
      user && accessToken
    ),
    loginUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
