import express from 'express';
import { loginLimiter, loginSlowDown, registerLimiter } from '../middleware/rateMiddleware.js';
import { register, login, logout } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { registerSchema, loginSchema } from '../validators/authValidators.js';
import passport from '../config/passport.js';
import { generateToken } from '../utils/generateToken.js';

const router = express.Router();

router.post('/register', registerLimiter, validateRequest(registerSchema), register);
router.post('/login', loginLimiter, loginSlowDown, validateRequest(loginSchema), login);
router.post('/logout', logout);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/auth/google/failure',
  }),
  (req, res) => {
    const token = generateToken(req.user.id, res);

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
        },
        token: token,
      },
    });
  },
);

router.get('/google/failure', (req, res) => {
  res.status(401).json({
    status: 'error',
    message: 'Google authentication failed',
  });
});

export default router;
