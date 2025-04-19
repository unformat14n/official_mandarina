// UserContext.js
import { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create context
const UserContext = createContext();
export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from AsyncStorage on initial render
    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("@user");
                if (storedUser) {
                    setUserId(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Failed to load user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    // Whenever user changes, update AsyncStorage
    useEffect(() => {
        const saveUser = async () => {
            try {
                if (userId) {
                    await AsyncStorage.setItem("@user", JSON.stringify(userId));
                } else {
                    await AsyncStorage.removeItem("@user");
                }
            } catch (error) {
                console.error("Failed to save user:", error);
            }
        };

        saveUser();
    }, [userId]);

    // Optional: Clear all user data (for logout)
    const clearUser = async () => {
        try {
            await AsyncStorage.removeItem("@user");
            setUserId(null);
        } catch (error) {
            console.error("Failed to clear user:", error);
        }
    };

    return (
        <UserContext.Provider
            value={{ userId, setUserId, isLoading, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
