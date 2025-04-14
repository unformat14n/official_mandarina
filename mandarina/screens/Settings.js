import React from "react";
import { View, Text } from "react-native";
import ThemeToggle from "../components/ThemeToggle";

const Settings = () => {
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Settings</Text>
            <ThemeToggle />
        </View>
    );
};

export default Settings;
