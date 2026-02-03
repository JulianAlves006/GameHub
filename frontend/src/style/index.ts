import { createGlobalStyle } from 'styled-components';
import { cn } from '@/lib/utils';
import React from 'react';

// Global styles apenas para o Toastify
export default createGlobalStyle`
  .Toastify__toast-container {
    font-family: sans-serif;
  }

  .Toastify__toast {
    background-color: hsl(var(--card));
    color: hsl(var(--card-foreground));
    border-radius: 0.5rem;
    border: 1px solid hsl(var(--border));
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .Toastify__toast--success {
    border-left: 4px solid #4caf50;
  }

  .Toastify__toast--error {
    border-left: 4px solid #f44336;
  }

  .Toastify__toast--warning {
    border-left: 4px solid #ff9800;
  }

  .Toastify__toast--info {
    border-left: 4px solid hsl(var(--primary));
  }

  .Toastify__toast-body {
    color: hsl(var(--foreground));
    font-size: 14px;
    font-weight: 500;
  }

  .Toastify__progress-bar {
    background: hsl(var(--primary));
  }

  .Toastify__close-button {
    color: hsl(var(--foreground));
    opacity: 0.7;
  }

  .Toastify__close-button:hover {
    opacity: 1;
  }

  .Toastify__toast-icon {
    margin-right: 10px;
  }
`;

// Componentes wrapper usando Tailwind - mantém a mesma API dos styled-components

export const Container = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) =>
  React.createElement('section', {
    ref,
    className: cn(
      'flex flex-col items-center w-full min-h-screen p-4',
      className
    ),
    ...props,
  })
);
Container.displayName = 'Container';

export const Title = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) =>
  React.createElement('h1', {
    ref,
    className: cn('text-4xl font-bold mb-8 mt-4 text-foreground', className),
    ...props,
  })
);
Title.displayName = 'Title';

export const Card = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) =>
  React.createElement('section', {
    ref,
    className: cn(
      'w-full max-w-3xl mx-auto bg-card text-card-foreground border border-border rounded-xl p-6 shadow-md',
      className
    ),
    ...props,
  })
);
Card.displayName = 'Card';

export const Form = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) =>
  React.createElement('form', {
    ref,
    className: cn(
      'w-full max-w-3xl mx-auto bg-card text-card-foreground border border-border rounded-xl p-6 shadow-md flex flex-col items-center gap-4',
      className
    ),
    ...props,
  })
);
Form.displayName = 'Form';

export const Center = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) =>
  React.createElement('div', {
    ref,
    className: cn('flex-1 flex justify-center items-center', className),
    ...props,
  })
);
Center.displayName = 'Center';

export const Right = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) =>
  React.createElement('div', {
    ref,
    className: cn('w-[90%] flex justify-end gap-2', className),
    ...props,
  })
);
Right.displayName = 'Right';

export const Left = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) =>
  React.createElement('div', {
    ref,
    className: cn('w-[90%] flex justify-start gap-2', className),
    ...props,
  })
);
Left.displayName = 'Left';

export const TableOptionsContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) =>
  React.createElement('div', {
    ref,
    className: cn('flex w-[90%] items-center gap-4', className),
    ...props,
  })
);
TableOptionsContainer.displayName = 'TableOptionsContainer';
