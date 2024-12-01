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
  TitleError
} from '../Details/styles';

import api from '../../services/api';
import { VagaProps } from '../../utils/Types';

import Logo from '../../components/Logo';
import theme from '../../theme';
import { Button } from '../../components/Button';

export default function Details({ route, navigation }) {
  const [id, setId] = useState(route.params.id);
  const [vaga, setVaga] = useState<VagaProps | null>(null);
  const [loading, setLoading] = useState(true); // Adiciona estado de carregamento
  const [error, setError] = useState(''); // Estado para capturar erro

  const fetchVaga = async () => {
    try {
      // Recupera o token JWT armazenado
      const token = await AsyncStorage.getItem('userToken');

      // Faz a requisição com o token no cabeçalho
      const response = await api.get(`/vagas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('API Response:', response.data); // Verifique o conteúdo da resposta

      const data = response.data.job; // Verifique se os dados estão na chave `job`
      
      if (data) {
        setVaga({
          status: data.status,
          id: data.id,
          title: data.titulo,
          description: data.descricao,
          date: new Date(data.dataCadastro).toLocaleDateString(), // Formata a data
          phone: data.telefone,
          company: data.empresa,
        });
      } else {
        setError('Vaga não encontrada!');
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da vaga:', error);
      setError('Erro ao carregar a vaga.');
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  const sendWhatsapp = (vagaTitle, telefone) => {
    const url =
      'whatsapp://send?text=' +
      `Olá! Gostaria de ter mais informações sobre a vaga: ${vagaTitle}` +
      `&phone=${telefone}`;

    Linking.openURL(url)
      .then(() => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        alert('Certifique-se de que o WhatsApp está instalado no dispositivo');
      });
  };

  useEffect(() => {
    fetchVaga();
  }, [id]);

  if (loading) {
    return <TitleError>Carregando...</TitleError>; // Exibe um carregando enquanto os dados estão sendo recuperados
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
