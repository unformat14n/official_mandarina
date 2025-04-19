import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../styles/colors";
import { useTheme } from "../contexts/ThemeContext";

function Task({ id, title, status, priority, date, hour }) {
    let priorityStyle =
        priority === "High" ? "highp" : priority === "Medium" ? "medp" : "lowp";
    const { theme, palette } = useTheme();
    const styles = getStyles(priorityStyle, theme, palette);

    return (
        <View style={styles.taskContainer}>
            <Text style={[styles.taskTitle, styles.txt]}>{title}</Text>
            <Text style={[styles.txt]}>
                {new Date(date).toISOString().split("T")[0]}
            </Text>
            <Text style={[styles.taskHour, styles.txt]}>{hour}</Text>
        </View>
    );
}

function TaskListItem({
    id,
    title,
    description,
    status,
    priority,
    date,
    hour,
}) {
    let priorityStyle =
        priority === "High" ? "highp" : priority === "Medium" ? "medp" : "lowp";
    const { theme, palette } = useTheme(); // Get the current theme and palette from the context
    const styles = getStyles(priorityStyle, theme, palette);

    return (
        <View style={styles.taskListItem}>
            <Text style={styles.listHdr}>{title}</Text>
            <Text style={styles.listTxt}>{description}</Text>
            <Text style={styles.listTxt}>
                {new Date(date).toISOString().split("T")[0]}
            </Text>
            <Text style={styles.listTxt}>{hour}</Text>
            <Text style={styles.taskListStatus}>{status}</Text>
            <Text style={styles.taskListPriority}>{priority}</Text>
        </View>
    );
}

const getStyles = (priority, theme, palette) =>
    StyleSheet.create({
        taskContainer: {
            backgroundColor: colors[`${priority}Bg`],
            borderColor: colors[priority],
            borderWidth: 2,
            borderRadius: 5,
            padding: 2,
            marginBlock: 10,
            with: "auto",
        },
        txt: {
            color: colors[priority],
            fontSize: 11,
        },
        taskTitle: {
            fontWeight: "bold",
        },
        taskListItem: {
            flexDirection: "column",
            borderBottomWidth: 1,
            borderBottomColor: colors[theme].secondaryTxt,
            paddingBottom: 5,
            marginBlock: 5,
        },
        listHdr: {
            color: colors[palette].primary,
            fontWeight: "bold",
            fontSize: 24,
        },
        taskListStatus: {
            fontWeight: "bold",
            fontSize: 12,
            color: colors[palette].secondary,
        },
        taskListPriority: {
            fontWeight: "bold",
            fontSize: 12,
            color: colors[priority],
        },
        listTxt: {
            fontSize: 12,
            color: colors[theme].text,
        },
    });

export { TaskListItem };
export default Task;
