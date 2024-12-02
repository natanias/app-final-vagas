import React, { useState, useEffect } from 'react';
import { Linking, Text, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Wrapper,
  Container,
  Header,
  HeaderButtonContainer,
  ButtonIcon,
  ButtonText,
  ContentContainer,
  Title,
  Description,
  TitleError,
} from './styles';

import api from '../../services/api';
import Logo from '../../components/Logo';
import theme from '../../theme';
import { Button } from '../../components/Button';

export default function Details({ route, navigation }) {
  const { id } = route.params;
  const [vaga, setVaga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchVaga = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await api.get(`/vagas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.job; // Certifique-se de que a chave está correta no retorno da API
      if (data) {
        setVaga(data);
      } else {
        setError('Vaga não encontrada!');
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da vaga:', error);
      setError('Erro ao carregar a vaga.');
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsapp = (vagaTitle, telefone) => {
    const url = `whatsapp://send?text=Olá! Gostaria de mais informações sobre a vaga: ${vagaTitle}&phone=${telefone}`;

    Linking.openURL(url).catch(() => {
      alert('Certifique-se de que o WhatsApp está instalado no dispositivo');
    });
  };

  useEffect(() => {
    fetchVaga();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  if (error) {
    return <TitleError>{error}</TitleError>;
  }

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
          <Title>{vaga.titulo}</Title>
          <Description>{vaga.descricao}</Description>
          <Description>
            <Text style={{ fontWeight: 'bold' }}>Empresa:</Text> {vaga.empresa}
          </Description>
          <Description>
            <Text style={{ fontWeight: 'bold' }}>Data de Cadastro:</Text>{' '}
            {new Date(vaga.dataCadastro).toLocaleDateString()}
          </Description>
          <Description>
            <Text style={{ fontWeight: 'bold' }}>Status:</Text> {vaga.status}
          </Description>
        </ContentContainer>

        {vaga.status === 'aberta' && (
          <Button
            title="Entrar em contato"
            noSpacing={true}
            variant="primary"
            onPress={() => sendWhatsapp(vaga.titulo, vaga.telefone)}
          />
        )}
      </Container>
    </Wrapper>
  );
}
