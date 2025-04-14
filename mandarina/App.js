import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "./screens/AuthScreen";
import { View, Text } from "react-native";
import { initializeDB } from "./services/database";
import MainScreen from "./screens/MainScreen";
import { ThemeProvider } from "./contexts/ThemeContext";

const Stack = createStackNavigator();

export default function App() {
    useEffect(() => {
        initializeDB();
    }, []);

    return (
        <ThemeProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Auth">
                    <Stack.Screen
                        name="Auth"
                        component={AuthScreen}
                        options={{ title: "Authentication" }}
                    />
                    <Stack.Screen
                        name="Main"
                        component={MainScreen}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    );
}
