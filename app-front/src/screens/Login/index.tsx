import { Image } from 'react-native';
import {useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Wrapper,Container, Form, TextContainer, TextBlack, TextLink, TextLinkContainer } from './styles';
import api from '../../services/api';

import BGTop from '../../assets/BGTop.png';
import Logo from '../../components/Logo';
import Input from '../../components/Input';
import { Button } from '../../components/Button';


export default function Login({ navigation }) {


    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');


    const handleLogin = async () => {
      try {
          const response = await api.post('usuarios/login', {
              email, // Email inserido no campo de login
              senha, // Senha inserida no campo de login
          });
  
          const { token } = response.data; // Obtém o token JWT do servidor
          console.log('Login successful:', token);
  
          // Salve o token em um local seguro (AsyncStorage, SecureStore, etc.)
          // Aqui está um exemplo com AsyncStorage
          await AsyncStorage.setItem('userToken', token);
  
          // Navegue para a próxima tela ou faça outras ações necessárias
          navigation.navigate('Auth', { screen: 'Home' });
      } catch (error) {
          console.error('Login failed:', error.response?.data || error.message);
          console.log('Login failed:', 'Email ou senha inválidos ou erro no servidor');
      }
  };
  
    return (
        <Wrapper>
            <Image source={BGTop} />

            <Container>

                <Form>
                    <Logo />
                    <Input label='E-mail' placeholder='digite seu e-mail' value={email}
        onChangeText={setEmail}/>
                    <Input label='Senha' placeholder='digite sua senha' value={senha}
        onChangeText={setSenha}/>
                    <Button 
                    title="Entrar" 
                    noSpacing={true} 
                    variant='primary'
                    onPress={handleLogin}
                    />
                    <TextContainer>
                        <TextBlack>Não tem uma conta?</TextBlack>
                        <TextLinkContainer onPress={() => navigation.navigate('FormScreen')}>
                            <TextLink>
                                    Crie agora mesmo.
                            </TextLink>
                        </TextLinkContainer>
                    </TextContainer>
                </Form>

            </Container>
        </Wrapper>
    );
}
