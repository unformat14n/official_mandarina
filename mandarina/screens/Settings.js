import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";
import Checkbox from "../components/Checkbox";
import colors from "../styles/colors";

const Settings = () => {
    const { theme, palette, setPalette } = useTheme();
    const styles = getStyles(theme, palette); // Get the styles based on the current theme

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <View>
                    <Text style={styles.title}>Settings</Text>
                    <View style={styles.configContainer}>
                        <Text style={styles.settingHdr}>Appearance</Text>
                        <ThemeToggle />
                        <Text style={styles.subHdr}>Color Palette</Text>
                        <View style={styles.optContainer}>
                            <Checkbox
                                labelTxt={"Mandarina"}
                                checked={palette == "mandarina"}
                                onToggle={() =>
                                    palette !== "mandarina" &&
                                    setPalette("mandarina")
                                }
                            />
                            <Checkbox
                                labelTxt={"Peach Dreams"}
                                checked={palette == "peach"}
                                onToggle={() =>
                                    theme !== "peach" && setPalette("peach")
                                }
                            />
                            <Checkbox
                                labelTxt={"Coffee Espresso"}
                                checked={palette == "coffee"}
                                onToggle={() =>
                                    palette !== "coffee" && setPalette("coffee")
                                }
                            />
                            <Checkbox
                                labelTxt={"Olive Yards"}
                                checked={palette == "olive"}
                                onToggle={() =>
                                    palette !== "olive" && setPalette("olive")
                                }
                            />
                            <Checkbox
                                labelTxt={"Blueberry Sparks"}
                                checked={palette == "blueberry"}
                                onToggle={() =>
                                    palette !== "blueberry" &&
                                    setPalette("blueberry")
                                }
                            />
                            <Checkbox
                                labelTxt={"Grape Fusion"}
                                checked={palette == "grape"}
                                onToggle={() =>
                                    palette !== "grape" &&
                                    setPalette("grape")
                                }
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const getStyles = (theme, palette) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors[theme].bg,
            padding: 20,
            color: colors[theme].fg,
        },
        title: {
            fontSize: 64,
            fontWeight: "bold",
            marginBottom: 20,
            color: colors[palette].primary,
        },
        scrollContainer: { height: "100%" },
        configContainer: {
            padding: 10,
            flexDirection: "column",
            backgroundColor: colors[theme].secondaryBg,
            borderRadius: 10,
        },
        optContainer: {
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            margin: 5,
            flexWrap: "wrap",
        },
        settingHdr: {
            fontSize: 24,
            fontWeight: "bold",
            color: colors[palette].secondary,
        },
        subHdr: {
            color: colors[theme].fg,
            fontSize: 20,
            fontWeight: "bold",
        },
    });
export default Settings;
