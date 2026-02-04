
import { Campaign, ContentAsset, ProfileData } from '../types';

const STORAGE_KEY = 'omnistudio_campaigns';
const PROFILE_KEY = 'omnistudio_profile';

export const saveCampaign = (campaign: Campaign) => {
  const existing = getAllCampaigns();
  const index = existing.findIndex(c => c.id === campaign.id);
  if (index >= 0) {
    existing[index] = campaign;
  } else {
    existing.push(campaign);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
};

export const getAllCampaigns = (): Campaign[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const deleteCampaign = (id: string) => {
  const existing = getAllCampaigns();
  const filtered = existing.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const saveProfile = (profile: ProfileData) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getProfile = (): ProfileData => {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : {};
};
