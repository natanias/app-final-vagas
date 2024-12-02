import React, { useContext } from 'react';
import { Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
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
import { AuthContext } from '../../context/AuthContext'; // Certifique-se de que o AuthContext está configurado corretamente

export default function Profile({ navigation }) {
  const { logout } = useContext(AuthContext); // Usa o AuthContext para acessar a função de logout

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Você tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          onPress: () => {
            logout(); // Chama a função de logout do AuthContext
            navigation.replace('Login'); // Redireciona para a tela de login
          },
        },
      ],
      { cancelable: true }
    );
  };

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
          <Input label="Nome" placeholder="Digite seu nome" />
          <Input label="E-mail" placeholder="Digite seu e-mail" />
          <Input label="Senha" placeholder="Digite sua senha" secureTextEntry />
        </ContentContainer>

        <Button
          title="Salvar informações"
          noSpacing={true}
          variant="primary"
        />

        <Button
          title="Sair"
          noSpacing={true}
          variant="secondary"
          onPress={handleLogout}
          style={{ marginTop: 16 }}
        />
      </Container>
    </Wrapper>
  );
}
