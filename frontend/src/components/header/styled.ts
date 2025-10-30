import styled from 'styled-components';
import { cardsColor, primaryText } from '../../config/colors';

export const Nav = styled.nav`
  background: ${cardsColor};
  padding: 10px;
  display: flex;
  align-items: center;

  .icon {
    cursor: pointer;
    max-width: 80px;
    background: ${cardsColor};
  }

  .logo {
    cursor: pointer;
    max-width: 200px;
    background: ${cardsColor};
  }

  div {
    align-self: center;
  }
`;

export const Links = styled.div`
  display: flex;
  color: ${primaryText};

  h3 {
    margin: 0 10px 0 10px;
  }
`;

export const UserInfo = styled.section`
  display: flex;
  margin-left: auto;
  padding: 10px;

  h3 {
    margin-top: auto;
    margin-right: 15px;
  }

  .userLink {
    display: flex;
  }

  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 8px;
    cursor: pointer;
  }
`;
