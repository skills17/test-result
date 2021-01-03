import Group from '../../src/Group';
import Strategy from '../../src/Strategy';
import TestRun from '../../src/TestRun';

describe('extra tests missing', () => {
  it('adds a warning if an extra test is missing', () => {
    const run = new TestRun();

    run.addGroup(new Group('A.+', 1, Strategy.Add));
    run.addGroup(new Group('B.+', 1, Strategy.Add));
    run.addGroup(new Group('C.+', 1, Strategy.Add));
    run.addGroup(new Group('D.+', 1, Strategy.Add));
    run.addGroup(new Group('E.+', 1, Strategy.Add));
    run.addGroup(new Group('F.+', 1, Strategy.Add));

    // normal tests
    run.recordTest('AFoo', false, true);
    run.recordTest('BFoo', false, true);
    run.recordTest('BBar', false, true);
    run.recordTest('BBaz', false, false);
    run.recordTest('CFoo', false, true);
    run.recordTest('CBar', false, true);
    run.recordTest('DFoo', false, false);
    run.recordTest('EFoo', false, true); // this does not have an extra test and should trigger a warning
    run.recordTest('EBar', false, false);
    run.recordTest('FFoo', false, true); // this does not have an extra test and should trigger a warning
    run.recordTest('FBar', false, false); // this does not have an extra test and should trigger a warning

    // extra tests
    run.recordTest('AFoo', true, true);
    run.recordTest('BFoo', true, true);
    run.recordTest('BBar', true, true);
    run.recordTest('BBaz', true, false);
    run.recordTest('CFoo', true, true);
    run.recordTest('CBar', true, true);
    run.recordTest('DFoo', true, true);
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
          points: 1,
          maxPoints: 2,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'EFoo',
              points: 1,
              maxPoints: 1,
              successful: true,
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
        {
          group: 'F.+',
          points: 1,
          maxPoints: 2,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'FFoo',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'FBar',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
          ],
        },
      ],
      warnings: [
        'The following tests do NOT have extra tests and so can NOT be checked for possible cheating:\n  - E.+ > EFoo\n  - F.+ > FFoo\n  - F.+ > FBar',
      ],
    });
  });
});
