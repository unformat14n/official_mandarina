import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "./screens/AuthScreen";
import { initializeDB } from "./services/database";
import MainScreen from "./screens/MainScreen";
import { ThemeProvider } from "./contexts/ThemeContext";
import UserProvider from "./contexts/UserContext";

const Stack = createStackNavigator();

export default function App() {
    useEffect(() => {
        initializeDB();
    }, []);

    return (
        <ThemeProvider>
            <UserProvider>
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
            </UserProvider>
        </ThemeProvider>
    );
}
