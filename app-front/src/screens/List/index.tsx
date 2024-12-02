import { useState, useEffect } from 'react';
import { FlatList, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api'; // Certifique-se de que seu serviço axios esteja configurado
import { Wrapper, Container, ListContainer, TextVagas } from './styles'; // Ajuste os imports de estilos conforme necessário
import BGTop from '../../assets/BGTop.png'; // Ajuste o caminho
import Logo from '../../components/Logo'; // Ajuste o caminho
import VagaCard from '../../components/VagaCard'; // Ajuste o caminho

export default function List({ navigation }) {
  const [vagas, setVagas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVagas = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await api.get('/vagas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVagas(response.data.jobs); // Verifique se o backend retorna as vagas na chave `jobs`
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
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
        <TextVagas>{vagas.length} vagas encontradas!</TextVagas>
        <ListContainer>
          {isLoading ? (
            <ActivityIndicator size="large" color="#00ff00" />
          ) : (
            <FlatList
              data={vagas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleNavigateToDetails(item.id)}>
                  <VagaCard
                    id={item.id}
                    title={item.titulo}
                    company={item.empresa}
                    dataCreated={item.dataCadastro}
                  />
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={true}
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
