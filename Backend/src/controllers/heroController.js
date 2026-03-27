import * as heroService from '../services/heroService.js';

export const getHeroes = async (req, res) => {
  try {
    const heroes = await heroService.getAllHeroes();
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createHero = async (req, res) => {
  try {
    const hero = await heroService.createHero(req.body);
    res.status(201).json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateHero = async (req, res) => {
  try {
    const hero = await heroService.updateHero(req.params.id, req.body);
    if (!hero) return res.status(404).json({ message: 'Hero not found' });
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteHero = async (req, res) => {
  try {
    const result = await heroService.deleteHero(req.params.id);
    if (!result) return res.status(404).json({ message: 'Hero not found' });
    res.json({ message: 'Hero deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
