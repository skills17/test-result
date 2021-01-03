import Group from '../../src/Group';
import Override from '../../src/Override';
import Strategy from '../../src/Strategy';
import TestRun from '../../src/TestRun';

describe('required test', () => {
  it('handles required tests correctly', () => {
    const run = new TestRun();

    const groupA = new Group('A.+', 1, Strategy.Add);
    groupA.addOverride(new Override('ARequired', true));
    run.addGroup(groupA);
    const groupB = new Group('B.+', 1, Strategy.Deduct, undefined, 2);
    groupB.addOverride(new Override('BRequired', true));
    run.addGroup(groupB);
    const groupC = new Group('C.+', 1, Strategy.Add);
    groupC.addOverride(new Override('CRequired', true));
    run.addGroup(groupC);

    run.recordTest('AFoo', false, true);
    run.recordTest('ABar', false, false);
    run.recordTest('ARequired', false, false); // because this fails and is required, group A should award 0 points
    run.recordTest('BFoo', false, true);
    run.recordTest('BBar', false, true);
    run.recordTest('BRequired', false, false); // because this fails and is required, group B should award 0 points
    run.recordTest('CFoo', false, true);
    run.recordTest('CRequired', false, true);

    expect(JSON.parse(JSON.stringify(run))).toStrictEqual({
      testResults: [
        {
          group: 'A.+',
          points: 0,
          maxPoints: 3,
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
            {
              name: 'ABar',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
            {
              name: 'ARequired',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: true,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'B.+',
          points: 0,
          maxPoints: 2,
          strategy: 'deduct',
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
              name: 'BRequired',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: true,
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
              name: 'CRequired',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: true,
              manualCheck: false,
            },
          ],
        },
      ],
    });
  });
});
