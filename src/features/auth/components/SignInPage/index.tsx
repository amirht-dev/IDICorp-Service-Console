import signIn_image from '@/assets/images/sign-in.webp';
import SignInForm from '../SignInForm';

const SignInPage = () => {
  return (
    <>
      <div className="flex h-dvh">
        <div className="h-full w-3xl relative max-xl:hidden">
          <img src={signIn_image} alt="" className="absolute h-full inset-0" />
        </div>

        <div className="flex items-center justify-center bg-background flex-1 px-3">
          <SignInForm />
        </div>
      </div>
    </>
  );
};

export default SignInPage;
