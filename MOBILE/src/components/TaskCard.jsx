import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TaskCard = ({ name, category, time, date, completed }) => {
  // Formata data para DD/MM/YYYY
  let dataFormatada = "";
  if (date) {
    const [year, month, day] = date.slice(0, 10).split("-");
    dataFormatada = `${day}/${month}/${year}`;
  }

  return (
    <View style={[styles.card, completed && styles.completedCard]}>
      <View style={styles.cardHorizontal}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.info}>Categoria: {category}</Text>
          <Text style={styles.info}>Horário: {time}</Text>
          <Text style={styles.info}>Data: {dataFormatada}</Text>
          {completed && (
            <Text style={styles.completedLabel}>Concluída</Text>
          )}
        </View>
        {/* Aqui você pode adicionar botões de editar/excluir se quiser */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginVertical: 20,
    borderLeftWidth: 6,
    borderLeftColor: "#adb8c5",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  completedCard: {
    opacity: 0.7,
  },
  cardHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    color: "#2d3e50",
    fontWeight: "bold",
    marginBottom: 2,
  },
  info: {
    fontSize: 15,
    color: "#4f5e6c",
    fontWeight: "600",
    marginBottom: 1,
  },
  completedLabel: {
    color: "green",
    fontWeight: "bold",
    marginTop: 4,
  },
});

export default TaskCard;