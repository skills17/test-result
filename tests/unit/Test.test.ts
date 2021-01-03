import Test from '../../src/Test';

describe('Test', () => {
  it('returns correct values', () => {
    const test1 = new Test('my-test', 3, false, true);
    const test2 = new Test('my-test', 3, true, false);

    expect(test1.getName()).toEqual('my-test');
    expect(test1.getMaxPoints()).toEqual(3);
    expect(test1.isSuccessful()).toEqual(false);
    expect(test1.isRequired()).toEqual(true);
    expect(test2.isSuccessful()).toEqual(true);
    expect(test2.isRequired()).toEqual(false);
  });

  it('returns 0 points when a test failed', () => {
    const successfulTest = new Test('my-test', 2, true, false);
    const failedTest = new Test('my-test', 2, false, false);

    expect(successfulTest.getPoints()).toEqual(2);
    expect(failedTest.getPoints()).toEqual(0);
  });

  it('sets manual check', () => {
    const test = new Test('my-test', 1, false, false);

    expect(test.requiresManualCheck()).toEqual(false);

    test.setManualCheck(true);

    expect(test.requiresManualCheck()).toEqual(true);
  });

  it('converts to json', () => {
    const successfulTest = new Test('my-test', 2, true, false);
    const failedTest = new Test('failed-test', 2, false, true);
    const extraFailedTest = new Test('extra-failed', 2, true, false);

    extraFailedTest.setManualCheck(true);

    expect(JSON.parse(JSON.stringify(successfulTest))).toStrictEqual({
      name: 'my-test',
      points: 2,
      maxPoints: 2,
      successful: true,
      required: false,
      manualCheck: false,
    });
    expect(JSON.parse(JSON.stringify(failedTest))).toStrictEqual({
      name: 'failed-test',
      points: 0,
      maxPoints: 2,
      successful: false,
      required: true,
      manualCheck: false,
    });
    expect(JSON.parse(JSON.stringify(extraFailedTest))).toStrictEqual({
      name: 'extra-failed',
      points: 2,
      maxPoints: 2,
      successful: true,
      required: false,
      manualCheck: true,
    });
  });
});
