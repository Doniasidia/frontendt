//apiUtil.ts
export const BASE_URL = "http://localhost:5000/api";

export const CLIENTS_API = `${BASE_URL}/clients`;
export const PLANS_API = `${BASE_URL}/plans`;
export const PLAN_API = `${BASE_URL}/plans/allplans`;
export const GROUPS_API = `${BASE_URL}/groups`;
export const INVOICES_API = `${BASE_URL}/invoices`;
export const SUBSCRIPTIONS_API = `${BASE_URL}/subscriptions`;
export const NOTIFICATION_API = `${BASE_URL}/notifications`;


//AUTH-API
export const AUTH_API = `${BASE_URL}/auth`
export const LOGIN_API = `${AUTH_API}/login`;
export const EMAIL_VERIFI_API = `${AUTH_API}/email/verifi`;
export const EMAIL_SIGNUP_API = `${AUTH_API}/email/verification`;
export const FORGOT_PASSWORD_API = `${AUTH_API}/email/forgot-password`;
export const SUBSCRIBER_REGISTER_PASSWORD_API = `${AUTH_API}/subscriber/reset-password`;
export const CLIENT_REGISTER_PASSWORD_API = `${AUTH_API}/client/reset-password`;

export const CLIENT_VERIFY_API = `${AUTH_API}/client/verify`;
export const SUBSCRIBER_VERIFY_API = `${AUTH_API}/subscriber/verify`

//SUBSCRIPTIONS_API
export const SUBSCRIBERS_API = `${BASE_URL}/subscribers`;
export const REGISTER_SUBSCRIBER_API = `${SUBSCRIBERS_API}/register/subscriber`;

export const CHAT_SOCKET_API = "http://localhost:5000";

export const CHAT_API = `${BASE_URL}/chat/messages`;
