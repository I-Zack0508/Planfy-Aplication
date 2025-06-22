import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Semana = ({ onDateChange }) => {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const today = new Date();
  const todayIndex = today.getDay();

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const newDate = new Date();
    newDate.setDate(today.getDate() - todayIndex + i);
    return {
      label: days[i],
      date: newDate.toISOString().slice(0, 10),
      dayNumber: newDate.getDate(),
    };
  });

  const [selectedIndex, setSelectedIndex] = useState(todayIndex);

  useEffect(() => {
    if (onDateChange) {
      onDateChange(weekDates[selectedIndex].date);
    }
  }, [selectedIndex]);

  return (
    <View style={[styles.container, styles.shadowBox]}>
      <Text style={styles.title}>Hoje</Text>
      <View style={styles.row}>
        {weekDates.map((item, index) => {
          const isToday = index === todayIndex;
          const isSelected = index === selectedIndex;
          return (
            <TouchableOpacity
              key={index}
              style={styles.dayWrapper}
              onPress={() => setSelectedIndex(index)}
            >
              <Text
                style={[
                  styles.dayLabel,
                  (isToday || isSelected) && styles.dayLabelToday,
                ]}
              >
                {item.label}
              </Text>
              <View
                style={[
                  styles.dayCircle,
                  (isToday || isSelected) && styles.dayCircleToday,
                ]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    (isToday || isSelected) && styles.dayNumberToday,
                  ]}
                >
                  {item.dayNumber}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#CBD5E1",
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  shadowBox: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: "600",
    marginBottom: 15,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayWrapper: {
    alignItems: "center",
    width: 40,
  },
  dayLabel: {
    fontSize: 15,
    color: "#9E9E9E",
    marginBottom: 10,
  },
  dayLabelToday: {
    color: "#000000",
    fontWeight: "bold",
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#B1C1D2",
    justifyContent: "center",
    alignItems: "center",
  },
  dayCircleToday: {
    backgroundColor: "#718EAD",
    borderWidth: 2,
    borderColor: "#718EAD",
  },
  dayNumber: {
    fontSize: 15,
    color: "#3D3D3D",
  },
  dayNumberToday: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default Semana;
