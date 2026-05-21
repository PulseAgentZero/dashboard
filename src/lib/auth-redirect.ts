import type { Org, User } from "@/types/auth";

export function postAuthRedirect(
  _org: Pick<Org, "onboarding_done"> | null | undefined,
  router: { push: (href: string) => void },
  user?: Pick<User, "is_verified"> | null,
) {
  if (user && !user.is_verified) {
    router.push("/auth/verify-email?notice=1");
  } else {
    router.push("/dashboard");
  }
}
