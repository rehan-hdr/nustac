import React, { createContext, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface SessionContextProps {
  isUserLoggedIn: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextProps>({
  isUserLoggedIn: false,
  login: async () => {},
  logout: async () => {},
});

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const LOGOUT_TIMEOUT = 10 * 1000; // 10 seconds after login

  const logout = async () => {
    await AsyncStorage.removeItem("userEmail");
    setIsUserLoggedIn(false); // Update state to reflect logout
    router.replace("/(auth)");
  };

  const login = async (email: string) => {
    await AsyncStorage.setItem("userEmail", email);
    setIsUserLoggedIn(true); // Update state to reflect login
  };

  const startLogoutTimer = () => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

    logoutTimerRef.current = setTimeout(() => {
      Alert.alert("Session Expired", "You have been logged out.", [
        { text: "OK", onPress: logout },
      ]);
    }, LOGOUT_TIMEOUT);
  };

  const checkLoginStatus = async () => {
    const userEmail = await AsyncStorage.getItem("userEmail");
    if (userEmail) {
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus(); // Check login status on mount
  }, []);

  useEffect(() => {
    if (isUserLoggedIn) {
      startLogoutTimer(); // Start the timer when the user logs in
    } else {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current); // Clear the timer on logout
    }

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current); // Cleanup on unmount
    };
  }, [isUserLoggedIn]); // Re-run when login status changes

  return (
    <SessionContext.Provider value={{ isUserLoggedIn, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};