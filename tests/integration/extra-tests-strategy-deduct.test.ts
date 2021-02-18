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
    groupE.addOverride(new Override('MorePoints', false, 1));
    run.addGroup(groupE);
    run.addGroup(new Group('F.+', 1, Strategy.Deduct));

    // normal tests

    // group A: should result in 2/3 as ABar deducts 1 point
    run.recordTest('AFoo', 'Foo', false, true);
    run.recordTest('ABar', 'Bar', false, false);
    run.recordTest('ABaz', 'Baz', false, true);

    // group B: should result in 1/2 as BBar deducts 1 point and max is set to 2
    run.recordTest('BFoo', 'Foo', false, true);
    run.recordTest('BBar', 'Bar', false, false);
    run.recordTest('BBaz', 'Baz', false, true);

    // group C: should result in 0/2 as a value below 0 is not possible
    run.recordTest('CFoo', 'Foo', false, false);
    run.recordTest('CBar', 'Bar', false, false);
    run.recordTest('CBaz', 'Baz', false, false);

    // group D: should result in 1/1.5 as default points is 0.5
    run.recordTest('DFoo', 'Foo', false, true);
    run.recordTest('DBar', 'Bar', false, false);
    run.recordTest('DBaz', 'Baz', false, true);

    // group E: should result in 0.5/2 as one test deducts more points
    run.recordTest('EFoo', 'Foo', false, true);
    run.recordTest('EMorePoints', 'MorePoints', false, false);
    run.recordTest('EBar', 'Bar', false, false);
    run.recordTest('EBaz', 'Baz', false, true);

    // group F: should result in 2/2
    run.recordTest('FFoo', 'Foo', false, true);
    run.recordTest('FBar', 'Bar', false, true);

    // extra tests
    run.recordTest('AFoo', 'Foo', true, true);
    run.recordTest('ABar', 'Bar', true, true);
    run.recordTest('ABaz', 'Baz', true, true);
    run.recordTest('BFoo', 'Foo', true, true);
    run.recordTest('BBar', 'Bar', true, true);
    run.recordTest('BBaz', 'Baz', true, false);
    run.recordTest('CFoo', 'Foo', true, true);
    run.recordTest('CBar', 'Bar', true, true);
    run.recordTest('CBaz', 'Baz', true, true);
    run.recordTest('DFoo', 'Foo', true, true);
    run.recordTest('DBar', 'Bar', true, true);
    run.recordTest('DBaz', 'Baz', true, true);
    run.recordTest('EFoo', 'Foo', true, true);
    run.recordTest('EMorePoints', 'MorePoints', true, true);
    run.recordTest('EBar', 'Bar', true, true);
    run.recordTest('EBaz', 'Baz', true, true);
    run.recordTest('FFoo', 'Foo', true, true);
    run.recordTest('FBar', 'Bar', true, true);

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
              name: 'Baz',
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
              name: 'Baz',
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
              name: 'Foo',
              points: 0,
              maxPoints: 1,
              successful: false,
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
              name: 'Baz',
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
              name: 'Foo',
              points: 0.5,
              maxPoints: 0.5,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Bar',
              points: 0,
              maxPoints: 0.5,
              successful: false,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Baz',
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
              name: 'Foo',
              points: 0.5,
              maxPoints: 0.5,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'MorePoints',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Bar',
              points: 0,
              maxPoints: 0.5,
              successful: false,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Baz',
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
          ],
        },
      ],
    });
  });
});
