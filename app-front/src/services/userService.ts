import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

import jwtDecode from 'jwt-decode';

// Tipo do payload do token JWT
type JwtPayload = {
  id: number;
  email: string;
};

// Função para buscar dados do usuário autenticado
export const getUserData = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('Token não encontrado.');
    }

    // Decodifica o payload do token JWT
    const decoded: JwtPayloadType = jwtDecode(token);

    // Faz a requisição para buscar os dados do usuário
    const response = await api.get(`/usuarios/${decoded.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.user;
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    throw error;
  }
};

// Função para atualizar dados do usuário autenticado
export const updateUserData = async (userId: number, data: { nome: string; email: string; senha?: string }) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('Token não encontrado.');
    }

    const response = await api.put(`/usuarios/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.user;
  } catch (error) {
    console.error('Erro ao atualizar dados do usuário:', error);
    throw error;
  }
};
