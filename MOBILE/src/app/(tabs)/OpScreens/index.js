import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Semana from '../../../components/Semana';
import Header from '../../../components/Header';
import TaskCard from '../../../components/TaskCard';

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

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
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const tasksArr = await response.json();
        setTasks(tasksArr);
      }
    } catch (e) {
      console.error("Erro ao buscar tarefas:", e);
    }
  };

  if (!user) {
    return (
      <ScrollView>
        <Header />
        <View style={styles.container}>
          <Text>Carregando perfil...</Text>
        </View>
      </ScrollView>
    );
  }

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
                  key={task.id || task._id}
                  name={task.name}
                  category={task.category}
                  time={task.time}
                  date={task.date}
                  completed={task.completed}
                />
              ))
            )
          ) : (
            <Text style={{ color: "#888", textAlign: "center" }}>
              Selecione um dia da semana para ver as tarefas.
            </Text>
          )}
        </View>

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
  footer: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  borda: {
    marginLeft: '-20px',
    width: 130,
    height: 130
  },
  foto: {
    marginTop: 580
  },
  button: {
    margin: 15
  }
});
