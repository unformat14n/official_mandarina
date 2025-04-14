import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import Calendar from "./Calendar";
import Tasks from "./Tasks";
import Dashboard from "./Dashboard";
import Settings from "./Settings";

import { Ionicons } from "@expo/vector-icons"; // For icons

const Tab = createBottomTabNavigator();

const MainScreen = () => {
    return (
        <Tab.Navigator
            initialRouteName="Calendar"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case "Calendar":
                            iconName = "calendar";
                            break;
                        case "Tasks":
                            iconName = "checkbox";
                            break;
                        case "Dashboard":
                            iconName = "speedometer";
                            break;
                        case "Settings":
                            iconName = "settings";
                            break;
                        default:
                            iconName = "ellipse";
                    }

                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
                tabBarActiveTintColor: "#f57c00",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
            })}>
            <Tab.Screen name="Calendar" component={Calendar} />
            <Tab.Screen name="Tasks" component={Tasks} />
            <Tab.Screen name="Dashboard" component={Dashboard} />
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
    );
};

export default MainScreen;
