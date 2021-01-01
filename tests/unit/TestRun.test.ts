import Group from '../../src/Group';
import Strategy from '../../src/Strategy';
import TestRun from '../../src/TestRun';

describe('TestRun', () => {
  it('adds a group', () => {
    const run = new TestRun();

    expect(run.getGroups()).toHaveLength(0);

    run.addGroup(new Group('abc', 1, Strategy.Add));

    expect(run.getGroups()).toHaveLength(1);
  });

  it('records a new test', () => {
    const run = new TestRun();
    run.addGroup(new Group('a.*x', 1, Strategy.Add));

    expect(run.recordTest('abx', false, false)).toEqual(true);
  });

  it('does not record a test that does not match a group', () => {
    const run = new TestRun();
    run.addGroup(new Group('a.*x', 1, Strategy.Add));

    expect(run.recordTest('abxb', false, false)).toEqual(false);
  });
});
