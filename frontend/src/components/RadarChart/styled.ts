import styled from 'styled-components';
import { cardsColor } from '../../config/colors';

export const RadarChartContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 30px auto;
  padding: 40px;
  background: ${cardsColor};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ChartWrapper = styled.div`
  width: 90%;
  max-width: 700px;
  height: 600px;
  margin: 0 auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;
