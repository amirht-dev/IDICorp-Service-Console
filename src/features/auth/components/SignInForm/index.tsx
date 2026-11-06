import logoIcon_image from '@/assets/images/logo-icon.webp';
import RHFDevTool from '@/components/helpers/RHFDevTool';
import AlertBox from '@/components/ui/AlertBox';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/Field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/InputGroup';
import PasswordInput from '@/components/ui/PasswordInput';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from '@/components/ui/Toast';
import { handleApiError } from '@/lib/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightIcon, RefreshCwIcon, UserIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import useCaptchaQuery from '../../hooks/useCaptchaQuery';
import useSignInMutation from '../../hooks/useSignInMutation';
import { signInFormSchema } from '../../schemas';
import CaptchaErrorCard from '../CaptchaErrorCard';

const SignInForm = () => {
  const captchaQuery = useCaptchaQuery();
  const signInMutation = useSignInMutation();
  const { control, handleSubmit, formState, setError, setValue } = useForm({
    defaultValues: {
      username: '',
      password: '',
      captcha_answer: '',
    },
    disabled: captchaQuery.isFetching || signInMutation.isPending,
    resolver: zodResolver(signInFormSchema),
  });
  const navigate = useNavigate();

  const { isSubmitting, isValid, isSubmitted, disabled, errors } = formState;

  const handleSignIn = handleSubmit(
    async ({ captcha_answer, username, password }) => {
      if (!captchaQuery.isSuccess) return;

      const toastId = toast.add({ type: 'loading', title: 'Signing in...' });

      signInMutation.mutate(
        {
          salt: captchaQuery.data.salt,
          captcha_answer,
          username,
          password,
        },
        {
          onError(error) {
            const err = handleApiError(error);

            let message: string = '';

            if (err.type == 'network')
              message = 'Unable to connect to server. Please try again';
            else if (err.type == 'timeout')
              message =
                'The server did not respond within the allotted time. Please try again.';
            else if (err.type == 'cancelled')
              message = 'The request was cancelled. Please try again.';
            else if (err.type == 'http') {
              if (err.status == 401)
                message = 'Invalid username, password or captcha';
              if (err.status >= 500)
                message =
                  'ّServer is unavailable right now. Please try again later.';
            } else message = 'Something wrong happened. Please try again';

            toast.update(toastId, {
              type: 'error',
              title: 'Failed to sign in',
              description: message,
            });

            setError('root', { message });
          },
          onSuccess() {
            toast.update(toastId, {
              type: 'success',
              title: 'Signed in successfully',
            });
            navigate('/tasks');
          },
        },
      );
    },
  );

  const isDisabled = disabled || isSubmitting || (isSubmitted && !isValid);

  if (captchaQuery.isError) {
    const err = handleApiError(captchaQuery.error);
    return (
      <CaptchaErrorCard
        className="max-w-sm w-full"
        message={
          err.type === 'http' && err.status >= 500
            ? 'Server is unable to send captcha right now. Please try again later.'
            : undefined
        }
        onReload={() => captchaQuery.refetch()}
      />
    );
  }

  return (
    <>
      <div className="max-w-sm w-full flex flex-col gap-10">
        <div>
          <img src={logoIcon_image} className="w-18 mx-auto" alt="logo" />
          <h3 className="text-4xl font-bold mt-8">Welcome Back</h3>
          <p className="text-base font-medium text-muted-foreground mt-2">
            Sign in to your Idicorp service console
          </p>
        </div>

        <form onSubmit={handleSignIn}>
          <AlertBox className="mb-4">
            for sign in as test user use{' '}
            <button
              className="underline"
              type="button"
              onClick={() => {
                setValue('username', 'admin');
                setValue('password', 'admin');
              }}
            >
              <b>admin</b>
            </button>{' '}
            for both username and password
          </AlertBox>

          <FieldGroup>
            {errors.root && (
              <Card
                className="border-error bg-error/10 text-error text-sm"
                role="alert"
                data-testid="signin-error"
              >
                {errors.root?.message}
              </Card>
            )}

            <Controller
              control={control}
              name="username"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="username" required>
                    Username
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="username"
                      placeholder="Enter your username"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    <InputGroupAddon align="inline-start">
                      <UserIcon />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password" required>
                    Password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name="captcha_answer"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="captcha" required>
                    CAPTCHA
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="captcha"
                      placeholder="Enter the code shown in the image"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                  </InputGroup>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                  <div className="flex gap-2">
                    <div
                      className="w-38 bg-secondary rounded-sm overflow-hidden text-foreground relative flex items-center justify-center"
                      aria-label="captcha"
                      aria-busy={captchaQuery.isLoading}
                    >
                      {captchaQuery.isFetching ? (
                        <Spinner aria-label="loading" />
                      ) : captchaQuery.isSuccess ? (
                        <img
                          src={captchaQuery.data.captcha || undefined}
                          alt="captcha image"
                          className="absolute w-full h-full inset-0"
                        />
                      ) : null}
                    </div>
                    <Button
                      variant="outline"
                      size="icon-xl"
                      type="button"
                      aria-label="change captcha"
                      className="text-foreground"
                      disabled={isDisabled}
                      onClick={() => captchaQuery.refetch()}
                    >
                      <RefreshCwIcon />
                    </Button>
                  </div>
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            size="xl"
            type="submit"
            className="mt-6 w-full"
            disabled={isDisabled}
            loading={isSubmitting}
            endIcon={<ArrowRightIcon />}
          >
            {isSubmitting ? 'Signing In' : 'Sign In'}
          </Button>
        </form>
      </div>

      <RHFDevTool control={control} />
    </>
  );
};

export default SignInForm;
