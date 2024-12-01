import React, { useState, useEffect, useContext } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import {
  Wrapper,
  Container,
  Header,
  HeaderButtonContainer,
  ButtonIcon,
  ButtonText,
  ContentContainer,
} from './styles';
import { Feather } from '@expo/vector-icons';
import theme from '../../theme';
import Input from '../../components/Input';
import { Button } from '../../components/Button';
import Logo from '../../components/Logo';
import { AuthContext } from '../../context/AuthContext';
import { getUserData, updateUserData } from '../../services/userService';

export default function Profile({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState({ nome: '', email: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Função para buscar dados do usuário
  const fetchUserData = async () => {
    try {
      const userData = await getUserData();
      setUser({ ...userData, senha: '' }); // Não carregamos a senha
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
    } finally {
      setIsFetching(false);
    }
  };

  // Função para salvar os dados atualizados
  const handleSave = async () => {
    if (!user.nome || !user.email) {
      Alert.alert('Campos obrigatórios', 'Preencha o nome e o e-mail para salvar.');
      return;
    }

    setLoading(true);

    try {
      await updateUserData({
        nome: user.nome,
        email: user.email,
        senha: user.senha || undefined,
      });
      Alert.alert('Sucesso', 'Suas informações foram atualizadas.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar suas informações.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (isFetching) {
    return (
      <Wrapper>
        <ActivityIndicator size="large" color={theme.COLORS.GREEN} style={{ marginTop: 20 }} />
      </Wrapper>
    );
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
          <Input
            label="Nome"
            placeholder="Digite seu nome"
            value={user.nome}
            onChangeText={(value) => setUser({ ...user, nome: value })}
          />
          <Input
            label="E-mail"
            placeholder="Digite seu e-mail"
            value={user.email}
            onChangeText={(value) => setUser({ ...user, email: value })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Senha"
            placeholder="Digite sua senha (opcional)"
            value={user.senha}
            onChangeText={(value) => setUser({ ...user, senha: value })}
            secureTextEntry
          />
        </ContentContainer>

        <Button
          title={loading ? 'Salvando...' : 'Salvar informações'}
          noSpacing
          variant="primary"
          onPress={handleSave}
          disabled={loading}
        />

        <Button
          title="Sair"
          noSpacing
          variant="secondary"
          onPress={handleLogout}
          style={{ marginTop: 16 }}
        />
      </Container>
    </Wrapper>
  );
}
