//types/session
type Role = "client" | "SUBSCRIBER" | "superadmin" | "admin";

type Session = {
    access_token: string;
    role: Role;
    redirectTo: string;
}