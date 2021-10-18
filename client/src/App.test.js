import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
{/* const linkElement = screen.getByText(/learn react/i); */}
{/* expect(linkElement).toBeInTheDocument(); */}
});

describe('My function App', () => {
  test('Renders login form by pressing login button', () => {
      render(<App/>);

      userEvent.click(screen.getByText('Login'));

      {/* Test if all elements are rendered */}
      expect(screen.getByText('Username:')).toBeInTheDocument();
      expect(screen.getByText('Password:')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Insert username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });
});



