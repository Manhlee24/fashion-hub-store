import { AppDataSource } from "../data-source.js";
import { Hero } from "../entities/Hero.js";

const heroRepository = AppDataSource.getRepository(Hero);

export const getAllHeroes = async () => {
  return await heroRepository.find({
    order: { created_at: 'DESC' }
  });
};

export const createHero = async (data: any) => {
  const hero = heroRepository.create(data);
  return await heroRepository.save(hero);
};

export const updateHero = async (id: number | string, data: any) => {
  const heroId = Number(id);
  const hero = await heroRepository.findOneBy({ id: heroId });
  if (!hero) return null;
  
  Object.assign(hero, data);
  return await heroRepository.save(hero);
};

export const deleteHero = async (id: number | string) => {
  const heroId = Number(id);
  const hero = await heroRepository.findOneBy({ id: heroId });
  if (!hero) return null;
  
  return await heroRepository.remove(hero);
};
