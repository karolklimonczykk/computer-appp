import { signIn, signOut } from '@/lib/auth';

type SignInProps = {
  provider?: string;
};

export function SignIn({ provider = 'github' }: SignInProps) {
  return (
    <form
      action={async () => {
        'use server';
        await signIn(provider);
      }}
    >
      <button className="rounded-md bg-neutral-700 px-4 py-2 text-sm font-medium text-white">
        Zaloguj się z {provider}
      </button>
    </form>
  );
}

export function SignOut() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button className="rounded-md bg-neutral-700 px-4 py-2 text-sm font-medium text-white">
        Wyloguj się
      </button>
    </form>
  );
}
