import type { Org, User } from "@/types/auth";

export function postAuthRedirect(
  org: Pick<Org, "onboarding_done"> | null | undefined,
  router: { push: (href: string) => void },
  user?: Pick<User, "is_verified"> | null,
) {
  if (user && !user.is_verified) {
    router.push("/auth/verify-email?notice=1");
  } else {
    if (typeof window !== "undefined" && org && !org.onboarding_done) {
      // Trigger the first-run overlay + product tour on first login,
      // same as clicking "Continue" after email verification.
      sessionStorage.setItem("entivia_first_run_pending", "1");
    }
    router.push("/dashboard");
  }
}
