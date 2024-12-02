import React, { useState } from 'react';
import { Image, Alert } from 'react-native';
import { Wrapper, Container, Form, TextContainer, TextBlack, TextLink, TextLinkContainer } from './styles';
import BGTop from '../../assets/BGTop.png';
import Logo from '../../components/Logo';
import Input from '../../components/Input';
import { Button } from '../../components/Button';
import api from '../../services/api';

export default function FormScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para registrar o usuário
  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos para continuar.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/usuarios/register', {
        nome,
        email,
        senha,
      });

      Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
      navigation.navigate('Login'); // Redireciona para a tela de login
    } catch (error) {
      console.error('Erro ao registrar:', error.response?.data || error.message);
      Alert.alert('Erro ao registrar', 'Não foi possível registrar o usuário. Tente novamente.');
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
            label="Nome"
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={setNome}
          />
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
            title={loading ? 'Registrando...' : 'Registrar'}
            noSpacing
            variant="primary"
            onPress={handleRegister}
            disabled={loading}
          />
          <TextContainer>
            <TextBlack>Já tem uma conta?</TextBlack>
            <TextLinkContainer onPress={() => navigation.navigate('Login')}>
              <TextLink>Faça seu login.</TextLink>
            </TextLinkContainer>
          </TextContainer>
        </Form>
      </Container>
    </Wrapper>
  );
}
