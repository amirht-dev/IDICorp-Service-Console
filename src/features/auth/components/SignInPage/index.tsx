import logoIcon_image from '@/assets/images/logo-icon.webp';
import signIn_image from '@/assets/images/sign-in.webp';
import { Button } from '@/components/ui/Button';
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
import { ArrowRightIcon, RefreshCwIcon, UserIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

const SignInPage = () => {
  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      username: '',
      password: '',
      captcha: '',
    },
  });

  const { isSubmitting, isValid, isSubmitted, disabled } = formState;

  const handleSignIn = handleSubmit((data) => {
    console.log('🚀 ~ SignInPage ~ data:', data);
  });

  const isDisabled = disabled || isSubmitting || (isSubmitted && !isValid);
  const loading = isSubmitting;

  return (
    <>
      <div className="flex h-dvh">
        <div className="h-full w-3xl relative max-xl:hidden">
          <img src={signIn_image} alt="" className="absolute h-full inset-0" />
        </div>

        <div className="flex items-center justify-center bg-background flex-1 px-3">
          <div className="max-w-sm w-full flex flex-col gap-10">
            <div>
              <img src={logoIcon_image} className="w-18 mx-auto" alt="logo" />
              <h3 className="text-4xl font-bold mt-8">Welcome Back</h3>
              <p className="text-base font-medium text-muted-foreground mt-2">
                Sign in to your Idicorp service console
              </p>
            </div>

            <form onSubmit={handleSignIn}>
              <FieldGroup>
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
                  name="captcha"
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
                          className="w-38 bg-primary/20 rounded-sm overflow-hidden text-foreground"
                          aria-label="captcha"
                        >
                          captcha image
                        </div>
                        <Button
                          variant="outline"
                          size="icon-xl"
                          type="button"
                          aria-label="change captcha"
                          className="text-foreground"
                          disabled={isDisabled}
                        >
                          <RefreshCwIcon />
                        </Button>
                      </div>
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button size="xl" className="mt-6 w-full" disabled={isDisabled}>
                {loading ? (
                  <>
                    Signing In <Spinner />
                  </>
                ) : (
                  <>
                    Sign In <ArrowRightIcon />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <DevTool control={control} />
    </>
  );
};

export default SignInPage;
