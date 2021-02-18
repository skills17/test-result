import Group from '../../src/Group';
import Strategy from '../../src/Strategy';
import TestRun from '../../src/TestRun';

describe('ungrouped tests', () => {
  it('adds a warning for tests that do not match any group', () => {
    const run = new TestRun();

    run.addGroup(new Group('A.+', 1, Strategy.Add));

    run.recordTest('AFoo', 'Foo', false, true);
    run.recordTest('BFoo', 'Foo', false, true);
    run.recordTest('BBar', 'Bar', false, true);

    expect(run.getUngroupedTests()).toStrictEqual(['BFoo', 'BBar']);

    expect(JSON.parse(JSON.stringify(run))).toStrictEqual({
      testResults: [
        {
          group: 'A.+',
          points: 1,
          maxPoints: 1,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'Foo',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
          ],
        },
      ],
      warnings: [
        'The following tests do not belong to a group and were ignored:\n  - BFoo\n  - BBar',
      ],
    });
  });
});
