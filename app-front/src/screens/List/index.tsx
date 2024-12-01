import { useState, useEffect } from 'react';
import { FlatList, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { Wrapper, Container, ListContainer, TextVagas } from './styles';
import BGTop from '../../assets/BGTop.png';
import Logo from '../../components/Logo';
import VagaCard from '../../components/VagaCard';

export default function List({ navigation }) {
  const [vagas, setVagas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar as vagas da API
  const fetchVagas = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

      const response = await api.get('/vagas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVagas(response.data.jobs);
    } catch (error) {
      console.error('Erro ao buscar vagas:', error.message || error);
      setError('Erro ao carregar as vagas. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVagas();
  }, []);

  const handleNavigateToDetails = (id) => {
    navigation.navigate('Details', { id });
  };

  return (
    <Wrapper>
      <Image source={BGTop} style={{ maxHeight: 86 }} />

      <Container>
        <Logo />
        {isLoading ? (
          <TextVagas>Carregando vagas...</TextVagas>
        ) : error ? (
          <TextVagas>{error}</TextVagas>
        ) : (
          <TextVagas>{vagas.length} vagas encontradas!</TextVagas>
        )}

        <ListContainer>
          {isLoading ? (
            <Text>Carregando...</Text>
          ) : (
            <FlatList
              data={vagas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleNavigateToDetails(item.id)}>
                  <VagaCard
                    id={item.id}
                    title={item.titulo}
                    dataCreated={item.dataCadastro}
                    company={item.empresa}
                  />
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View>
                  <Text>Não há vagas disponíveis no momento.</Text>
                </View>
              )}
            />
          )}
        </ListContainer>
      </Container>
    </Wrapper>
  );
}
