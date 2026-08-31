"use client";

import { createContext, useContext, useState, useCallback } from "react";

const NavbarContext = createContext();

export function NavbarProvider({ children }) {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const hideNavbar = useCallback(() => {
    setIsNavbarVisible(false);
  }, []);

  const showNavbar = useCallback(() => {
    setIsNavbarVisible(true);
  }, []);

  return (
    <NavbarContext.Provider value={{ isNavbarVisible, hideNavbar, showNavbar }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbar must be used within NavbarProvider");
  }
  return context;
}
