import { SignUp } from "@clerk/nextjs"

const resolveRoutePath = (route: string) => {
  try {
    return new URL(route).pathname;
  } catch {
    return route;
  }
};

const signUpUrl = resolveRoutePath(process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/sign-up");
const signInUrl = resolveRoutePath(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in");

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-base text-copy-primary">
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="hidden w-full max-w-lg shrink-0 px-8 py-16 lg:flex lg:flex-col lg:justify-center">
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-copy-secondary">
                Ghost AI
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-copy-primary sm:text-4xl">
                Create your account and start building architecture workflows.
              </h1>
            </div>
            <div className="space-y-4 text-sm text-copy-secondary">
              <p>Sign up for secure access, team collaboration, and persistent AI project storage.</p>
              <ul className="space-y-3">
                <li>• Simple professional auth experience.</li>
                <li>• Minimal layout with focused form interaction.</li>
                <li>• Clerk-managed profile and logout flows.</li>
              </ul>
            </div>
          </div>
        </aside>

        <section className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-md rounded-3xl border border-surface-border bg-surface p-8 shadow-xl shadow-black/10">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-copy-secondary">Sign up</p>
                <h2 className="mt-2 text-2xl font-semibold text-copy-primary">Join Ghost AI securely</h2>
              </div>
              <SignUp
                path={signUpUrl}
                routing="path"
                signInUrl={signInUrl}
                forceRedirectUrl="/editor"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
