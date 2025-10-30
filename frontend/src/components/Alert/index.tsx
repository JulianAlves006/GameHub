import type { ComponentProps } from 'react';
import { Card } from '../../style';
import { FaExclamationTriangle } from 'react-icons/fa';

interface AlertBody extends ComponentProps<'section'> {
  text: string;
}

export const Alert = ({ text, ...props }: AlertBody) => {
  return (
    <Card style={{ display: 'flex', alignItems: 'center' }} {...props}>
      <FaExclamationTriangle
        size={'25px'}
        color='yellow'
        style={{ marginRight: '10px' }}
      />
      <p>{text}</p>
    </Card>
  );
};
