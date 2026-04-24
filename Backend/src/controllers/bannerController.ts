import { Request, Response } from 'express';
import * as bannerService from '../services/bannerService.js';

export const getBanners = async (_req: Request, res: Response) => {
  try {
    const banners = await bannerService.getAllBanners();
    res.json(banners);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createBanner = async (req: Request, res: Response) => {
  try {
    const banner = await bannerService.createBanner(req.body);
    res.status(201).json(banner);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    const banner = await bannerService.updateBanner(String(req.params.id), req.body);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json(banner);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const result = await bannerService.deleteBanner(String(req.params.id));
    if (!result) return res.status(404).json({ message: 'Banner not found' });
    res.json({ message: 'Banner deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
