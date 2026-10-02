const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET n'est pas configuré");
}

export const authConfig = {
  jwtSecret,
  jwtExpiresIn: '2h',
};
