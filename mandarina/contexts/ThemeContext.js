// src/context/ThemeContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");
    const [palette, setPalette] = useState("mandarina");

    // Load saved theme preference
    useEffect(() => {
        const loadThemePreference = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(
                    "theme"
                );
                if (savedTheme !== null) {
                    setTheme(savedTheme);
                } else {
                    // If no preference saved, use system preference
                    const systemColorScheme = Appearance.getColorScheme();
                    setTheme(systemColorScheme);
                }

                // Load saved palette preference
                const savedPalette = await AsyncStorage.getItem("palette");
                if (savedPalette !== null) {
                    setPalette(savedPalette);
                }
            } catch (error) {
                console.error("Error loading theme preference:", error);
            }
        };

        loadThemePreference();
    }, []);

    // Toggle between dark and light theme
    const toggleTheme = async () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        try {
            await AsyncStorage.setItem(
                "theme",
                theme
            );
        } catch (error) {
            console.error("Error saving theme preference:", error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, palette, setPalette }}>
            {children}
        </ThemeContext.Provider>
    );
};
