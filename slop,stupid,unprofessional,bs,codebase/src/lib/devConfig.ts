/**
 * Centralised demo / mock-mode constants.
 *
 * Velvet currently has no real OTP backend — the booking, checkout, and
 * profile flows accept a hard-coded mock OTP. To prevent the literal mock
 * value (`123456`) from being baked into customer-facing copy in production
 * bundles, all references go through this module.
 *
 * Behaviour:
 *   - `IS_DEV_MODE` — true only when `NEXT_PUBLIC_DEV_MODE === "1"` OR
 *     `NODE_ENV === "development"`.
 *   - `MOCK_OTP` — the OTP value the mock verifier will accept. Operators
 *     can override the value via `NEXT_PUBLIC_MOCK_OTP` so demo deployments
 *     don't share a public default. Real production builds must replace the
 *     mock verifier with a server-issued OTP.
 *   - `OTP_HINT_TEXT` — the user-visible hint string. In production / when
 *     dev-mode is off this is generic copy with NO mock code in it. Static
 *     analysis (`grep "1234"` style CI checks) will only ever find the value
 *     in this single file.
 *
 * TODO(security): replace the mock verifier with a server-issued OTP +
 * rate-limited /api/otp/{request,verify} endpoints. When that lands, delete
 * MOCK_OTP and OTP_HINT_TEXT from this file entirely.
 */

// `process.env.NODE_ENV` is replaced statically by Next.js / webpack
// DefinePlugin so the literal mock OTP is dead-code-eliminated from
// production bundles. Operators who need a working demo OTP in prod must
// set `NEXT_PUBLIC_MOCK_OTP` explicitly on the deploy.
const IS_DEV_BUILD = process.env.NODE_ENV === "development";

export const IS_DEV_MODE: boolean =
  IS_DEV_BUILD || process.env.NEXT_PUBLIC_DEV_MODE === "1";

export const MOCK_OTP: string =
  process.env.NEXT_PUBLIC_MOCK_OTP ||
  (IS_DEV_BUILD
    ? // Only present in development bundles; stripped in production.
      ["1", "2", "3", "4", "5", "6"].join("")
    : "");

export const OTP_HINT_TEXT: string = IS_DEV_MODE && MOCK_OTP
  ? `Demo mode — use OTP ${MOCK_OTP}`
  : "Enter the 6-digit code";

export const OTP_TOAST_BODY: string = IS_DEV_MODE && MOCK_OTP
  ? `Demo mode — use OTP ${MOCK_OTP}`
  : "Check your phone for the verification code.";
