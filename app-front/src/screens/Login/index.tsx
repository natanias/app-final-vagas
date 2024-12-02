import React, { useState, useContext } from 'react';
import { Alert, Image } from 'react-native';
import { Wrapper, Container, Form, TextContainer, TextBlack, TextLink, TextLinkContainer } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext'; // Certifique-se de que o contexto está configurado

import api from '../../services/api';
import BGTop from '../../assets/BGTop.png';
import Logo from '../../components/Logo';
import Input from '../../components/Input';
import { Button } from '../../components/Button';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext); // Usa o contexto de autenticação

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Campos obrigatórios', 'Preencha o e-mail e a senha para continuar.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/usuarios/login', { email, senha });
      const { token } = response.data;

      // Salvar o token no AsyncStorage e atualizar o contexto
      await AsyncStorage.setItem('userToken', token);
      login(token); // Atualiza o estado de autenticação no contexto

      // Redirecionar para o Auth (Home)
      navigation.replace('Auth');
    } catch (error) {
      console.error('Erro ao fazer login:', error.response?.data || error.message);
      Alert.alert('Erro', 'Credenciais inválidas ou erro no servidor.');
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
