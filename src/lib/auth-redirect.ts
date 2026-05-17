import type { Org, User } from "@/types/auth";

export function postAuthRedirect(
  org: Pick<Org, "onboarding_done"> | null | undefined,
  router: { push: (href: string) => void },
  user?: Pick<User, "is_verified"> | null,
) {
  if (user && !user.is_verified) {
    router.push("/auth/verify-email?notice=1");
  } else if (!org?.onboarding_done) {
    router.push("/dashboard/onboarding");
  } else {
    router.push("/dashboard");
  }
}
