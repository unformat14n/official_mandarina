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
            return <View style={styles.calendarHdr}>{hdrs}</View>;
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
                        <Text
                            style={
                                isToday ? styles.weekdayToday : styles.weekday
                            }>
                            {date.getDate()}
                        </Text>
                    </View>
                );
            }
            return <View style={styles.calendarHdr}>{hdrs}</View>;
        } else {
            const date = new Date(curDate);
            return (
                <View style={styles.calendarHdr}>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            marginLeft: 15,
                            color: colors[theme].fg,
                        }}>
                        {date.toLocaleDateString("default", {
                            weekday: "long",
                        })}
                    </Text>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            color: colors[theme].bg,
                            backgroundColor: colors[theme].secondary,
                            padding: 5,
                            paddingInline: 8,
                            marginInline: 10,
                            borderRadius: 999,
                        }}>
                        {date.getDate()}
                    </Text>
                </View>
            );
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
        ).getDay(); // Sunday = 0, Monday = 1...

        const totalSlots = firstDayOfMonth + daysInMonth;
        const weeks = [];
        let currentWeek = [];

        for (let i = 0; i < totalSlots; i++) {
            if (i < firstDayOfMonth) {
                currentWeek.push(
                    <View style={styles.day} key={`empty-${i}`} />
                );
            } else {
                const day = i - firstDayOfMonth + 1;
                const isToday =
                    day === new Date().getDate() &&
                    curDate.getMonth() === new Date().getMonth() &&
                    curDate.getFullYear() === new Date().getFullYear();

                currentWeek.push(
                    <View
                        style={isToday ? styles.today : styles.day}
                        key={`day-${day}`}>
                        <Text style={isToday ? styles.todayTxt : styles.dayTxt}>
                            {day}
                        </Text>
                    </View>
                );
            }

            if (currentWeek.length === 7 || i === totalSlots - 1) {
                weeks.push(
                    <View
                        key={`week-${weeks.length}`}
                        style={[styles.weekRow, { width: screenWidth }]}>
                        {currentWeek}
                    </View>
                );
                currentWeek = [];
            }
        }

        return <View style={styles.calendarContainer}>{weeks}</View>;
    };

    const renderWeek = () => {
        const date = new Date(curDate);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const diff = date.getDate() - dayOfWeek; // Adjust to get to Sunday
        const container = [];

        for (let hour = 0; hour < 24; hour++) {
            let row = [];
            const formattedHour =
                hour === 0
                    ? "12:00 AM"
                    : hour < 12
                    ? `${hour}:00 AM`
                    : hour === 12
                    ? "12:00 PM"
                    : `${hour - 12}:00 PM`;
            for (let i = 0; i < 7; i++) {
                date.setDate(diff + i);
                row.push(
                    <View
                        style={styles.weekdayhour}
                        key={`day${date.getDate()}-${hour}`}></View>
                );
            }

            container.push(
                <View style={styles.weekdayContainer} key={`week${hour}`}>
                    <Text style={styles.hourTxt}>{formattedHour}</Text>
                    <View style={styles.weekhourContainer}>{row}</View>
                </View>
            );
        }

        return <View style={styles.calendarContainer}>{container}</View>;
    };

    const renderDay = () => {
        const date = new Date(curDate);
        const container = [];
        for (let hour = 0; hour < 24; hour++) {
            const formattedHour =
                hour === 0
                    ? "12:00 AM"
                    : hour < 12
                    ? `${hour}:00 AM`
                    : hour === 12
                    ? "12:00 PM"
                    : `${hour - 12}:00 PM`;
            container.push(
                <View style={styles.weekdayContainer} key={`week${hour}`}>
                    <Text style={styles.hourTxt}>{formattedHour}</Text>
                    <View style={styles.dayContainer}></View>
                </View>
            );
        }

        return <View style={styles.calendarContainer}>{container}</View>;
    };

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
            <ScrollView style={styles.calendar}>
                {view == "month" && renderMonth()}
                {view == "week" && renderWeek()}
                {view == "day" && renderDay()}
            </ScrollView>
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
            height: screenHeight * 0.81,
            width: screenWidth,
        },
        calendarHdr: {
            flexDirection: "row",
            alignItems: "center",
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
            flexDirection: "column",
            width: screenWidth,
            backgroundColor: colors[theme].bg,
        },
        weekRow: {
            flexDirection: "row",
            width: screenWidth,
            height: rowHeight,
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

        weekdayContainer: {
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: screenWidth,
            backgroundColor: colors[theme].bg,
            marginBlock: 5,
        },
        weekdayhour: {
            maxWidth: daySize,
            width: daySize,
            minHeight: 50,
            justifyContent: "flex-start",
            backgroundColor: colors[theme].bg,
        },
        weekhourContainer: {
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: screenWidth,
            backgroundColor: colors[theme].bg,
            borderBottomWidth: 1,
            borderBottomColor: colors[theme].border,
        },
        hourTxt: {
            fontSize: 16,
            textAlign: "center",
            marginLeft: 10,
            color: colors[theme].fgOpaque,
        },

        dayContainer: {
            flexDirection: "row",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            minHeight: 25,
            alignItems: "flex-start",
            width: screenWidth,
            backgroundColor: colors[theme].bg,
            borderBottomWidth: 1,
            borderBottomColor: colors[theme].border,
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
