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
    run.recordTest('AFoo', 'Foo', false, true);
    run.recordTest('BFoo', 'Foo', false, true);
    run.recordTest('BBar', 'Bar', false, true);
    run.recordTest('BBaz', 'Baz', false, false);
    run.recordTest('CFoo', 'Foo', false, true);
    run.recordTest('CBar', 'Bar', false, true);
    run.recordTest('DFoo', 'Foo', false, false);
    run.recordTest('EFoo', 'Foo', false, true); // this does not have an extra test and should trigger a warning
    run.recordTest('EBar', 'Bar', false, false);
    run.recordTest('FFoo', 'Foo', false, true); // this does not have an extra test and should trigger a warning
    run.recordTest('FBar', 'Bar', false, false); // this does not have an extra test and should trigger a warning

    // extra tests
    run.recordTest('AFoo', 'Foo', true, true);
    run.recordTest('BFoo', 'Foo', true, true);
    run.recordTest('BBar', 'Bar', true, true);
    run.recordTest('BBaz', 'Baz', true, false);
    run.recordTest('CFoo', 'Foo', true, true);
    run.recordTest('CBar', 'Bar', true, true);
    run.recordTest('DFoo', 'Foo', true, true);
    run.recordTest('EBar', 'Bar', true, true);

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
        {
          group: 'B.+',
          points: 2,
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
              points: 1,
              maxPoints: 1,
              successful: true,
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
              name: 'Bar',
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
              name: 'Foo',
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
          ],
        },
      ],
      warnings: [
        'The following tests do NOT have extra tests and so can NOT be checked for possible cheating:\n  - E.+ > Foo\n  - F.+ > Foo\n  - F.+ > Bar',
      ],
    });
  });
});
