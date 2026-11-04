import signIn_image_dark from '@/assets/images/sign_in_dark.webp';
import signIn_image_light from '@/assets/images/sign_in_light.webp';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { useTheme } from '@/providers/ThemeProvider';
import SignInForm from '../SignInForm';

const SignInPage = () => {
  useDocumentTitle('Sign in');
  const { resolvedTheme } = useTheme();

  return (
    <>
      <div className="flex h-dvh">
        <div className="h-full w-3xl relative max-xl:hidden">
          <img
            src={
              resolvedTheme === 'light' ? signIn_image_light : signIn_image_dark
            }
            alt=""
            className="absolute h-full inset-0"
          />
        </div>

        <div className="flex items-center justify-center flex-1 px-3">
          <SignInForm />
        </div>
      </div>
      <ThemeSwitcher className="fixed top-4 inset-e-4" />
    </>
  );
};

export default SignInPage;
