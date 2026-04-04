import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the application hero title', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', {
        name: /verify image authenticity with precision/i,
      })
    ).toBeInTheDocument();
  });
});
