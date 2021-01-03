import Group from '../../src/Group';
import Strategy from '../../src/Strategy';
import TestRun from '../../src/TestRun';

describe('extra tests', () => {
  it('handles extra tests correctly', () => {
    const run = new TestRun();

    run.addGroup(new Group('A.+', 1, Strategy.Add));
    run.addGroup(new Group('B.+', 1, Strategy.Add));
    run.addGroup(new Group('C.+', 1, Strategy.Add));
    run.addGroup(new Group('D.+', 1, Strategy.Add));
    run.addGroup(new Group('E.+', 1, Strategy.Add));

    // normal tests
    run.recordTest('AFoo', false, true);
    run.recordTest('BFoo', false, true);
    run.recordTest('BBar', false, true);
    run.recordTest('BBaz', false, false);
    run.recordTest('CFoo', false, true);
    run.recordTest('CBar', false, true);
    run.recordTest('DFoo', false, false);
    run.recordTest('EFoo', false, false);
    run.recordTest('EBar', false, false);

    // extra tests
    run.recordTest('AFoo', true, true);
    run.recordTest('BFoo', true, true);
    run.recordTest('BBar', true, true);
    run.recordTest('BBaz', true, false);
    run.recordTest('CFoo', true, true);
    run.recordTest('CBar', true, true);
    run.recordTest('DFoo', true, true);
    run.recordTest('EFoo', true, true);
    run.recordTest('EBar', true, true);

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
          group: 'B.+',
          points: 2,
          maxPoints: 3,
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
            {
              name: 'BBar',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'BBaz',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'C.+',
          points: 2,
          maxPoints: 2,
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
            {
              name: 'CBar',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'D.+',
          points: 0,
          maxPoints: 1,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'DFoo',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'E.+',
          points: 0,
          maxPoints: 2,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'EFoo',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
            {
              name: 'EBar',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
          ],
        },
      ],
    });
  });
});
