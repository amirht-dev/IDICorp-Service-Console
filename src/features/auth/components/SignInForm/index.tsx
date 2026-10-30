import logoIcon_image from '@/assets/images/logo-icon.webp';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
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
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { ArrowRightIcon, RefreshCwIcon, UserIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod/v4';
import useCaptchaQuery from '../../hooks/useCaptchaQuery';
import useSignInMutation from '../../hooks/useSignInMutation';
import { signInFormSchema } from '../../schemas';
import CaptchaErrorCard from '../CaptchaErrorCard';

const validationErrorSchema = z.array(
  z.object({
    loc: z.array(z.string()),
    msg: z.string(),
    type: z.enum(['string_type', 'missing', 'string_too_short']),
    input: z.unknown(),
    ctx: z.object(),
  }),
);

const apiErrorSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal(401),
    detail: z.string(),
  }),
  z.object({
    status: z.literal(422),
    detail: validationErrorSchema,
  }),
]);

function isIn<T extends object>(key: PropertyKey, object: T): key is keyof T {
  return key in object;
}

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

      await signInMutation.mutateAsync(
        {
          salt: captchaQuery.data.salt,
          captcha_answer,
          username,
          password,
        },
        {
          onError(error) {
            if (axios.isAxiosError(error)) {
              const err = apiErrorSchema.parse({
                ...error.response?.data,
                status: error.status,
              });
              if (err.status === 401) setError('root', { message: err.detail });
              if (err.status === 422)
                err.detail.forEach((err) => {
                  const field = err.loc.at(1);
                  if (field && isIn(field, signInFormSchema.shape))
                    setError(field, { message: err.msg });
                });
            }
            console.error(error);
          },
          onSuccess() {
            navigate('/tasks');
          },
        },
      );
    },
  );

  const isDisabled = disabled || isSubmitting || (isSubmitted && !isValid);

  if (captchaQuery.isError)
    return (
      <CaptchaErrorCard
        className="max-w-sm w-full"
        message={captchaQuery.error.message}
        onReload={() => captchaQuery.refetch()}
      />
    );

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
          <Card className="mb-4 bg-warning/10 border-warning text-warning">
            <CardContent className="text-sm">
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
            </CardContent>
          </Card>
          <FieldGroup>
            {errors.root && (
              <Card className="border-error bg-error/10 text-error text-sm">
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
                    >
                      {captchaQuery.isFetching ? (
                        <Spinner />
                      ) : captchaQuery.isSuccess ? (
                        <img
                          src={captchaQuery.data.captcha}
                          alt=""
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

      <DevTool control={control} />
    </>
  );
};

export default SignInForm;
