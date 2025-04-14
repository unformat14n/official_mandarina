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
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "../contexts/ThemeContext";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const daySize = screenWidth / 7;
const rowHeight = (screenHeight * 0.9) / 5;

const Calendar = () => {
    const [curDate, setCurDate] = useState(new Date());
    const [view, setView] = useState("month");
    const { theme } = useTheme();

    const styles = getStyles(theme);

    const navigate = (dir) => {
        switch (view) {
            case "month":
                setCurDate(
                    new Date(
                        curDate.getFullYear(),
                        curDate.getMonth() + 1 * dir
                    )
                );
                break;
            case "week":
                setCurDate(
                    new Date(curDate.getTime() + 7 * 24 * 60 * 60 * 1000 * dir)
                );
                break;
            case "day":
                setCurDate(
                    new Date(curDate.getTime() + 1 * 24 * 60 * 60 * 1000 * dir)
                );
                break;
        }
    };

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
        } else if (view === "week") {
            const hdrs = [];
            const date = new Date(curDate);
            const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
            const diff = date.getDate() - dayOfWeek; // Adjust to get to Sunday
            for (let i = 0; i < 7; i++) {
                date.setDate(diff + i);
                const isToday =
                    date.getDate() == new Date().getDate() &&
                    date.getMonth() == new Date().getMonth() &&
                    date.getFullYear() == new Date().getFullYear();
                hdrs.push(
                    <View key={`${weekDays[i]}${date.getDate()}`}>
                        <Text style={styles.weekday}>{weekDays[i]}</Text>
                        <Text style={isToday ? styles.weekdayToday : styles.weekday}>{date.getDate()}</Text>
                    </View>
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
            const isToday =
                curDate.getDate() == i &&
                curDate.getMonth() == new Date().getMonth() &&
                curDate.getFullYear() == new Date().getFullYear();
            days.push(
                <View
                    style={isToday ? styles.today : styles.day}
                    key={`day${i}`}>
                    <Text style={isToday ? styles.todayTxt : styles.dayTxt}>
                        {i}
                    </Text>
                </View>
            );
        }
        return <View style={styles.calendarContainer}>{days}</View>;
    };

    const renderWeek = () => {
        const days = [];
        const date = new Date(curDate);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const diff = date.getDate() - dayOfWeek; // Adjust to get to Sunday
        const container = [];

        for (let i = 0; i < 7; i++) {
            date.setDate(diff + i);
            let row = [];
            
            for (let hour=0; hour<24; hour++) {
                row.push(
                    <View
                        style={styles.weekdayhour}
                        key={`day${date.getDate()}-${hour}`}>
                        <Text style={styles.dayTxt}>{hour}:00</Text>
                    </View>
                )
            }

            container.push(
                <View style={styles.weekdayContainer} key={`week${i}`}>
                    {row}
                </View>
            );
        }

        return <View style={styles.calendarContainer}>{container}</View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigate(-1)}>
                    <MaterialIcons
                        name="navigate-before"
                        size={32}
                        color={colors[theme].bg}
                    />
                </TouchableOpacity>
                <Text style={styles.headerText}>
                    {curDate.toLocaleDateString("default", {
                        month: "long",
                        year: "numeric",
                    })}
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigate(1)}>
                    <MaterialIcons
                        name="navigate-next"
                        size={32}
                        color={colors[theme].bg}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.header}>
                <TouchableOpacity
                    style={[styles.button, { width: screenWidth / 5 }]}
                    onPress={() => setView("month")}>
                    <Text style={styles.buttonTxt}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setView("day")}>
                    <MaterialIcons
                        name="calendar-view-day"
                        size={24}
                        color={
                            view === "day"
                                ? colors[theme].primary
                                : colors[theme].fg
                        }
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setView("week")}>
                    <MaterialIcons
                        name="calendar-view-week"
                        size={24}
                        color={
                            view === "week"
                                ? colors[theme].primary
                                : colors[theme].fg
                        }
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setView("month")}>
                    <MaterialIcons
                        name="calendar-view-month"
                        size={24}
                        color={
                            view === "month"
                                ? colors[theme].primary
                                : colors[theme].fg
                        }
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { width: screenWidth / 5 }]}
                    onPress={() => setView("month")}>
                    <Text style={styles.buttonTxt}>Add Event</Text>
                </TouchableOpacity>
            </View>
            {renderHeader()}
            <ScrollView style={styles.calendar}>{renderMonth()}</ScrollView>
        </View>
    );
};

const getStyles = (theme) =>
    StyleSheet.create({
        container: {
            marginTop: 20,
            flexDirection: "column",
            backgroundColor: colors[theme].bg,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
            backgroundColor: colors[theme].bg,
        },
        headerText: {
            fontSize: 32,
            fontWeight: "bold",
            color: colors[theme].secondary,
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
            paddingBlock: 5,
        },
        weekday: {
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
            maxWidth: daySize,
            width: daySize,
            color: colors[theme].fg,
        },
        weekdayToday: {
            fontWeight: "bold",
            textAlign: "center",
            maxWidth: daySize,
            width: daySize,
            backgroundColor: colors[theme].primary,
            borderRadius: 5,
            color: colors[theme].bg,
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
        dayTxt: {
            textAlign: "center",
            color: colors[theme].fg,
        },

        button: {
            backgroundColor: colors[theme].primary,
            padding: 5,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            borderRadius: 10,
        },
        buttonTxt: {
            color: colors[theme].bg,
            fontSize: 16,
            fontWeight: "bold",
        },
    });

export default Calendar;
