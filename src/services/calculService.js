const calculerKilometrage = (kmDepart, kmArrivee) => {
  if (kmArrivee <= kmDepart) {
    throw { status: 400, message: 'Le kilométrage d\'arrivée doit être strictement supérieur au kilométrage de départ' };
  }
  return kmArrivee - kmDepart;
};

const calculerConsommation = (kmParcourus, volumeGasoil) => {
  if (!kmParcourus || !volumeGasoil || kmParcourus === 0) return 0;
  return Number(((volumeGasoil / kmParcourus) * 100).toFixed(2));
};

module.exports = { calculerKilometrage, calculerConsommation };