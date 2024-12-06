import React, { useState, useEffect } from 'react';
import { Linking, Text } from 'react-native';
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
} from '../Details/styles';

import api from '../../services/api';
import { VagaProps } from '../../utils/Types';

import Logo from '../../components/Logo';
import theme from '../../theme';
import { Button } from '../../components/Button';

export default function Details({ route, navigation }) {
  const [id, setId] = useState(route.params.id);
  const [vaga, setVaga] = useState<VagaProps | null>(null);
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

      const data = response.data.job;

      if (data) {
        setVaga({
          status: data.status,
          id: data.id,
          title: data.titulo,
          description: data.descricao,
          date: new Date(data.dataCadastro).toLocaleDateString(),
          phone: data.telefone,
          company: data.empresa,
        });
      } else {
        setError('Vaga não encontrada.');
      }
    } catch (error) {
      setError('Erro ao carregar os detalhes da vaga.');
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsapp = (vagaTitle, telefone) => {
    const url = `https://wa.me/${telefone}?text=Olá! Gostaria de mais informações sobre a vaga: ${vagaTitle}`;
    Linking.openURL(url).catch(() => {
      alert('Certifique-se de que o WhatsApp está instalado no dispositivo.');
    });
  };

  useEffect(() => {
    fetchVaga();
  }, [id]);

  if (loading) {
    return <TitleError>Carregando...</TitleError>;
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
      {error ? (
        <TitleError>{error}</TitleError>
      ) : (
        vaga && (
          <Container>
            <ContentContainer>
              <Title>{vaga.title}</Title>
              <Description>{vaga.description}</Description>
              <Description>
                <Text style={{ fontWeight: 'bold' }}>Empresa:</Text> {vaga.company}
              </Description>
              <Description>
                <Text style={{ fontWeight: 'bold' }}>Data de Cadastro:</Text> {vaga.date}
              </Description>
              <Description>
                <Text style={{ fontWeight: 'bold' }}>Status:</Text> {vaga.status}
              </Description>
            </ContentContainer>

            {vaga.status === 'Disponível' && (
              <Button
                title="Entrar em contato"
                noSpacing={true}
                variant="primary"
                onPress={() => sendWhatsapp(vaga.title, vaga.phone)}
              />
            )}
          </Container>
        )
      )}
    </Wrapper>
  );
}
