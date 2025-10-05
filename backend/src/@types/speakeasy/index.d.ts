declare module 'speakeasy' {
  export interface GenerateSecretOptions {
    length?: number;
    name?: string;
    issuer?: string;
  }

  export interface GeneratedSecret {
    ascii: string;
    hex: string;
    base32: string;
    otpauth_url?: string;
  }

  export interface TotpVerifyOptions {
    secret: string;
    encoding: string;
    token: string;
    window?: number;
  }

  export function generateSecret(options?: GenerateSecretOptions): GeneratedSecret;

  export namespace totp {
    export function verify(options: TotpVerifyOptions): boolean;
  }
}
