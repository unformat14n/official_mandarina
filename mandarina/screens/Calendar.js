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
import { useUser } from "../contexts/UserContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createTask, getTasks } from "../services/database";
import Task from "../components/Task";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const daySize = screenWidth / 7;
const rowHeight = (screenHeight * 0.9) / 5;

const Calendar = () => {
    const [curDate, setCurDate] = useState(new Date());
    const [view, setView] = useState("month");
    const [tasks, setTasks] = useState([]);

    const { theme, palette } = useTheme();
    const styles = getStyles(theme, palette);

    const { userId } = useUser();

    const [modalVisible, setModalVisible] = useState(false);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskDueDate, setTaskDueDate] = useState(new Date());
    const [taskPriority, setTaskPriority] = useState("Medium");
    const [taskHour, setTaskHour] = useState(0);
    const [taskMinute, setTaskMinute] = useState(0);

    const [mode, setMode] = useState("date");
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || taskDueDate;

        if (mode === "time") {
            // Update hour and minute states
            setTaskHour(currentDate.getHours());
            setTaskMinute(currentDate.getMinutes());
        } else {
            // For date changes, update the due date
            setTaskDueDate(currentDate);
            1;
        }
        setShow(false);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode("date");
    };

    const showTimepicker = () => {
        showMode("time");
    };

    const formatTimeForDisplay = (hours, minutes) => {
        const period = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12AM
        return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
    };

    const fetchTasks = async () => {
        try {
            const tasks = await getTasks(userId);
            setTasks(tasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

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

    const setToday = () => {
        setCurDate(new Date());
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

                const tasksForDay = tasks.filter((task) => {
                    const taskDate = new Date(task.date);

                    return (
                        taskDate.getDate() === day &&
                        taskDate.getMonth() === curDate.getMonth() &&
                        taskDate.getFullYear() === curDate.getFullYear()
                    );
                });

                const taskComps = tasksForDay.map((task) => (
                    <Task
                        key={task.id}
                        title={task.title}
                        description={task.description}
                        date={task.date}
                        priority={task.priority}
                    />
                ));

                currentWeek.push(
                    <View
                        style={isToday ? styles.today : styles.day}
                        key={`day-${day}`}>
                        <Text style={isToday ? styles.todayTxt : styles.dayTxt}>
                            {day}
                        </Text>
                        {taskComps}
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

                const tasksForDay = tasks.filter((task) => {
                    const taskDate = new Date(task.date);

                    return (
                        taskDate.getDate() === date.getDate() &&
                        taskDate.getMonth() === curDate.getMonth() &&
                        taskDate.getFullYear() === curDate.getFullYear() &&
                        taskDate.getHours() === hour
                    );
                });

                const taskComps = tasksForDay.map((task) => (
                    <Task
                        key={task.id}
                        title={task.title}
                        description={task.description}
                        date={task.date}
                        priority={task.priority}
                    />
                ));

                row.push(
                    <View
                        style={styles.weekdayhour}
                        key={`day${date.getDate()}-${hour}-${date.getDay()}`}>
                        {taskComps}
                    </View>
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

            const tasksForDay = tasks.filter((task) => {
                const taskDate = new Date(task.date);

                return (
                    taskDate.getDate() === date.getDate() &&
                    taskDate.getMonth() === curDate.getMonth() &&
                    taskDate.getFullYear() === curDate.getFullYear() &&
                    taskDate.getHours() === hour
                );
            });

            const taskComps = tasksForDay.map((task) => (
                <Task
                    key={task.id}
                    title={task.title}
                    description={task.description}
                    date={task.date}
                    priority={task.priority}
                />
            ));

            container.push(
                <View style={styles.weekdayContainer} key={`week${hour}`}>
                    <Text style={styles.hourTxt}>{formattedHour}</Text>
                    <View style={styles.dayContainer}>
                        {taskComps}
                    </View>
                </View>
            );
        }

        return <View style={styles.calendarContainer}>{container}</View>;
    };

    const handleAddTask = async () => {
        if (!taskTitle.trim()) {
            Alert.alert("Error", "Task title is required");
            return;
        }
        try {
            // Combine date and time into a single ISO string
            const dueDate = new Date(
                taskDueDate.getFullYear(),
                taskDueDate.getMonth(),
                taskDueDate.getDate(),
                taskHour,
                taskMinute
            );
            await createTask(
                userId,
                taskTitle,
                taskDescription,
                dueDate.toISOString(),
                taskPriority
            );
            setModalVisible(false);
            setTaskTitle("");
            setTaskDescription("");
            setTaskDueDate(new Date());
            setTaskPriority("Medium");
            setTaskHour(0);
            setTaskMinute(0);
            // Optionally, trigger a refresh of tasks here
            // e.g., fetchTasks();
            // Alert.alert("Success", "Task created!");
        } catch (error) {
            Alert.alert("Error", "Failed to create task");
            console.error(error);
        }
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
                    onPress={setToday}>
                    <Text style={styles.buttonTxt}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setView("day")}>
                    <MaterialIcons
                        name="calendar-view-day"
                        size={24}
                        color={
                            view === "day"
                                ? colors[palette].primary
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
                                ? colors[palette].primary
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
                                ? colors[palette].primary
                                : colors[theme].fg
                        }
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { width: screenWidth / 5 }]}
                    onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonTxt}>Add Event</Text>
                </TouchableOpacity>
            </View>
            {renderHeader()}
            <ScrollView style={styles.calendar}>
                {view == "month" && renderMonth()}
                {view == "week" && renderWeek()}
                {view == "day" && renderDay()}
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalOverlay} />
                    <View style={styles.modalView}>
                        <Text style={styles.modalHeader}>
                            Hang in there, we're creating your task ᕙ(`‿´)ᕗ
                        </Text>

                        <Text style={styles.label}>Title</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Task title"
                            onChangeText={setTaskTitle}
                            value={taskTitle}
                        />

                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.multilineInput]}
                            placeholder="Task description"
                            onChangeText={setTaskDescription}
                            value={taskDescription}
                            multiline
                        />

                        <Text style={styles.label}>Date</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={showDatepicker}>
                            <Text style={styles.datePickerText}>
                                {taskDueDate.toLocaleDateString("default", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.label}>Time</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={showTimepicker}>
                            <Text style={styles.timeDisplay}>
                                {formatTimeForDisplay(taskHour, taskMinute)}
                            </Text>
                        </TouchableOpacity>

                        {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={taskDueDate}
                                mode={mode}
                                is24Hour={false}
                                onChange={onChange}
                            />
                        )}

                        <Text style={styles.label}>Priority</Text>
                        <View style={styles.priorityContainer}>
                            {["Low", "Medium", "High"].map((priority) => (
                                <TouchableOpacity
                                    key={priority}
                                    style={[
                                        styles.priorityButton,
                                        taskPriority === priority &&
                                            styles.selectedPriority,
                                    ]}
                                    onPress={() => setTaskPriority(priority)}>
                                    <Text style={styles.priorityText}>
                                        {priority}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={handleAddTask}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const getStyles = (theme, palette) =>
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
            color: colors[palette].secondary,
        },
        calendar: {
            flexDirection: "column",
            backgroundColor: colors[theme].bg,
            height: screenHeight * 0.82,
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
            backgroundColor: colors[palette].primary,
            borderRadius: 5,
            color: colors[theme].bg,
        },

        calendarContainer: {
            flexDirection: "column",
            width: screenWidth,
            backgroundColor: colors[theme].bg,
            marginBottom: 20,
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
            borderColor: colors[palette].primary,
            borderRadius: 5,
            backgroundColor: colors[theme].bg,
        },
        todayTxt: {
            fontWeight: "bold",
            textAlign: "center",
            color: colors[theme].bg,
            backgroundColor: colors[palette].primary,
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
            backgroundColor: colors[palette].primary,
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

        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        modalOverlay: {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
        },
        modalView: {
            width: "90%",
            backgroundColor: colors[theme].bg,
            borderRadius: 10,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        modalHeader: {
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 15,
            color: colors[palette].secondary,
            textAlign: "center",
        },
        label: {
            marginTop: 10,
            marginBottom: 5,
            color: colors[theme].fg,
        },
        input: {
            borderWidth: 1,
            borderColor: colors[theme].border,
            borderRadius: 5,
            padding: 10,
            marginBottom: 10,
            color: colors[theme].fg,
        },
        multilineInput: {
            minHeight: 80,
            textAlignVertical: "top",
            color: colors[theme].fg,
        },
        timeContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        timeInputContainer: {
            width: "48%",
        },
        timeInput: {
            borderWidth: 1,
            borderColor: colors[theme].border,
            borderRadius: 5,
            padding: 10,
            color: colors[theme].fg,
        },
        priorityContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
        },
        priorityButton: {
            padding: 10,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: colors[theme].border,
            width: "30%",
            alignItems: "center",
        },
        selectedPriority: {
            backgroundColor: colors[palette].primary,
            borderColor: colors[palette].primary,
            color: colors[theme].bg,
        },
        priorityText: {
            color: colors[theme].text,
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        cancelButton: {
            backgroundColor: colors[palette].altPrimary,
        },
        saveButton: {
            backgroundColor: colors[palette].primary,
        },
        buttonText: {
            color: colors[theme].bg,
            fontWeight: "bold",
            fontSize: 16,
            padding: 10,
        },
    });

export default Calendar;
