import Group from '../../src/Group';
import Override from '../../src/Override';
import Strategy from '../../src/Strategy';

describe('Group', () => {
  it('returns correct values', () => {
    const addGroup = new Group('abc', 2, Strategy.Add);
    const deductGroup = new Group('abc', 1, Strategy.Deduct, 'my group', 3);

    expect(addGroup.getDefaultPoints()).toEqual(2);
    expect(addGroup.getStrategy()).toEqual(Strategy.Add);
    expect(addGroup.getDisplayName()).toEqual('abc');
    expect(addGroup.getMaxPoints()).toEqual(0);
    expect(addGroup.getPattern()).toEqual('abc');
    expect(deductGroup.getDefaultPoints()).toEqual(1);
    expect(deductGroup.getStrategy()).toEqual(Strategy.Deduct);
    expect(deductGroup.getDisplayName()).toEqual('my group');
    expect(deductGroup.getMaxPoints()).toEqual(3);
    expect(deductGroup.getPattern()).toEqual('abc');
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

  it('cannot add a normal test with the same name twice', () => {
    const group = new Group('a\\d+', 1, Strategy.Add);

    group.addTest('a1', false, true);

    expect(() => group.addTest('a1', false, true)).toThrow('same name');
  });

  it('cannot add an extra test with the same name twice', () => {
    const group = new Group('a\\d+', 1, Strategy.Add);

    group.addTest('a1', true, true);

    expect(() => group.addTest('a1', true, true)).toThrow('same name');
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

  it('overrides points for a single test', () => {
    const addGroup = new Group('a\\d+', 2, Strategy.Add);
    const deductGroup = new Group('a\\d+', 2, Strategy.Deduct);

    addGroup.addOverride(new Override('a2', false, 3));
    addGroup.addTest('a1', false, true);
    addGroup.addTest('a2', false, true);
    addGroup.addTest('a3', false, true);

    deductGroup.addOverride(new Override('a2', false, 3));
    deductGroup.addTest('a1', false, true);
    deductGroup.addTest('a2', false, true);
    deductGroup.addTest('a3', false, true);

    expect(addGroup.getPoints()).toEqual(7);
    expect(addGroup.getMaxPoints()).toEqual(7);
    expect(deductGroup.getPoints()).toEqual(7);
    expect(deductGroup.getMaxPoints()).toEqual(7);
  });

  it('scores 0 points if a required test fails', () => {
    const addGroup = new Group('a\\d+', 1, Strategy.Add);
    const deductGroup = new Group('a\\d+', 1, Strategy.Deduct);
    const deductMaxPointsGroup = new Group('a\\d+', 1, Strategy.Deduct, 'a', 2);
    const override = new Override('a2', true);

    addGroup.addOverride(override);
    deductGroup.addOverride(override);
    deductMaxPointsGroup.addOverride(override);

    addGroup.addTest('a1', false, true);
    addGroup.addTest('a2', false, false);
    deductGroup.addTest('a1', false, true);
    deductGroup.addTest('a2', false, false);
    deductMaxPointsGroup.addTest('a1', false, true);
    deductMaxPointsGroup.addTest('a2', false, false);
    deductMaxPointsGroup.addTest('a3', false, true);

    expect(addGroup.getPoints()).toEqual(0);
    expect(addGroup.getMaxPoints()).toEqual(2);
    expect(deductGroup.getPoints()).toEqual(0);
    expect(deductGroup.getMaxPoints()).toEqual(2);
    expect(deductMaxPointsGroup.getPoints()).toEqual(0);
    expect(deductMaxPointsGroup.getMaxPoints()).toEqual(2);
  });

  it('scores the correct points when a required test succeeds', () => {
    const addGroup = new Group('a\\d+', 1, Strategy.Add);
    const deductGroup = new Group('a\\d+', 1, Strategy.Deduct);
    const deductMaxPointsGroup = new Group('a\\d+', 1, Strategy.Deduct, 'a', 2);
    const override = new Override('a1', true);

    addGroup.addOverride(override);
    deductGroup.addOverride(override);
    deductMaxPointsGroup.addOverride(override);

    addGroup.addTest('a1', false, true);
    addGroup.addTest('a2', false, false);
    deductGroup.addTest('a1', false, true);
    deductGroup.addTest('a2', false, false);
    deductMaxPointsGroup.addTest('a1', false, true);
    deductMaxPointsGroup.addTest('a2', false, false);
    deductMaxPointsGroup.addTest('a3', false, true);

    expect(addGroup.getPoints()).toEqual(1);
    expect(addGroup.getMaxPoints()).toEqual(2);
    expect(deductGroup.getPoints()).toEqual(1);
    expect(deductGroup.getMaxPoints()).toEqual(2);
    expect(deductMaxPointsGroup.getPoints()).toEqual(1);
    expect(deductMaxPointsGroup.getMaxPoints()).toEqual(2);
  });

  it('converts to json', () => {
    const addGroup = new Group('a\\d+', 2, Strategy.Add);
    const deductGroup = new Group('a\\d+', 1, Strategy.Deduct, 'deduct-group', 2);

    addGroup.addTest('a1', false, true);
    addGroup.addTest('a2', false, false);
    deductGroup.addTest('a1', false, true);
    deductGroup.addTest('a2', false, true);
    deductGroup.addTest('a2', true, false);
    deductGroup.addTest('a3', false, false);

    expect(JSON.parse(JSON.stringify(addGroup))).toStrictEqual({
      group: 'a\\d+',
      points: 2,
      maxPoints: 4,
      strategy: 'add',
      manualCheck: false,
      tests: [
        {
          name: 'a1',
          points: 2,
          maxPoints: 2,
          successful: true,
          required: false,
          manualCheck: false,
        },
        {
          name: 'a2',
          points: 0,
          maxPoints: 2,
          successful: false,
          required: false,
          manualCheck: false,
        },
      ],
    });
    expect(JSON.parse(JSON.stringify(deductGroup))).toStrictEqual({
      group: 'deduct-group',
      points: 1,
      maxPoints: 2,
      strategy: 'deduct',
      manualCheck: true,
      tests: [
        {
          name: 'a1',
          points: 1,
          maxPoints: 1,
          successful: true,
          required: false,
          manualCheck: false,
        },
        {
          name: 'a2',
          points: 1,
          maxPoints: 1,
          successful: true,
          required: false,
          manualCheck: true,
        },
        {
          name: 'a3',
          points: 0,
          maxPoints: 1,
          successful: false,
          required: false,
          manualCheck: false,
        },
      ],
    });
  });
});
