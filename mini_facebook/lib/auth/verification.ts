const VERIFICATION_CODE_LENGTH = 6;
const VERIFICATION_TTL_MS = 15 * 60 * 1000;

export function generateVerificationCode() {
  const max = 10 ** VERIFICATION_CODE_LENGTH;
  const code = Math.floor(Math.random() * max)
    .toString()
    .padStart(VERIFICATION_CODE_LENGTH, "0");

  return code;
}

export function getVerificationExpiry() {
  return new Date(Date.now() + VERIFICATION_TTL_MS);
}
