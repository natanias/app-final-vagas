import { Image, Alert } from 'react-native';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Wrapper, Container, Form, TextContainer, TextBlack, TextLink, TextLinkContainer } from './styles';
import api from '../../services/api';

import BGTop from '../../assets/BGTop.png';
import Logo from '../../components/Logo';
import Input from '../../components/Input';
import { Button } from '../../components/Button';

export default function Login({ navigation }) {
  const { login } = useContext(AuthContext); // Contexto de autenticação
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Campos obrigatórios', 'Preencha o e-mail e a senha para continuar.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('usuarios/login', { email, senha });
      const { token } = response.data;

      if (token) {
        await login(token); // Salva o token no contexto e AsyncStorage
        navigation.replace('Auth'); // Navega para as rotas protegidas
      } else {
        Alert.alert('Erro', 'Token não recebido. Verifique a API.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error.response?.data || error.message);
      Alert.alert('Erro ao fazer login', 'Verifique suas credenciais ou tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Image source={BGTop} />

      <Container>
        <Form>
          <Logo />
          <Input
            label="E-mail"
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Senha"
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
          <Button
            title={loading ? 'Entrando...' : 'Entrar'}
            noSpacing
            variant="primary"
            onPress={handleLogin}
            disabled={loading}
          />
          <TextContainer>
            <TextBlack>Não tem uma conta?</TextBlack>
            <TextLinkContainer onPress={() => navigation.navigate('FormScreen')}>
              <TextLink>Crie agora mesmo.</TextLink>
            </TextLinkContainer>
          </TextContainer>
        </Form>
      </Container>
    </Wrapper>
  );
}
