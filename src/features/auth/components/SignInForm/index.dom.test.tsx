import { render, screen, waitFor, within } from '@/lib/testing-library';
import { mockJsonResponse } from '@/mocks/helpers';
import { server } from '@/mocks/setup/node';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { useNavigate } from 'react-router';
import SignInForm from '.';
import type { getCaptcha } from '../../services/captcha.service';
import type { signIn } from '../../services/signIn.service';

vi.mock(import('react-router'), async (importActual) => {
  const module = await importActual();

  return {
    ...module,
    useNavigate: () => vi.fn(),
  };
});

describe('captcha', () => {
  test('should show error while failed to load captcha', async () => {
    server.use(
      http.get('/api/auth/login', () => {
        return HttpResponse.json({ detail: 'test' }, { status: 400 });
      }),
    );

    render(<SignInForm />);

    await waitFor(() =>
      expect(screen.queryByText(/failed to load captcha/i)).toBeInTheDocument(),
    );
  });

  test('should show server error message when server response with server status code', async () => {
    server.use(
      http.get('/api/auth/login', () => {
        return HttpResponse.json({}, { status: 500 });
      }),
    );

    render(<SignInForm />);

    await waitFor(() =>
      expect(
        screen.queryByText(/server is unable to send captcha/i),
      ).toBeInTheDocument(),
    );
  });

  test('should show captcha image after loading', async () => {
    server.use(
      http.get('/api/auth/login', () => {
        return mockJsonResponse<typeof getCaptcha>({ captcha: '', salt: '' });
      }),
    );

    render(<SignInForm />);

    const captcha = screen.getByLabelText('captcha', { exact: true });

    expect(within(captcha).queryByLabelText(/loading/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(
        within(captcha).queryByAltText(/captcha image/i),
      ).toBeInTheDocument(),
    );
  });
});

describe('form', () => {
  beforeEach(() => {
    server.use(
      http.get('/api/auth/login', () => {
        return mockJsonResponse<typeof getCaptcha>({ captcha: '', salt: '' });
      }),
    );
  });

  test('should show required fields validation errors', async () => {
    const user = userEvent.setup();

    render(<SignInForm />);

    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await waitFor(() => expect(signInButton).toBeEnabled());

    await user.click(signInButton);

    expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/captcha answer is required/i)).toBeInTheDocument();
  });

  test('should show server validation errors after submit', async () => {
    const user = userEvent.setup();
    server.use(
      http.post('/api/auth/login', () => {
        return HttpResponse.json({}, { status: 401 });
      }),
    );

    render(<SignInForm />);

    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await waitFor(() => expect(signInButton).toBeEnabled());

    await user.type(screen.getByLabelText(/username\*/i), 'username');
    await user.type(screen.getByLabelText(/password\*/i), 'password');
    await user.type(screen.getByLabelText(/captcha\*/i), 'captcha');

    await user.click(signInButton);

    const errorAlert = await screen.findByRole('alert');

    expect(errorAlert.textContent).toMatchInlineSnapshot(
      `"Invalid username, password or captcha"`,
    );
  });

  test('should show network error', async () => {
    const user = userEvent.setup();
    server.use(
      http.post('/api/auth/login', () => {
        return HttpResponse.error();
      }),
    );

    render(<SignInForm />);

    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await waitFor(() => expect(signInButton).toBeEnabled());

    await user.type(screen.getByLabelText(/username\*/i), 'username');
    await user.type(screen.getByLabelText(/password\*/i), 'password');
    await user.type(screen.getByLabelText(/captcha\*/i), 'captcha');

    await user.click(signInButton);

    const errorAlert = await screen.findByRole('alert');

    expect(errorAlert.textContent).toMatchInlineSnapshot(
      `"Unable to connect to server. Please try again"`,
    );
  });

  test('should show server error', async () => {
    const user = userEvent.setup();
    server.use(
      http.post('/api/auth/login', () => {
        return HttpResponse.json({}, { status: 500 });
      }),
    );

    render(<SignInForm />);

    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await waitFor(() => expect(signInButton).toBeEnabled());

    await user.type(screen.getByLabelText(/username\*/i), 'username');
    await user.type(screen.getByLabelText(/password\*/i), 'password');
    await user.type(screen.getByLabelText(/captcha\*/i), 'captcha');

    await user.click(signInButton);

    const errorAlert = await screen.findByRole('alert');

    expect(errorAlert.textContent).toMatchInlineSnapshot(
      `"ّServer is unavailable right now. Please try again later."`,
    );
  });

  test('should navigate to tasks after successfully signed in', async () => {
    const user = userEvent.setup();
    server.use(
      http.post('/api/auth/login', () => {
        return mockJsonResponse<typeof signIn>({
          access_token: '',
          token_type: 'bearer',
        });
      }),
    );

    render(<SignInForm />);

    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await waitFor(() => expect(signInButton).toBeEnabled());

    await user.type(screen.getByLabelText(/username\*/i), 'username');
    await user.type(screen.getByLabelText(/password\*/i), 'password');
    await user.type(screen.getByLabelText(/captcha\*/i), 'captcha');

    await user.click(signInButton);

    const navigate = vi.mocked(useNavigate());

    waitFor(() => expect(navigate).toHaveBeenCalledWith('/tasks'));
  });
});
