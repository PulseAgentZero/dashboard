/** Baked in at build time via NEXT_PUBLIC_DEPLOYMENT_MODE */
export type DeploymentMode = "cloud" | "self_hosted";

export function getDeploymentMode(): DeploymentMode {
  const mode = process.env.NEXT_PUBLIC_DEPLOYMENT_MODE;
  return mode === "self_hosted" ? "self_hosted" : "cloud";
}

export function isCloudDeployment(): boolean {
  return getDeploymentMode() === "cloud";
}

export function isSelfHostedDeployment(): boolean {
  return getDeploymentMode() === "self_hosted";
}
