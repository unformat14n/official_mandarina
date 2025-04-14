import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Modal,
    Alert,
    TextInput,
} from "react-native";
import colors from "../styles/colors";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const daySize = screenWidth / 7;
const rowHeight = (screenHeight * 0.9) / 5;

const Calendar = () => {
    const [curDate, setCurDate] = useState(new Date());
    const [view, setView] = useState("month");

    const styles = getStyles("light");

    const getWeekDays = (locale = "en-US") => {
        const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
        const baseDate = new Date(Date.UTC(2021, 5, 7)); // Sunday
        return [...Array(7).keys()].map((i) => {
            const date = new Date(baseDate);
            date.setDate(baseDate.getDate() + i);
            return formatter.format(date);
        });
    };

    const renderHeader = () => {
        const weekDays = getWeekDays();
        if (view === "month") {
            const hdrs = [];
            for (let i = 0; i < 7; i++) {
                hdrs.push(
                    <Text style={styles.weekday} key={`${weekDays[i]}${i}`}>
                        {weekDays[i]}
                    </Text>
                );
            }
            return <View style={styles.monthHdr}>{hdrs}</View>;
        }
    };

    const renderMonth = () => {
        const daysInMonth = new Date(
            curDate.getFullYear(),
            curDate.getMonth() + 1,
            0
        ).getDate();
        const firstDayOfMonth = new Date(
            curDate.getFullYear(),
            curDate.getMonth(),
            1
        ).getDay();
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<View style={styles.day} key={`empty${i}`}></View>);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(
                <View
                    style={curDate.getDate() == i ? styles.today : styles.day}
                    key={`day${i}`}>
                    <Text
                        style={
                            curDate.getDate() == i
                                ? styles.todayTxt
                                : styles.dayTxt
                        }>
                        {i}
                    </Text>
                </View>
            );
        }
        return <View style={styles.calendarContainer}>{days}</View>;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    {curDate.toLocaleDateString("default", {
                        month: "long",
                        year: "numeric",
                    })}
                </Text>
            </View>
            {renderHeader()}
            <ScrollView style={styles.calendar}>{renderMonth()}</ScrollView>
        </View>
    );
};

const getStyles = (theme) =>
    StyleSheet.create({
        container: {
            marginTop: 50,
            flexDirection: "column",
            backgroundColor: colors[theme].bg,
        },
        header: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            backgroundColor: colors[theme].bg,
        },
        headerText: {
            fontSize: 24,
            fontWeight: "bold",
            color: colors[theme].primary,
        },
        calendar: {
            flexDirection: "column",
            backgroundColor: colors[theme].bg,
            height: screenHeight - 100,
            width: screenWidth,
        },
        monthHdr: {
            flexDirection: "row",
            justifyContent: "space-around",
            width: screenWidth,
            backgroundColor: colors[theme].bg,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            zIndex: 1,
        },
        weekday: {
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
            maxWidth: daySize,
            width: daySize,
        },
        calendarContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            height: "100%",
            width: screenWidth,
            backgroundColor: colors[theme].bg,
        },
        day: {
            maxWidth: daySize,
            width: daySize,
            minHeight: rowHeight,
            height: rowHeight,
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: colors[theme].bg,
        },
        today: {
            maxWidth: daySize,
            width: daySize,
            minHeight: rowHeight,
            height: rowHeight,
            justifyContent: "flex-start",
            alignItems: "center",
            borderWidth: 2,
            borderColor: colors[theme].primary,
            borderRadius: 5,
            backgroundColor: colors[theme].bg,
        },
        todayTxt: {
            fontWeight: "bold",
            textAlign: "center",
            color: colors[theme].bg,
            backgroundColor: colors[theme].primary,
            padding: 5,
            margin: 5,
            borderRadius: 5,
        },
    });

export default Calendar;
