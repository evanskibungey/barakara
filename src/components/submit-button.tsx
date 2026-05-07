
'use client';

import { useFormStatus } from 'react-dom';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import React from 'react';

// Extends ButtonProps to accept all standard button attributes
interface SubmitButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

export function SubmitButton({ children = 'Submit', ...props }: SubmitButtonProps) {
  // We use a try-catch because useFormStatus throws an error
  // if it's used outside a <form> context.
  let pending = false;
  try {
    const status = useFormStatus();
    pending = status.pending;
  } catch (e) {
    // If we are outside a form, pending remains false.
    // A warning can be helpful during development.
    if (process.env.NODE_ENV === 'development') {
        console.warn("SubmitButton used outside of a <form> context.");
    }
  }

  return (
    <Button 
      type="submit" 
      disabled={pending} 
      {...props}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        children
      )}
    </Button>
  );
}
