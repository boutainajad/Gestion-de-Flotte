const { calculerKilometrage, calculerConsommation } = require('../../src/services/calculService');

describe('calculService', () => {
  describe('calculerKilometrage', () => {
    it('calcule correctement la distance', () => {
      expect(calculerKilometrage(15000, 15450)).toBe(450);
    });

    it('rejette si kmArrivee <= kmDepart', () => {
      expect(() => calculerKilometrage(15000, 15000)).toThrow();
      expect(() => calculerKilometrage(15000, 14800)).toThrow();
    });
  });

  describe('calculerConsommation', () => {
    it('calcule la consommation en L/100km', () => {
      expect(calculerConsommation(450, 90)).toBe(20);
    });

    it('retourne 0 si pas de gasoil', () => {
      expect(calculerConsommation(450, 0)).toBe(0);
    });

    it('retourne 0 si km nuls', () => {
      expect(calculerConsommation(0, 90)).toBe(0);
    });
  });
});