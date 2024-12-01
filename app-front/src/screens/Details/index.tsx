import React, {useState, useEffect} from 'react';
import {Linking} from 'react-native';
import { Feather } from '@expo/vector-icons';
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
import {VagaProps} from '../../utils/Types';

import Logo from '../../components/Logo';
import theme from '../../theme';
import { Button } from '../../components/Button';


export default function Details({route, navigation }) {

    const [id, setId] = useState(route.params.id);
    const [vaga, setVaga] = useState<VagaProps>(null);

    const fetchVagas = async () => {
        try {
          const response = await api.get(`/vagas/${id}`);
          const data = response.data;
          setVaga({
            id: data.id,
            title: data.titulo,
            description: data.descricao,
            date: data.dataCadastro,
            phone: data.telefone,
            company: data.empresa,
          });

        } catch (error) {
          console.error(error);
        }
      };

    const sendWhatsapp = (vaga, telefone) => { 
        let url =
      'whatsapp://send?text=' + 
      "olá! gostaria de ter mais informações sobre a vaga" + vaga +
      '&phone=91' + telefone;
    
      Linking.openURL(url)
      .then((data) => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        alert('Make sure Whatsapp installed on your device');
      });
    }
    
    useEffect(() => {
        fetchVagas();
    }, [id]);

    return (
        <Wrapper>
            <Header>
                <HeaderButtonContainer onPress={() => navigation.goBack()}>
                    <ButtonIcon>
                        <Feather size={16} name="chevron-left" color={theme.COLORS.BLUE} />
                    </ButtonIcon>
                    <ButtonText>
                        Voltar
                    </ButtonText>
                </HeaderButtonContainer>
                <Logo />
            </Header>
            {vaga ? ( 
                <Container>
                    <ContentContainer>
                        <Title>{vaga.title}</Title>
                        <Description>{vaga.description}</Description>
                    </ContentContainer>

                    <Button 
                        title="Entrar em contato" 
                        noSpacing={true} 
                        variant='primary'
                        onPress={()=>sendWhatsapp(vaga.title,vaga.phone)}
                    />
                </Container>
            ) :(
                <TitleError>Vaga não encontrada!</TitleError>
            )}
        </Wrapper>
    );
}
