import { FC, ReactNode } from 'react';
import AuthViewForm from './AuthViewForm';
import AuthViewInstructions from './AuthViewInstructions';

interface AuthViewComponent extends FC<{ children?: ReactNode }> {
  Instructions: typeof AuthViewInstructions;
  Form: typeof AuthViewForm;
}

const AuthView: AuthViewComponent = ({ children }) => {
  return <>{children}</>;
};

AuthView.Instructions = AuthViewInstructions;
AuthView.Form = AuthViewForm;

export default AuthView;
