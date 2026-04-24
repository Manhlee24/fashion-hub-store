import { Request, Response } from 'express';
import * as heroService from '../services/heroService.js';

export const getHeroes = async (_req: Request, res: Response) => {
  try {
    const heroes = await heroService.getAllHeroes();
    res.json(heroes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createHero = async (req: Request, res: Response) => {
  try {
    const hero = await heroService.createHero(req.body);
    res.status(201).json(hero);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateHero = async (req: Request, res: Response) => {
  try {
    const hero = await heroService.updateHero(String(req.params.id), req.body);
    if (!hero) return res.status(404).json({ message: 'Hero not found' });
    res.json(hero);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteHero = async (req: Request, res: Response) => {
  try {
    const result = await heroService.deleteHero(String(req.params.id));
    if (!result) return res.status(404).json({ message: 'Hero not found' });
    res.json({ message: 'Hero deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
