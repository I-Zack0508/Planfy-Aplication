import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Semana = ({ onDateChange }) => {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(new Date().getDay());

  const baseDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + weekOffset * 7);
    return date;
  }, [weekOffset]);

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const newDate = new Date(baseDate);
      const currentDay = baseDate.getDay();
      newDate.setDate(baseDate.getDate() - currentDay + i);
      return {
        label: days[i],
        date: newDate.toISOString().slice(0, 10),
        dayNumber: newDate.getDate(),
        fullDate: newDate,
      };
    });
  }, [baseDate]);

  useEffect(() => {
    if (onDateChange) {
      onDateChange(weekDates[selectedIndex].date);
    }
  }, [selectedIndex, weekDates]);

  const currentMonth = weekDates[0].fullDate.toLocaleString("pt-BR", {
    month: "long",
  });
  const currentYear = weekDates[0].fullDate.getFullYear();

  return (
    <View style={[styles.container, styles.shadowBox]}>
      <View style={styles.header}>
        <Text style={styles.month}>{currentMonth}</Text>
        <Text style={styles.year}>{currentYear}</Text>
      </View>

     <View style={styles.rowWrapper}>
  {/* ← seta anterior */}
  <TouchableOpacity onPress={() => setWeekOffset(weekOffset - 1)}>
    <Text style={styles.navArrow}>←</Text>
  </TouchableOpacity>

  {/* Dias da semana responsivos */}
  <View style={styles.daysRow}>
    {weekDates.map((item, index) => {
      const isToday =
        item.date === new Date().toISOString().slice(0, 10);
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

  {/* → seta próxima */}
  <TouchableOpacity onPress={() => setWeekOffset(weekOffset + 1)}>
    <Text style={styles.navArrow}>→</Text>
  </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  month: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C2C2C",
    textTransform: "capitalize",
  },
  year: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C2C2C",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  navArrow: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 6,
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
  rowWrapper: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},

daysRow: {
  flex: 1,
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
},

});

export default Semana;
