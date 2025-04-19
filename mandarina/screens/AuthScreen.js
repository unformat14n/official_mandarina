import React, { useState, useEffect } from "react";
import {
    Alert,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { db, loginUser, registerUser } from "../services/database";
import { useUser } from "../contexts/UserContext";
import colors from "../styles/colors";

const AuthScreen = ({ navigation }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { userId, setUserId} = useUser();
    const styles = getStyles("light");


    const handleAuth = async () => {
        if (!username || !password) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        try {
            if (isLogin) {
                const result = await loginUser(username, password);

                if (result) {
                    console.log("User logged in:", result);
                    setUserId(result.id);
                    navigation.navigate("Main");
                } else {
                    Alert.alert("Error", "Invalid credentials");
                }
            } else {
                await registerUser(username, password);

                Alert.alert("Success", "Account created!", [
                    { text: "OK", onPress: () => setIsLogin(true) },
                ]);
            }
        } catch (error) {
            console.error("Auth error:", error);
            if (error.message.includes("UNIQUE constraint failed")) {
                Alert.alert("Error", "Username already exists");
            } else {
                Alert.alert("Error", "Authentication failed");
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleAuth}>
                <Text style={styles.buttonText}>
                    {isLogin ? "Login" : "Register"}
                </Text>
            </TouchableOpacity>
            <Text
                style={styles.toggleText}
                onPress={() => setIsLogin(!isLogin)}>
                {isLogin
                    ? "Need an account? Register"
                    : "Have an account? Login"}
            </Text>
        </View>
    );
};

const getStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            backgroundColor: colors[theme].bg,
        },
        title: {
            fontSize: 32,
            marginBottom: 20,
            textAlign: "center",
            color: colors[theme].primary,
            fontWeight: "bold",
        },
        input: {
            borderColor: colors[theme].border,
            borderWidth: 1,
            marginBottom: 15,
            paddingHorizontal: 10,
            borderRadius: 5,
            width: "100%",
        },
        toggleText: {
            marginTop: 15,
            color: colors[theme].secondary,
            textAlign: "center",
        },
        button: {
            backgroundColor: colors[theme].primary,
            padding: 10,
            width: "auto",
            borderRadius: 5,
            marginTop: 15,
        },
        buttonText: {
            color: colors[theme].bg,
            textAlign: "center",
            fontWeight: "bold",
        },
    });

export default AuthScreen;
