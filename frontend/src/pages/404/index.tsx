import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrapper,
  Content,
  Big404,
  Subtitle,
  Paragraph,
  Actions,
  HomeButton,
  OutlineLink,
  Sparkles,
  Divider,
} from './styled';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Sparkles aria-hidden />
      <Content role='main' aria-labelledby='nf-title'>
        <Big404 id='nf-title' aria-label='Erro 404'>
          404
        </Big404>
        <Subtitle>Ops, página não encontrada</Subtitle>
        <Paragraph>
          A URL que você tentou acessar não existe ou foi movida. Verifique o
          endereço ou volte para a página inicial.
        </Paragraph>

        <Divider role='presentation' />

        <Actions>
          <HomeButton onClick={() => navigate('/home')}>
            Voltar para o início
          </HomeButton>

          <OutlineLink
            href='mailto:suporte@seudominio.com'
            aria-label='Falar com o suporte por email'
          >
            Falar com o suporte
          </OutlineLink>
        </Actions>
      </Content>
    </Wrapper>
  );
};

export default NotFoundPage;
