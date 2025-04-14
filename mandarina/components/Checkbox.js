import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../styles/colors";
import { useTheme } from "../context/ThemeContext";

function Checkbox({ labelTxt, checked, onToggle }) {
    const { theme } = useTheme();
    const styles = getStyles(theme, "light");

    return (
        <TouchableOpacity style={styles.checkboxContainer} onPress={onToggle}>
            <View style={styles.checkbox}>
                <View
                    style={[
                        styles.check,
                        checked ? styles.checked : styles.notChecked,
                    ]}></View>
            </View>
            <Text style={styles.labelTxt}>{labelTxt}</Text>
        </TouchableOpacity>
    );
}

const getStyles = (theme, palette) =>
    StyleSheet.create({
        checkbox: {
            width: 15,
            height: 15,
            borderWidth: 1,
            borderColor: colors[theme].checkboxBdr,
            borderRadius: 50,
            marginRight: 5,
            marginBlock: 10,
            padding: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        checkboxContainer: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginInline: 20,
        },
        notChecked: {
            display: "none",
        },
        checked: {
            backgroundColor: colors[palette].primary,
        },
        check: {
            width: 10,
            height: 10,
            borderRadius: 50,
        },
        labelTxt: {
            color: colors[theme].text,
        },
    });

export default Checkbox;
