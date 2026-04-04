import { render, screen } from '@testing-library/react';
import App from '../App';
import { ThemeProvider } from '../context/ThemeContext';

describe('App', () => {
  it('renders the application hero title', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    expect(
      screen.getByRole('heading', {
        name: /verify image authenticity with precision/i,
      })
    ).toBeInTheDocument();
  });
});
