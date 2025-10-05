import express, { Response } from 'express';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import User from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Generate 2FA secret and QR code
router.post('/setup', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `SecureVault (${user.email})`,
      length: 32,
    });

    // Save secret temporarily (not enabled yet)
    user.twoFactorSecret = secret.base32;
    await user.save();

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    res.json({
      secret: secret.base32,
      qrCode,
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({ message: 'Failed to setup 2FA' });
  }
});

// Verify and enable 2FA
router.post('/verify', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token required' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: 'No 2FA setup found' });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 time steps before/after
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Enable 2FA
    user.twoFactorEnabled = true;
    await user.save();

    res.json({ message: '2FA enabled successfully' });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ message: 'Failed to verify 2FA' });
  }
});

// Disable 2FA
router.post('/disable', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password required' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(500).json({ message: 'Failed to disable 2FA' });
  }
});

// Check 2FA status
router.get('/status', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      enabled: user.twoFactorEnabled,
    });
  } catch (error) {
    console.error('2FA status error:', error);
    res.status(500).json({ message: 'Failed to get 2FA status' });
  }
});

export default router;
