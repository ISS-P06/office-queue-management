import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Authenticator from './Authenticator';

describe('My function Authenticator', () => {
    test('Is Rendered', () => {
        render(<Authenticator/>);

        {/* Test if all elements are rendered */}
        expect(screen.getByRole('heading')).toBeInTheDocument();
        expect(screen.getByText('Username:')).toBeInTheDocument();
        expect(screen.getByText('Password:')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Insert username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('My function Authenticator', () => {
    test('Handles Invalid credentials', () => {

        const doLogin = jest.fn();

        render(<Authenticator login={doLogin}/>);

        userEvent.type(screen.getByPlaceholderText('Insert username'), {
            target: { value: 'admin' },
          });

        userEvent.type(screen.getByPlaceholderText('Password'), {
            target: { value: 'admin' },
        });
        
        userEvent.click(screen.getByRole('button'));

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('Error(s) in the form, please fix it.');
        
        screen.debug();

    });
  });