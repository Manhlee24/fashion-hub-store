import { AppDataSource } from "../data-source.js";
import { Banner } from "../entities/Banner.js";

const bannerRepository = AppDataSource.getRepository(Banner);

export const getAllBanners = async () => {
  return await bannerRepository.find({
    order: { sort_order: 'ASC' }
  });
};

export const createBanner = async (data: any) => {
  const banner = bannerRepository.create(data);
  return await bannerRepository.save(banner);
};

export const updateBanner = async (id: number | string, data: any) => {
  const bannerId = Number(id);
  const banner = await bannerRepository.findOneBy({ id: bannerId });
  if (!banner) return null;
  
  Object.assign(banner, data);
  return await bannerRepository.save(banner);
};

export const deleteBanner = async (id: number | string) => {
  const bannerId = Number(id);
  const banner = await bannerRepository.findOneBy({ id: bannerId });
  if (!banner) return null;
  
  return await bannerRepository.remove(banner);
};
