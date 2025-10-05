import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import VaultItem from '../models/VaultItem';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all vault items for the authenticated user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const vaultItems = await VaultItem.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json(vaultItems);
  } catch (error) {
    console.error('Error fetching vault items:', error);
    res.status(500).json({ message: 'Server error fetching vault items' });
  }
});

// Create a new vault item
router.post(
  '/',
  authenticateToken,
  [
    body('encryptedData').notEmpty(),
    body('iv').notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { encryptedData, iv } = req.body;

    try {
      const vaultItem = new VaultItem({
        userId: req.userId,
        encryptedData,
        iv,
      });

      await vaultItem.save();
      res.status(201).json(vaultItem);
    } catch (error) {
      console.error('Error creating vault item:', error);
      res.status(500).json({ message: 'Server error creating vault item' });
    }
  }
);

// Update a vault item
router.put(
  '/:id',
  authenticateToken,
  [
    body('encryptedData').notEmpty(),
    body('iv').notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { encryptedData, iv } = req.body;

    try {
      const vaultItem = await VaultItem.findOne({ _id: id, userId: req.userId });
      
      if (!vaultItem) {
        return res.status(404).json({ message: 'Vault item not found' });
      }

      vaultItem.encryptedData = encryptedData;
      vaultItem.iv = iv;
      await vaultItem.save();

      res.json(vaultItem);
    } catch (error) {
      console.error('Error updating vault item:', error);
      res.status(500).json({ message: 'Server error updating vault item' });
    }
  }
);

// Delete a vault item
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const vaultItem = await VaultItem.findOneAndDelete({ _id: id, userId: req.userId });
    
    if (!vaultItem) {
      return res.status(404).json({ message: 'Vault item not found' });
    }

    res.json({ message: 'Vault item deleted successfully' });
  } catch (error) {
    console.error('Error deleting vault item:', error);
    res.status(500).json({ message: 'Server error deleting vault item' });
  }
});

export default router;
