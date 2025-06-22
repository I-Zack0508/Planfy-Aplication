import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from "../../../components/Header";
import User from "../../../components/User";
import InfoPerfil from "../../../components/InfoPerfil";
import DesempenhoCard from '../../../components/DesempenhoCard';
import { ScrollView } from "react-native-gesture-handler";


export default function PerfilScreen() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            const userData = await AsyncStorage.getItem('user');
            if (userData && userData !== "undefined") {
                setUser(JSON.parse(userData));
            }
        }
        fetchUser();
    }, []);

    if (!user) {
        return (
            <View style={styles.container}>
                <Header />
                <Text>Carregando perfil...</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <Header profilePic={user.profilePic} />
            <View style={styles.container}>
                
                <User profilePic={user.profilePic} />

                <View style={styles.statsContainer}>
                    <View style={styles.perfil}>
                        <InfoPerfil />
                    </View>
                    <DesempenhoCard />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
    },
    perfil: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center', // centraliza eixo Y
        alignItems: 'center',     // centraliza eixo X
    },
})