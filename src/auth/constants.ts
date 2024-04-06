const access_token = process.env.ACCESS_TOKEN_SECRET;
class jwtConstants {
    static readonly accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    static readonly refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
}

export { access_token, jwtConstants };