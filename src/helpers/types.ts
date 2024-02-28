export interface JwtToken {
    user: JwtUser;
    tokenType: string;
    iat: number;
}

export interface JwtUser {
    id: number;
    email: string;
}