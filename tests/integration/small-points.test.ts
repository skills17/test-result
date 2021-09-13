import Group from '../../src/Group';
import Strategy from '../../src/Strategy';
import TestRun from '../../src/TestRun';

describe('display name', () => {
  it('respects the display name setting', () => {
    const run = new TestRun();

    run.addGroup(new Group('A.+', 0.1, Strategy.Add));

    run.recordTest('A1', '1', false, true);
    run.recordTest('A2', '2', false, true);
    run.recordTest('A3', '3', false, true);
    run.recordTest('A4', '4', false, true);
    run.recordTest('A5', '5', false, true);
    run.recordTest('A6', '6', false, true);
    run.recordTest('A7', '7', false, true);
    run.recordTest('A8', '8', false, true);
    run.recordTest('A9', '9', false, true);
    run.recordTest('A10', '10', false, true);
    run.recordTest('A11', '11', false, true);
    run.recordTest('A12', '12', false, true);
    run.recordTest('A13', '13', false, true);
    run.recordTest('A14', '14', false, true);
    run.recordTest('A15', '15', false, true);
    run.recordTest('A16', '16', false, true);
    run.recordTest('A17', '17', false, true);
    run.recordTest('A18', '18', false, true);
    run.recordTest('A19', '19', false, true);
    run.recordTest('A20', '20', false, true);

    expect(JSON.parse(JSON.stringify(run))).toStrictEqual({
      testResults: [
        {
          group: 'A.+',
          points: 2,
          maxPoints: 2,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: '1',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '2',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '3',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '4',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '5',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '6',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '7',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '8',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '9',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '10',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '11',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '12',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '13',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '14',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '15',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '16',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '17',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '18',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '19',
              points: 0.1,
              maxPoints: 0.1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: '20',
              points: 0.1,
              maxPoints: 0.1,
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
