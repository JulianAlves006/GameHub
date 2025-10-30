import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as colors from '../../config/colors';

export const Nav = styled.nav`
  background: ${colors.cardsColor};
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 12px 16px;
    flex-wrap: wrap;
    gap: 12px;
  }
`;

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  .icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  .logo {
    height: 32px;
    object-fit: contain;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  @media (max-width: 768px) {
    .logo {
      height: 28px;
    }
    .icon {
      width: 32px;
      height: 32px;
    }
  }
`;

export const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;

  @media (max-width: 768px) {
    order: 3;
    width: 100%;
    justify-content: space-around;
    margin-top: 8px;
  }
`;

export const NavLink = styled(Link)`
  color: ${colors.primaryText};
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;

  &:hover {
    background: rgba(108, 99, 255, 0.1);
    color: ${colors.secondaryColor};
  }

  &.active {
    background: rgba(108, 99, 255, 0.2);
    color: ${colors.secondaryColor};
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 13px;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;

  @media (max-width: 768px) {
    margin-left: 0;
    order: 2;
  }
`;

export const TeamLogo = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid ${colors.secondaryColor};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.05);
    border-color: ${colors.primaryColor};
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;

export const UserLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${colors.primaryText};
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background: rgba(108, 99, 255, 0.1);
    color: ${colors.secondaryColor};
  }

  h3 {
    margin: 0;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  @media (max-width: 768px) {
    padding: 6px 8px;

    h3 {
      font-size: 13px;
    }
  }
`;
