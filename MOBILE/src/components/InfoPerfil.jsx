import React, { useState, useEffect } from "react";
import { router } from 'expo-router';
import { Modal, StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InfoPerfil() {
    const [user, setUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedField, setSelectedField] = useState("");
    const [fieldValue, setFieldValue] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            const userData = await AsyncStorage.getItem('user');
            if (userData && userData !== "undefined") {
                setUser(JSON.parse(userData));
            }
        }
        fetchUser();
    }, []);

    const handleEdit = (field, value) => {
        setSelectedField(field);
        setFieldValue(value);
        setModalVisible(true);
    };

    const handleSave = () => {
        console.log(`Campo ${selectedField} atualizado para: ${fieldValue}`);
        setModalVisible(false);
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setLogoutConfirmVisible(false);
        router.replace('/'); // Redireciona para a tela de login
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Carregando informações do perfil...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <View style={styles.item}>
                    <Text style={styles.text}>
                        <Text style={styles.bold}>Nome:</Text> {user.nome || user.name}
                    </Text>
                    <TouchableOpacity onPress={() => handleEdit("Nome", user.nome || user.name)}>
                        <Text style={styles.edit}>Editar</Text>
                    </TouchableOpacity>
                </View>

       

                <View style={styles.item}>
                    <Text style={styles.text}>
                        <Text style={styles.bold}>Email:</Text> {user.email}
                    </Text>
                    <TouchableOpacity onPress={() => handleEdit("Email", user.email)}>
                        <Text style={styles.edit}>Editar</Text>
                    </TouchableOpacity>
                </View>
            </View>

                     <View style={styles.item}>
                    <Text style={styles.text}>
                        <Text style={styles.bold}>Senha:</Text> ********
                    </Text>
                    <TouchableOpacity onPress={() => handleEdit("Senha", "")}>
                        <Text style={styles.edit}>Editar</Text>
                    </TouchableOpacity>
                </View>

            <TouchableOpacity style={styles.exit} onPress={() => setLogoutConfirmVisible(true)}>
                <Text style={[styles.textExit, styles.bold]}>Sair da Conta</Text>
            </TouchableOpacity>

            {/* Modal para edição */}
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={[styles.modalValue, styles.bold]}>Alterar {selectedField}</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder={
                                selectedField === "Senha"
                                    ? "Digite a nova senha"
                                    : `Digite o novo ${selectedField.toLowerCase()}`
                            }
                            onChangeText={setFieldValue}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Digite sua senha atual"
                            secureTextEntry={true}
                            onChangeText={setCurrentPassword}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={handleSave}
                            >
                                <Text style={styles.modalButtonText}>Salvar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de confirmação de Logout */}
            <Modal
                transparent={true}
                visible={logoutConfirmVisible}
                animationType="fade"
                onRequestClose={() => setLogoutConfirmVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Deseja mesmo sair da conta?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={handleLogout} // <-- Chama o logout aqui
                            >
                                <Text style={styles.modalButtonText}>Sim</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setLogoutConfirmVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20, // Adicionado espaçamento interno no container
        alignItems: 'flex-start',
        width: '85%',
        borderRadius: 10,
        boxShadow: '1px 2px 6px #999999',
        backgroundColor: '#ffffff',
        gap: 10,
    },
    info: {
        gap: 20, // Espaçamento entre os itens
    },
    item: {
        width: '100%',
    },
    text: {
        fontSize: 16,
        marginBottom: 5, // Espaçamento entre o texto e o botão "Editar"
    },
    bold: {
        fontWeight: 'bold', // Indicações em negrito
    },
    edit: {
        color: '#6381A8',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'left', // Alinha o botão "Editar" à esquerda
    },
    exit: {
        marginTop: 20,
        alignItems: 'center',
    },
    textExit: {
        color: '#DC3545',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        gap: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: '#6381A8',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginRight: 5,
    },
    cancelButton: {
        backgroundColor: '#DC3545',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginLeft: 5,
    },
    uttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    modalValue: {
        fontSize: 16,
        marginBottom: 10,
    },
    modalInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    modalButton: {
        backgroundColor: '#6381A8',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginRight: 5,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});