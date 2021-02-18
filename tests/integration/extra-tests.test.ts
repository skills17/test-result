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
    run.recordTest('AFoo', 'Foo', false, true);
    run.recordTest('BFoo', 'Foo', false, true);
    run.recordTest('BBar', 'Bar', false, true);
    run.recordTest('BBaz', 'Baz', false, false);
    run.recordTest('CFoo', 'Foo', false, true);
    run.recordTest('CBar', 'Bar', false, true);
    run.recordTest('DFoo', 'Foo', false, false);
    run.recordTest('EFoo', 'Foo', false, false);
    run.recordTest('EBar', 'Bar', false, false);

    // extra tests
    run.recordTest('AFoo', 'Foo', true, true);
    run.recordTest('BFoo', 'Foo', true, true);
    run.recordTest('BBar', 'Bar', true, true);
    run.recordTest('BBaz', 'Baz', true, false);
    run.recordTest('CFoo', 'Foo', true, true);
    run.recordTest('CBar', 'Bar', true, true);
    run.recordTest('DFoo', 'Foo', true, true);
    run.recordTest('EFoo', 'Foo', true, true);
    run.recordTest('EBar', 'Bar', true, true);

    expect(run.hasExtraTest()).toEqual(true);

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
          points: 0,
          maxPoints: 2,
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
    });
  });
});
