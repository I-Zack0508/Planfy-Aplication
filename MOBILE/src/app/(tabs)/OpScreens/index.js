import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Modal, TextInput, Button, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Semana from '../../../components/Semana';
import Header from '../../../components/Header';
import TaskCard from '../../../components/TaskCard';

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTaskData, setEditTaskData] = useState({});

  useEffect(() => {
    const init = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData && userData !== "undefined") {
        setUser(JSON.parse(userData));
      }
      await fetchTasks();
    };
    init();
  }, []);

  const fetchTasks = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/tasks", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setTasks(await response.json());
      }
    } catch (e) {
      console.error("Erro ao buscar tarefas:", e);
    }
  };

  const handleToggleComplete = async (taskId) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}/complete`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) fetchTasks();
    } catch (err) {
      console.error("Erro ao concluir tarefa:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) fetchTasks();
    } catch (err) {
      console.error("Erro ao excluir tarefa:", err);
    }
  };

  const handleEditTask = (task) => {
    setEditTaskData(task);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${editTaskData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editTaskData),
      });
      if (response.ok) {
        setEditModalVisible(false);
        fetchTasks();
      }
    } catch (err) {
      console.error("Erro ao editar tarefa:", err);
    }
  };

  const filteredTasks = tasks
    .filter(t => t.date?.slice(0, 10) === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <ScrollView>
      <Header profilePic={user?.profilePic} />
      <View style={styles.container}>
        <Semana onDateChange={setSelectedDate} />

        <View style={{ marginTop: 20 }}>
          {selectedDate ? (
            filteredTasks.length === 0 ? (
              <Text style={{ color: "#888", textAlign: "center" }}>
                Nenhuma tarefa para este dia.
              </Text>
            ) : (
              filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  {...task}
                  onToggleComplete={() => handleToggleComplete(task.id)}
                  onDelete={() => handleDeleteTask(task.id)}
                  onEdit={() => handleEditTask(task)}
                />
              ))
            )
          ) : (
            <Text style={{ color: "#888", textAlign: "center" }}>
              Selecione um dia da semana para ver as tarefas.
            </Text>
          )}
        </View>

        {/* Modal de Edição */}
        <Modal visible={editModalVisible} animationType="slide">
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Editar Tarefa</Text>
            <TextInput
              style={styles.input}
              value={editTaskData.name}
              onChangeText={(text) => setEditTaskData({ ...editTaskData, name: text })}
              placeholder="Nome"
            />
            <TextInput
              style={styles.input}
              value={editTaskData.time}
              onChangeText={(text) => setEditTaskData({ ...editTaskData, time: text })}
              placeholder="Horário (HH:MM)"
            />
            <TextInput
              style={styles.input}
              value={editTaskData.date?.slice(0, 10)}
              onChangeText={(text) => setEditTaskData({ ...editTaskData, date: text + "T00:00:00" })}
              placeholder="Data (AAAA-MM-DD)"
            />
            <Button title="Salvar" onPress={handleSaveEdit} />
            <Button title="Cancelar" onPress={() => setEditModalVisible(false)} />
          </View>
        </Modal>

        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    width: '100%'
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
  },
});
