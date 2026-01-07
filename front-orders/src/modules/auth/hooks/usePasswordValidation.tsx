import React, { useEffect, useState } from 'react';

import Indication from '@/modules/auth/components/Indication';

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  forms: any;
  new_password: string;
  new_confirmation_password: string;
  description?: string;
}

export const usePasswordValidation = ({
  forms,
  new_confirmation_password,
  new_password,
  description,
}: IProps) => {
  const [hasUppercase, setHasUppercase] = useState<boolean | null>(false);
  const [hasLowercase, setLowercase] = useState<boolean | null>(false);
  const [hasDigit, setHasDigit] = useState<boolean | null>(false);
  const [hasSpecialChar, setHasSpecialChar] = useState<boolean | null>(false);
  const [hasMinCharacter, setMinCharacter] = useState<boolean | null>(false);

  const password = forms?.watch(new_password);
  const confirmation_password = forms?.watch(new_confirmation_password);

  useEffect(() => {
    checkPassword(password);
  }, [password]);

  useEffect(() => {
    validateMatchPassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, confirmation_password]);

  const validateMatchPassword = () => {
    if (password !== confirmation_password && confirmation_password) {
      forms.setError(new_confirmation_password, {
        message: 'Las contraseñas no coinciden',
      });
    } else {
      forms.clearErrors(new_confirmation_password);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkPassword = (value: any) => {
    if (value !== undefined) {
      const rgxUpper = /[A-Z]/;
      const rgxLower = /[a-z]/;
      const rgxSpecial = /[\\/!@#$%^&*(),.?"_\-;:{}~|+'[\]=<>]/;
      const rgxNumber = /\d/;
      const rgx8 = /^.{8,}$/;

      rgxUpper.test(value) ? setHasUppercase(true) : setHasUppercase(false);
      rgxLower.test(value) ? setLowercase(true) : setLowercase(false);
      rgxSpecial.test(value)
        ? setHasSpecialChar(true)
        : setHasSpecialChar(false);
      rgxNumber.test(value) ? setHasDigit(true) : setHasDigit(false);
      rgx8.test(value) ? setMinCharacter(true) : setMinCharacter(false);
    }
  };

  const validationComponent = () => {
    return (
      <React.Fragment>
        {description && (
          <p className='mb-3 font-medium md:mb-10'>{description}</p>
        )}

        <Indication isBoolean={hasMinCharacter} name='Mínimo 8 caracteres' />
        <Indication isBoolean={hasUppercase} name='Al menos una mayúscula' />
        <Indication isBoolean={hasLowercase} name='Al menos una minúscula' />
        <Indication isBoolean={hasDigit} name='Al menos un número' />

        <Indication
          isBoolean={hasSpecialChar}
          name='Al menos un carácter especial'
        />
      </React.Fragment>
    );
  };

  const isValid =
    hasMinCharacter &&
    hasUppercase &&
    hasLowercase &&
    hasDigit &&
    hasSpecialChar;

  return {
    validationComponent,
    validateMatchPassword,
    checkPassword,
    isValid,
  };
};
