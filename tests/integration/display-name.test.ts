import Group from '../../src/Group';
import Strategy from '../../src/Strategy';
import TestRun from '../../src/TestRun';

describe('display name', () => {
  it('respects the display name setting', () => {
    const run = new TestRun();

    run.addGroup(new Group('A.+', 1, Strategy.Add));
    run.addGroup(new Group('B.+', 1, Strategy.Add, 'BGroup::foo'));
    run.addGroup(new Group('C.+', 1, Strategy.Add, 'Last group'));

    run.recordTest('AFoo', false, true);
    run.recordTest('BFoo', false, true);
    run.recordTest('CFoo', false, true);

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
              name: 'AFoo',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'BGroup::foo',
          points: 1,
          maxPoints: 1,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'BFoo',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'Last group',
          points: 1,
          maxPoints: 1,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'CFoo',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
          ],
        },
      ],
    });
  });
});
