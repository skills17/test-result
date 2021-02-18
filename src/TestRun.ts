import Group from './Group';

export default class TestRun {
  private groups: Group[] = [];

  private extraTestRecorded = false;

  private ungroupedTests: string[] = [];

  /**
   * Add a new test group to the run
   *
   * @param group New group to add
   */
  public addGroup(group: Group): void {
    this.groups.push(group);
  }

  /**
   * Records a new test in the run
   *
   * @param fullName Full test name including all groups
   * @param testName Test name only that is used for display
   * @param extra Whether it is an extra test or not
   * @param successful Whether the test was successful or not
   * @returns False if no matching group was found
   */
  public recordTest(
    fullName: string,
    testName: string,
    extra: boolean,
    successful: boolean,
  ): boolean {
    if (extra) {
      this.extraTestRecorded = true;
    }

    const matchedGroup = !!this.groups.find((group) => {
      if (group.matches(fullName)) {
        group.addTest(testName, extra, successful);
        return true;
      }

      return false;
    });

    if (!matchedGroup) {
      this.ungroupedTests.push(fullName);
    }

    return matchedGroup;
  }

  /**
   * Get warnings that help to discover wrong configurations or test runs
   */
  public getWarnings(): string[] {
    const warnings = [];

    // search for groups without any recorded test
    const emptyGroups = this.getGroups().filter((group) => !group.hasTests());
    if (emptyGroups.length > 0) {
      warnings.push(
        `The following groups do not have any test:\n${emptyGroups
          .map((group) => `  - ${group.getDisplayName()}`)
          .join('\n')}`,
      );
    }

    // search for tests that do not have extra tests
    const missingExtraTests = this.getGroups()
      .map((group) =>
        group
          .getMissingExtraTests()
          .map((test) => `  - ${group.getDisplayName()} > ${test.getName()}`),
      )
      .filter((tests) => tests.length > 0);
    if (this.extraTestRecorded && missingExtraTests.length > 0) {
      warnings.push(
        `The following tests do NOT have extra tests and so can NOT be checked for possible cheating:\n${missingExtraTests
          .map((tests) => tests.join('\n'))
          .join('\n')}`,
      );
    }

    // search for extra tests that do not have a normal test
    const missingNormalTests = this.getGroups()
      .map((group) =>
        group.getMissingNormalTests().map((test) => `  - ${group.getDisplayName()} > ${test}`),
      )
      .filter((tests) => tests.length > 0);
    if (missingNormalTests.length > 0) {
      warnings.push(
        `The following extra tests do not belong to a main test and were ignored:\n${missingNormalTests
          .map((tests) => tests.join('\n'))
          .join('\n')}`,
      );
    }

    // search for tests that do not belong to any group
    if (this.ungroupedTests.length > 0) {
      warnings.push(
        `The following tests do not belong to a group and were ignored:\n${this.ungroupedTests
          .map((test) => `  - ${test}`)
          .join('\n')}`,
      );
    }

    return warnings;
  }

  public getGroups(): Group[] {
    return this.groups;
  }

  public hasExtraTest(): boolean {
    return this.extraTestRecorded;
  }

  public getUngroupedTests(): string[] {
    return this.ungroupedTests;
  }

  public toJSON(): Record<string, unknown> {
    const warnings = this.getWarnings();

    return {
      testResults: this.getGroups().filter((group) => group.getTests().length > 0),
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }
}
