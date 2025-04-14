import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import Calendar from "./Calendar";
import Tasks from "./Tasks";
import Dashboard from "./Dashboard";
import Settings from "./Settings";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useTheme } from "../contexts/ThemeContext";
import colors from "../styles/colors";

const Tab = createBottomTabNavigator();

const MainScreen = () => {
    const { theme } = useTheme();
    // const styles = getStyles(theme); 

    return (
        <Tab.Navigator
            initialRouteName="Calendar"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case "Calendar":
                            iconName = "calendar-month";
                            break;
                        case "Tasks":
                            iconName = "check-box";
                            break;
                        case "Dashboard":
                            iconName = "dashboard";
                            break;
                        case "Settings":
                            iconName = "settings";
                            break;
                        default:
                            iconName = "ellipse";
                    }

                    return (
                        <MaterialIcons name={iconName} size={size} color={color} />
                    );
                },
                tabBarActiveTintColor: "#f57c00",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors[theme].bg,
                    borderTopColor: colors[theme].border,
                },
            })}>
            <Tab.Screen name="Calendar" component={Calendar} />
            <Tab.Screen name="Tasks" component={Tasks} />
            <Tab.Screen name="Dashboard" component={Dashboard} />
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
    );
};
export default MainScreen;
