import { useState, useEffect } from 'react';
import { FlatList, Text, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api'; // Certifique-se de que seu serviço axios esteja configurado
import { Wrapper, Container, ListContainer, TextVagas } from './styles'; // Ajuste os imports de estilos conforme necessário
import BGTop from '../../assets/BGTop.png'; // Ajuste o caminho
import Logo from '../../components/Logo'; // Ajuste o caminho
import VagaCard from '../../components/VagaCard'; // Ajuste o caminho

export default function List() {
  const [vagas, setVagas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        // Recupera o token JWT do armazenamento seguro
        const token = await AsyncStorage.getItem('userToken');

        // Configura os headers com o token
        const response = await api.get('/vagas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Atualiza o estado com as vagas retornadas
        setVagas(response.data.jobs);
      } catch (error) {
        console.error('Erro ao buscar vagas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVagas();
  }, []);

  return (
    <Wrapper>
      <Image source={BGTop} style={{ maxHeight: 86 }} />

      <Container>
        <Logo />
        <TextVagas>{vagas.length} vagas encontradas!</TextVagas>
        <ListContainer>
          {isLoading ? (
            <Text>Carregando...</Text>
          ) : (
            <FlatList
              data={vagas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <VagaCard
                  id={item.id}
                  title={item.titulo}
                  dataCreated={item.dataCadastro}
                  company={item.empresa}
                />
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
