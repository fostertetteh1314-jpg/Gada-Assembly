import { Response } from 'express';
import { uploadToCloudinary } from '../services/cloudinaryService.js';
import { AuthRequest } from '../middleware/auth.js';

export const uploadImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = req.file as any;
    if (!file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }
    const buffer = file.buffer instanceof Buffer ? file.buffer : Buffer.from(await file.arrayBuffer());
    const url = await uploadToCloudinary(buffer, 'gada-assembly');
    res.json({ success: true, data: { url } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};
