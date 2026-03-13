export interface LoginRequest {
    email: string;
    password?: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export interface DecodedToken {
    sub: string;
    exp: number;
    role: string;
}
