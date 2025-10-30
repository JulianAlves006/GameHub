import styled, { createGlobalStyle, keyframes } from 'styled-components';

import * as colors from '../config/colors';

const borderAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export default createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    outline: none;
    box-sizing: border-box;
  }
  body{
    font-family: sans-serif;
    background-color: #121212;
    color: ${colors.primaryText}
  }

  a {
    color: ${colors.primaryText};
    text-decoration: none;
    position: relative;
  }

  .filter {
    color: ${colors.primaryText};
    background: none;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid grey;
    width: 30%;
    margin-bottom: 10px;
    text-align: center;
    font-size: 20px;
  }

  a::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px; /* distância do texto */
    height: 1px;
    background: currentColor; /* usa a cor do texto atual */
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.2s ease;
  }

  a:hover::after,
  a:focus-visible::after {
    transform: scaleX(1);
  }

  a:hover,
  a:focus-visible {
    cursor: pointer;
  }

  /* Configuração personalizada do Toastify */
  .Toastify__toast-container {
    font-family: sans-serif;
  }

  .Toastify__toast {
    background-color: #1E1E1E;
    color: ${colors.primaryText};
    border-radius: 10px;
    border: 1px solid ${colors.secondaryColor};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .Toastify__toast--success {
    background-color: #1E1E1E;
    border-left: 4px solid #4caf50;
  }

  .Toastify__toast--error {
    background-color: #1E1E1E;
    border-left: 4px solid #f44336;
  }

  .Toastify__toast--warning {
    background-color: #1E1E1E;
    border-left: 4px solid #ff9800;
  }

  .Toastify__toast--info {
    background-color: #1E1E1E;
    border-left: 4px solid ${colors.blueLight};
  }

  .Toastify__toast-body {
    color: ${colors.primaryText};
    font-size: 14px;
    font-weight: 500;
  }

  .Toastify__progress-bar {
    background: linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor});
  }

  .Toastify__close-button {
    color: ${colors.primaryText};
    opacity: 0.7;
  }

  .Toastify__close-button:hover {
    opacity: 1;
  }

  .Toastify__toast-icon {
    margin-right: 10px;
  }
`;

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  button {
    color: ${colors.primaryText};
    background: ${colors.cardsColor};
    padding: 10px;
    margin-top: 10px;
    border-radius: 10px;
    border: 1px solid grey;
    min-width: 10%;
    margin-bottom: 10px;
    margin-right: 5px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  button:hover {
    background: ${colors.primaryColor};
  }
`;

export const Form = styled.form`
  position: relative;
  background: ${colors.cardsColor};
  color: ${colors.primaryText};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(720px, 92vw);
  margin: 24px auto;
  border: 1px solid #2a2a33;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);

  h1 {
    font-size: 40px;
    margin: 15px 0 15px 0;
  }

  select {
    color: ${colors.primaryText};
    background: none;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid grey;
    width: 60%;
    margin-bottom: 10px;
    text-align: center;
  }

  input {
    color: ${colors.primaryText};
    background: none;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid grey;
    width: 60%;
    margin: 10px 0 10px 0;
  }

  button {
    color: ${colors.primaryText};
    background: ${colors.primaryColor};
    padding: 10px;
    margin-top: 10px;
    border-radius: 10px;
    border: 1px solid grey;
    width: 50%;
    margin-bottom: 10px;
    cursor: pointer;
  }

  button:hover {
    filter: brightness(130%);
  }

  a {
    color: ${colors.blueLight};
  }

  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(270deg, #6c63ff, #00c2ff, #6c63ff);
    background-size: 600% 600%;
    border-radius: 12px;
    z-index: -1;
    animation: ${borderAnimation} 6s linear infinite;
  }

  label {
    display: flex;
    width: 60%;
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 10px;
    align-self: center;

    input {
      margin-top: 5px;
      width: 100%;
    }
  }
`;

export const Title = styled.h1`
  margin-bottom: 50px;
  margin-top: 20px;
  font-size: 50px;

  input {
    font-size: inherit; /* mantém o mesmo tamanho da fonte do h1 */
    font-weight: inherit; /* mantém o peso da fonte */
    font-family: inherit; /* mantém a mesma fonte */
    color: inherit; /* mantém a cor */
    border: none; /* remove borda padrão do input */
    border-bottom: 2px solid grey; /* começa sem linha */
    background: transparent; /* fundo transparente para parecer texto */
    outline: none; /* remove outline padrão */
    text-align: center; /* centraliza o texto digitado */
    width: auto; /* deixa o input só do tamanho do texto */
    min-width: 50px; /* evita colapsar quando vazio */
  }
`;

export const Card = styled.section`
  width: min(720px, 92vw);
  margin: 24px auto;
  background: linear-gradient(180deg, #1b1b22, #17171d);
  border: 1px solid #2a2a33;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
  color: ${colors.primaryText};
`;

export const Center = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

export const Right = styled.div`
  width: 90%;
  display: flex;
  justify-content: flex-end;
`;

export const Left = styled.div`
  width: 90%;
  display: flex;
  justify-content: flex-start;
`;

export const TableOptionsContainer = styled.div`
  display: flex;
  width: 90%;
  align-items: center;
`;
