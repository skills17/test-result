import Override from '../../src/Override';

describe('Override', () => {
  it('returns correct values', () => {
    const defaultOverride = new Override('c\\d+');
    const requiredOverride = new Override('c\\d+', true);
    const differentPointsOverride = new Override('c\\d+', false, 3);

    expect(defaultOverride.getPoints()).toBeUndefined();
    expect(defaultOverride.isRequired()).toEqual(false);
    expect(requiredOverride.getPoints()).toBeUndefined();
    expect(requiredOverride.isRequired()).toEqual(true);
    expect(differentPointsOverride.getPoints()).toEqual(3);
    expect(differentPointsOverride.isRequired()).toEqual(false);
  });

  it('matches correctly', () => {
    const defaultOverride = new Override('c\\d+');

    expect(defaultOverride.matches('c1')).toEqual(true);
    expect(defaultOverride.matches('c12')).toEqual(true);
    expect(defaultOverride.matches('dc12')).toEqual(false);
    expect(defaultOverride.matches('c12d')).toEqual(false);
  });
});
