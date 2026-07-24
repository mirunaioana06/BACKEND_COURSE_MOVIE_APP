import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { prisma } from './db.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.email || profile.emails[0]?.value;

        if (!email) {
          return done(new Error('Google account did not provide an email'), null);
        }
        let user = await prisma.user.findUnique({
          where: {
            google: profile.id,
          },
        });

        if (!user) {
          const existingUser = await prisma.user.findUnique({
            where: {
              email: email,
            },
          });

          if (existingUser) {
            user = await prisma.user.update({
              where: {
                id: existingUser.id,
              },
              data: {
                google: profile.id,
              },
            });
          } else {
            user = await prisma.user.create({
              data: {
                google: profile.id,
                name: profile.displayName || 'Google User',
                email: email,
              },
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

export default passport;
