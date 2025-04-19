// src/components/ThemeToggle.js
import React from "react";
import { Switch, View, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import colors from "../styles/colors";

const ThemeToggle = () => {
    const { theme, toggleTheme, palette } = useTheme();

    return (
        <View
            style={[styles.container, { backgroundColor: colors[theme].border }]}>
            <Text style={{ color: colors[theme].fg }}>Dark Mode</Text>
            <Switch
                value={theme === "dark"}
                onValueChange={toggleTheme}
                thumbColor={colors[palette].primary}
                trackColor={{ false: "#767577", true: colors[palette].primary }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderRadius: 8,
        margin: 16,
    },
});

export default ThemeToggle;
