import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import {
    Wrapper,
    Container,
    Header,
    HeaderButtonContainer,
    ButtonIcon,
    ButtonText,
    ContentContainer,
} from '../Profile/styles';
import Logo from '../../components/Logo';
import theme from '../../theme';
import Input from '../../components/Input';
import { Button } from '../../components/Button';
import api from '../../services/api';

export default function Profile({ navigation }) {
    const [formData, setFormData] = useState({
        id: '',
        nome: '',
        email: '',
        password: '',
    });

    const fetchUserData = async () => {
        try {
            // Recupera o token JWT armazenado
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
                navigation.navigate('Login'); // Redireciona para login se não houver token
                return;
            }

            const response = await api.get('usuarios/me', {
                headers: { Authorization: `Bearer ${token}` },
            });

            setFormData(response.data);
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
        }
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const [password, setPassword] = useState('');

    const handlePasswordChange = (value) => {
        setPassword(value);
    };

    const handleSave = async () => {
        try {
            // Recupera o token JWT armazenado
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
                navigation.navigate('Login');
                return;
            }

            const updatedData = { ...formData };
            if (password) {
                updatedData.password = password;
            }

            await api.put(`usuarios/${formData.id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar os dados:', error);
            Alert.alert('Erro', 'Não foi possível atualizar os dados.');
        }
    };
    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <Wrapper>
            <Header>
                <HeaderButtonContainer onPress={() => navigation.goBack()}>
                    <ButtonIcon>
                        <Feather size={16} name="chevron-left" color={theme.COLORS.BLUE} />
                    </ButtonIcon>
                    <ButtonText>Voltar</ButtonText>
                </HeaderButtonContainer>
                <Logo />
            </Header>

            <Container>
                <ContentContainer>
                    <Input
                        label="Nome"
                        placeholder="Digite seu nome"
                        value={formData.nome}
                        onChangeText={(text) => handleInputChange('nome', text)}
                    />
                    <Input
                        label="E-mail"
                        placeholder="Digite seu e-mail"
                        value={formData.email}
                        onChangeText={(text) => handleInputChange('email', text)}
                    />
                </ContentContainer>
                <Input
                    label="Senha"
                    placeholder="Digite sua senha"
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry
                />
                <Button title="Salvar informações" noSpacing={true} variant="primary" onPress={handleSave} />
            </Container>
        </Wrapper>
    );
}
