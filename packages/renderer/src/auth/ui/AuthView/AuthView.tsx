import { ParentComponent } from 'solid-js';
import { AuthViewForm } from './AuthViewForm';
import { AuthViewInstructions } from './AuthViewInstructions';

interface AuthViewComponent extends ParentComponent {
  Instructions: typeof AuthViewInstructions;
  Form: typeof AuthViewForm;
}

export const AuthView: AuthViewComponent = props => {
  return <>{props.children}</>;
};

AuthView.Instructions = AuthViewInstructions;
AuthView.Form = AuthViewForm;
