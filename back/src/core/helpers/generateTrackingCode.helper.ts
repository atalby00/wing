/**
 * Cette fonction génère un code de suivi aléatoire pour un colis.
 * @returns {number} Le code de suivi généré.
 */
export const generateTrackingCode = () => {
  const min = 100000000;
  const max = 110000000;
  return Math.floor(Math.random() * (max - min + 1) + min);
};
