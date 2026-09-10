// Integration boundaries. No remote providers are configured in this stage.
export const capabilities = {
  accounts: false,
  cloudStorage: false,
  payments: false,
  pdfExtraction: true,
} as const;
export interface AccountProvider {
  signIn(email: string, password: string): Promise<void>;
  signUp(name: string, email: string, password: string): Promise<void>;
  resetPassword(email: string): Promise<void>;
  signOut(): Promise<void>;
  deleteAccount(): Promise<void>;
}
export interface CloudMaterialStore {
  upload(file: File, userId: string): Promise<string>;
  delete(id: string, userId: string): Promise<void>;
}
export interface SubscriptionProvider {
  getPlan(): Promise<"free" | "premium" | "unlimited">;
}
export const planConfiguration = {
  free: { label: "Free", materialLimit: 20 },
  premium: { label: "Premium", materialLimit: null },
  unlimited: { label: "Unlimited", materialLimit: null },
};
// Firebase adapters belong behind these interfaces. Mollie checkout and webhook
// verification must run on a trusted server; never trust browser entitlements.
