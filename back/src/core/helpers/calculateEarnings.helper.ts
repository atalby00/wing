/**
 * Cette fonction calcule les gains pour un colis en fonction de son poids.
 * @param {number} weight - Le poids du colis.
 * @returns {number} Les gains pour le colis.
 */
export const calculateEarnings = (weight: number) => {
  if (weight <= 1) return 1;
  if (weight <= 5) return 2;
  if (weight <= 10) return 3;
  if (weight <= 20) return 5;
  return 10;
};
