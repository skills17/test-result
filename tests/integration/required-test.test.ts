import Group from '../../src/Group';
import Override from '../../src/Override';
import Strategy from '../../src/Strategy';
import TestRun from '../../src/TestRun';

describe('required test', () => {
  it('handles required tests correctly', () => {
    const run = new TestRun();

    const groupA = new Group('A.+', 1, Strategy.Add);
    groupA.addOverride(new Override('Required', true));
    run.addGroup(groupA);
    const groupB = new Group('B.+', 1, Strategy.Deduct, undefined, 2);
    groupB.addOverride(new Override('Required', true));
    run.addGroup(groupB);
    const groupC = new Group('C.+', 1, Strategy.Add);
    groupC.addOverride(new Override('Required', true));
    run.addGroup(groupC);

    run.recordTest('AFoo', 'Foo', false, true);
    run.recordTest('ABar', 'Bar', false, false);
    run.recordTest('ARequired', 'Required', false, false); // because this fails and is required, group A should award 0 points
    run.recordTest('BFoo', 'Foo', false, true);
    run.recordTest('BBar', 'Bar', false, true);
    run.recordTest('BRequired', 'Required', false, false); // because this fails and is required, group B should award 0 points
    run.recordTest('CFoo', 'Foo', false, true);
    run.recordTest('CRequired', 'Required', false, true);

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
              name: 'Foo',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Bar',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Required',
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
              name: 'Foo',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Bar',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Required',
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
              name: 'Foo',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Required',
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
