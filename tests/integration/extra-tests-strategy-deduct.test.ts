import Group from '../../src/Group';
import Override from '../../src/Override';
import Strategy from '../../src/Strategy';
import TestRun from '../../src/TestRun';

describe('extra tests strategy deduct', () => {
  it('handles extra tests correctly for the deduct strategy', () => {
    const run = new TestRun();

    run.addGroup(new Group('A.+', 1, Strategy.Deduct));
    run.addGroup(new Group('B.+', 1, Strategy.Deduct, undefined, 2));
    run.addGroup(new Group('C.+', 1, Strategy.Deduct, undefined, 2));
    run.addGroup(new Group('D.+', 0.5, Strategy.Deduct, undefined));
    const groupE = new Group('E.+', 0.5, Strategy.Deduct, undefined, 2);
    groupE.addOverride(new Override('EMorePoints', false, 1));
    run.addGroup(groupE);
    run.addGroup(new Group('F.+', 1, Strategy.Deduct));

    // normal tests

    // group A: should result in 2/3 as ABar deducts 1 point
    run.recordTest('AFoo', false, true);
    run.recordTest('ABar', false, false);
    run.recordTest('ABaz', false, true);

    // group B: should result in 1/2 as BBar deducts 1 point and max is set to 2
    run.recordTest('BFoo', false, true);
    run.recordTest('BBar', false, false);
    run.recordTest('BBaz', false, true);

    // group C: should result in 0/2 as a value below 0 is not possible
    run.recordTest('CFoo', false, false);
    run.recordTest('CBar', false, false);
    run.recordTest('CBaz', false, false);

    // group D: should result in 1/1.5 as default points is 0.5
    run.recordTest('DFoo', false, true);
    run.recordTest('DBar', false, false);
    run.recordTest('DBaz', false, true);

    // group E: should result in 0.5/2 as one test deducts more points
    run.recordTest('EFoo', false, true);
    run.recordTest('EMorePoints', false, false);
    run.recordTest('EBar', false, false);
    run.recordTest('EBaz', false, true);

    // group F: should result in 2/2
    run.recordTest('FFoo', false, true);
    run.recordTest('FBar', false, true);

    // extra tests
    run.recordTest('AFoo', true, true);
    run.recordTest('ABar', true, true);
    run.recordTest('ABaz', true, true);
    run.recordTest('BFoo', true, true);
    run.recordTest('BBar', true, true);
    run.recordTest('BBaz', true, false);
    run.recordTest('CFoo', true, true);
    run.recordTest('CBar', true, true);
    run.recordTest('CBaz', true, true);
    run.recordTest('DFoo', true, true);
    run.recordTest('DBar', true, true);
    run.recordTest('DBaz', true, true);
    run.recordTest('EFoo', true, true);
    run.recordTest('EMorePoints', true, true);
    run.recordTest('EBar', true, true);
    run.recordTest('EBaz', true, true);
    run.recordTest('FFoo', true, true);
    run.recordTest('FBar', true, true);

    expect(JSON.parse(JSON.stringify(run))).toStrictEqual({
      testResults: [
        {
          group: 'A.+',
          points: 2,
          maxPoints: 3,
          strategy: 'deduct',
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
              name: 'ABaz',
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
          points: 1,
          maxPoints: 2,
          strategy: 'deduct',
          manualCheck: true,
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
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
            {
              name: 'BBaz',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: true,
            },
          ],
        },
        {
          group: 'C.+',
          points: 0,
          maxPoints: 2,
          strategy: 'deduct',
          manualCheck: false,
          tests: [
            {
              name: 'CFoo',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
            {
              name: 'CBar',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
            {
              name: 'CBaz',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'D.+',
          points: 1,
          maxPoints: 1.5,
          strategy: 'deduct',
          manualCheck: false,
          tests: [
            {
              name: 'DFoo',
              points: 0.5,
              maxPoints: 0.5,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'DBar',
              points: 0,
              maxPoints: 0.5,
              successful: false,
              required: false,
              manualCheck: false,
            },
            {
              name: 'DBaz',
              points: 0.5,
              maxPoints: 0.5,
              successful: true,
              required: false,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'E.+',
          points: 0.5,
          maxPoints: 2,
          strategy: 'deduct',
          manualCheck: false,
          tests: [
            {
              name: 'EFoo',
              points: 0.5,
              maxPoints: 0.5,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'EMorePoints',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
            {
              name: 'EBar',
              points: 0,
              maxPoints: 0.5,
              successful: false,
              required: false,
              manualCheck: false,
            },
            {
              name: 'EBaz',
              points: 0.5,
              maxPoints: 0.5,
              successful: true,
              required: false,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'F.+',
          points: 2,
          maxPoints: 2,
          strategy: 'deduct',
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
