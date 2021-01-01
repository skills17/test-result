import Group from '../../src/Group';
import Strategy from '../../src/Strategy';

describe('Group', () => {
  it('returns correct values', () => {
    const addGroup = new Group('abc', 2, Strategy.Add);
    const deductGroup = new Group('abc', 1, Strategy.Deduct, 'my group', 3);

    expect(addGroup.getDefaultPoints()).toEqual(2);
    expect(addGroup.getStrategy()).toEqual(Strategy.Add);
    expect(addGroup.getDisplayName()).toEqual('abc');
    expect(addGroup.getMaxPoints()).toEqual(0);
    expect(deductGroup.getDefaultPoints()).toEqual(1);
    expect(deductGroup.getStrategy()).toEqual(Strategy.Deduct);
    expect(deductGroup.getDisplayName()).toEqual('my group');
    expect(deductGroup.getMaxPoints()).toEqual(3);
  });

  it('matches correctly', () => {
    const group = new Group('a+.*x', 1, Strategy.Add);

    expect(group.matches('aabex')).toEqual(true);
    expect(group.matches('ax')).toEqual(true);
    expect(group.matches('axb')).toEqual(false);
    expect(group.matches('bax')).toEqual(false);
  });

  it('records a successful test', () => {
    const group = new Group('a\\d+', 2, Strategy.Add);

    expect(group.getTests()).toHaveLength(0);
    expect(group.matches('a1')).toEqual(true);

    group.addTest('a1', false, true);

    expect(group.getTests()).toHaveLength(1);
    expect(group.getTests()[0].getName()).toEqual('a1');
    expect(group.getTests()[0].getPoints()).toEqual(2);
    expect(group.getTests()[0].getMaxPoints()).toEqual(2);
    expect(group.getTests()[0].isSuccessful()).toEqual(true);
    expect(group.getTests()[0].isRequired()).toEqual(false);
  });

  it('records a failed test', () => {
    const group = new Group('a\\d+', 2, Strategy.Add);

    expect(group.getTests()).toHaveLength(0);
    expect(group.matches('a1')).toEqual(true);

    group.addTest('a1', false, false);

    expect(group.getTests()).toHaveLength(1);
    expect(group.getTests()[0].getName()).toEqual('a1');
    expect(group.getTests()[0].getPoints()).toEqual(0);
    expect(group.getTests()[0].getMaxPoints()).toEqual(2);
    expect(group.getTests()[0].isSuccessful()).toEqual(false);
    expect(group.getTests()[0].isRequired()).toEqual(false);
  });

  it('records a successful extra test after a normal test', () => {
    const group = new Group('a\\d+', 2, Strategy.Add);

    group.addTest('a1', false, true);
    group.addTest('a2', false, false);
    group.addTest('a1', true, true);
    group.addTest('a2', true, true);

    expect(group.getTests()).toHaveLength(2);
    expect(group.getTests()[0].getName()).toEqual('a1');
    expect(group.getTests()[0].getPoints()).toEqual(2);
    expect(group.getTests()[0].isSuccessful()).toEqual(true);
    expect(group.getTests()[0].requiresManualCheck()).toEqual(false);
    expect(group.getTests()[1].getName()).toEqual('a2');
    expect(group.getTests()[1].getPoints()).toEqual(0);
    expect(group.getTests()[1].isSuccessful()).toEqual(false);
    expect(group.getTests()[1].requiresManualCheck()).toEqual(false);
  });

  it('records a successful extra test before a normal test', () => {
    const group = new Group('a\\d+', 2, Strategy.Add);

    group.addTest('a1', true, true);
    group.addTest('a2', true, true);
    group.addTest('a1', false, true);
    group.addTest('a2', false, false);

    expect(group.getTests()).toHaveLength(2);
    expect(group.getTests()[0].getName()).toEqual('a1');
    expect(group.getTests()[0].getPoints()).toEqual(2);
    expect(group.getTests()[0].isSuccessful()).toEqual(true);
    expect(group.getTests()[0].requiresManualCheck()).toEqual(false);
    expect(group.getTests()[1].getName()).toEqual('a2');
    expect(group.getTests()[1].getPoints()).toEqual(0);
    expect(group.getTests()[1].isSuccessful()).toEqual(false);
    expect(group.getTests()[1].requiresManualCheck()).toEqual(false);
  });

  it('records a failed extra test after a normal test', () => {
    const group = new Group('a\\d+', 2, Strategy.Add);

    group.addTest('a1', false, true);
    group.addTest('a2', false, false);
    group.addTest('a1', true, false);
    group.addTest('a2', true, false);

    expect(group.getTests()).toHaveLength(2);
    expect(group.getTests()[0].getName()).toEqual('a1');
    expect(group.getTests()[0].getPoints()).toEqual(2);
    expect(group.getTests()[0].isSuccessful()).toEqual(true);
    expect(group.getTests()[0].requiresManualCheck()).toEqual(true);
    expect(group.getTests()[1].getName()).toEqual('a2');
    expect(group.getTests()[1].getPoints()).toEqual(0);
    expect(group.getTests()[1].isSuccessful()).toEqual(false);
    expect(group.getTests()[1].requiresManualCheck()).toEqual(false);
  });

  it('records a failed extra test before a normal test', () => {
    const group = new Group('a\\d+', 2, Strategy.Add);

    group.addTest('a1', true, false);
    group.addTest('a2', true, false);
    group.addTest('a1', false, true);
    group.addTest('a2', false, false);

    expect(group.getTests()).toHaveLength(2);
    expect(group.getTests()[0].getName()).toEqual('a1');
    expect(group.getTests()[0].getPoints()).toEqual(2);
    expect(group.getTests()[0].isSuccessful()).toEqual(true);
    expect(group.getTests()[0].requiresManualCheck()).toEqual(true);
    expect(group.getTests()[1].getName()).toEqual('a2');
    expect(group.getTests()[1].getPoints()).toEqual(0);
    expect(group.getTests()[1].isSuccessful()).toEqual(false);
    expect(group.getTests()[1].requiresManualCheck()).toEqual(false);
  });

  it('calculates max points for strategy add', () => {
    const group = new Group('a\\d+', 1, Strategy.Add);

    group.addTest('a1', false, true);
    group.addTest('a2', false, false);
    group.addTest('a3', false, false);

    expect(group.getMaxPoints()).toEqual(3);
  });

  it('calculates max points for strategy add and a maximum value', () => {
    const group = new Group('a\\d+', 1, Strategy.Add, 'a', 2);

    group.addTest('a1', false, true);
    group.addTest('a2', false, false);
    group.addTest('a3', false, false);

    // maximum value should be ignored for strategy add, so it should still be 3
    expect(group.getMaxPoints()).toEqual(3);
  });

  it('calculates max points for strategy deduct', () => {
    const group = new Group('a\\d+', 1, Strategy.Deduct);

    group.addTest('a1', false, true);
    group.addTest('a2', false, false);
    group.addTest('a3', false, false);

    expect(group.getMaxPoints()).toEqual(3);
  });

  it('calculates max points for strategy deduct and a maximum value', () => {
    const group = new Group('a\\d+', 1, Strategy.Deduct, 'a', 2);

    group.addTest('a1', false, true);
    group.addTest('a2', false, false);
    group.addTest('a3', false, false);

    expect(group.getMaxPoints()).toEqual(2);
  });

  it('calculates points for strategy add', () => {
    const group = new Group('a\\d+', 2, Strategy.Add);

    group.addTest('a1', false, true);
    group.addTest('a2', false, true);
    group.addTest('a3', false, false);
    group.addTest('a4', false, true);
    group.addTest('a5', false, false);

    expect(group.getPoints()).toEqual(6);
    expect(group.getMaxPoints()).toEqual(10);
  });

  it('calculates points for strategy deduct', () => {
    const group = new Group('a\\d+', 2, Strategy.Deduct);

    group.addTest('a1', false, true);
    group.addTest('a2', false, true);
    group.addTest('a3', false, false);
    group.addTest('a4', false, true);
    group.addTest('a5', false, false);

    expect(group.getPoints()).toEqual(6);
    expect(group.getMaxPoints()).toEqual(10);
  });

  it('calculates points for strategy deduct and a maximum value', () => {
    const group = new Group('a\\d+', 2, Strategy.Deduct, 'a', 6);

    group.addTest('a1', false, true);
    group.addTest('a2', false, true);
    group.addTest('a3', false, false);
    group.addTest('a4', false, true);
    group.addTest('a5', false, false);

    expect(group.getPoints()).toEqual(2);
    expect(group.getMaxPoints()).toEqual(6);
  });

  it('can not go below zero for strategy deduct', () => {
    const group = new Group('a\\d+', 2, Strategy.Deduct, 'a', 4);

    group.addTest('a1', false, true);
    group.addTest('a2', false, true);
    group.addTest('a3', false, false);
    group.addTest('a4', false, false);
    group.addTest('a5', false, false);

    expect(group.getPoints()).toEqual(0);
    expect(group.getMaxPoints()).toEqual(4);
  });
});
