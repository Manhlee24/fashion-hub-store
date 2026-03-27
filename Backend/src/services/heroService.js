import { Hero } from '../models/associations.js';

export const getAllHeroes = async () => {
  return await Hero.findAll({
    order: [['created_at', 'DESC']]
  });
};

export const createHero = async (data) => {
  return await Hero.create(data);
};

export const updateHero = async (id, data) => {
  const hero = await Hero.findByPk(id);
  if (!hero) return null;
  return await hero.update(data);
};

export const deleteHero = async (id) => {
  const hero = await Hero.findByPk(id);
  if (!hero) return null;
  return await hero.destroy();
};
