import Override from './Override';
import Strategy from './Strategy';
import Test from './Test';

export default class Group {
  private pattern: RegExp;

  private extraTests: Record<string, boolean> = {};

  private tests: Record<string, Test> = {};

  private overrides: Override[] = [];

  constructor(
    private match: string,
    private defaultPoints: number,
    private strategy: Strategy,
    private displayName?: string,
    private maxPoints?: number,
  ) {
    this.pattern = new RegExp(`^${match}$`);
  }

  /**
   * Add a new normal test to this group
   *
   * @param name Test name
   * @param successful Whether the test was successful or not
   */
  private addNormalTest(name: string, successful: boolean): void {
    if (this.tests[name]) {
      throw new Error(
        `A test with the same name already exists in the same group. Test name: ${name}`,
      );
    }

    const override = this.getOverrideForTest(name);
    this.tests[name] = new Test(
      name,
      override?.getPoints() || this.defaultPoints,
      successful,
      override?.isRequired() || false,
    );

    // if an extra tests exist and that failed while this normal test succeeded,
    // require a manual check
    if (typeof this.extraTests[name] !== 'undefined' && successful && !this.extraTests[name]) {
      this.tests[name].setManualCheck(true);
    }
  }

  /**
   * Add a new extra test to this group
   *
   * @param name Test name
   * @param successful Whether the test was successful or not
   */
  private addExtraTest(name: string, successful: boolean): void {
    if (this.extraTests[name]) {
      throw new Error(
        `An extra test with the same name already exists in the same group. Test name: ${name}`,
      );
    }

    this.extraTests[name] = successful;

    // if the normal test succeeded while this extra test failed, require a manual check
    if (this.tests[name] && this.tests[name].isSuccessful() && !successful) {
      this.tests[name].setManualCheck(true);
    }
  }

  /**
   * Get the override for a specific test if it exists
   *
   * @param name Test name
   */
  private getOverrideForTest(name: string): Override | undefined {
    return this.overrides.find((override) => override.matches(name));
  }

  /**
   * Check if a test matches this group
   *
   * @param match Test name to check
   */
  public matches(match: string): boolean {
    return this.pattern.test(match);
  }

  /**
   * Add a new test to this group
   *
   * @param name Test name
   * @param extra Whether it is an extra test or not
   * @param successful Whether the test was successful or not
   */
  public addTest(name: string, extra: boolean, successful: boolean): void {
    if (extra) {
      this.addExtraTest(name, successful);
    } else {
      this.addNormalTest(name, successful);
    }
  }

  /**
   * Add a new test override
   *
   * @param override Test override
   */
  public addOverride(override: Override): void {
    this.overrides.push(override);
  }

  /**
   * Calculates the scored points
   */
  public getPoints(): number {
    let requiredTestFailed = false;

    const points = this.getTests().reduce(
      (prev, current) => {
        if (current.isRequired() && !current.isSuccessful()) {
          requiredTestFailed = true;
        }

        if (this.strategy === Strategy.Add) {
          return prev + current.getPoints();
        }

        if (current.isSuccessful()) {
          return prev;
        }

        return prev - current.getMaxPoints();
      },
      this.strategy === Strategy.Deduct ? this.getMaxPoints() : 0,
    );

    return requiredTestFailed ? 0 : Math.max(points, 0);
  }

  /**
   * Calculates the maximum possible points
   */
  public getMaxPoints(): number {
    // respect the optional maxPoints value for the deduct strategy
    if (this.strategy === Strategy.Deduct && typeof this.maxPoints !== 'undefined') {
      return this.maxPoints;
    }

    // add all possible points for the tests in this group
    return this.getTests().reduce((prev, current) => prev + current.getMaxPoints(), 0);
  }

  /**
   * Returns the tests that do not have an extra test
   */
  public getMissingExtraTests(): Test[] {
    return Object.keys(this.tests)
      .filter((testName) => typeof this.extraTests[testName] === 'undefined')
      .map((testName) => this.tests[testName]);
  }

  /**
   * Returns the name of extra tests that do not have a normal test
   */
  public getMissingNormalTests(): string[] {
    return Object.keys(this.extraTests).filter(
      (testName) => typeof this.tests[testName] === 'undefined',
    );
  }

  /**
   * Returns whether this group has at least one normal or extra test
   */
  public hasTests(): boolean {
    return Object.keys(this.tests).length > 0 || Object.keys(this.extraTests).length > 0;
  }

  public getDefaultPoints(): number {
    return this.defaultPoints;
  }

  public getStrategy(): Strategy {
    return this.strategy;
  }

  public getDisplayName(): string {
    return this.displayName ?? this.match;
  }

  public getTests(): Test[] {
    return Object.values(this.tests);
  }

  public requiresManualCheck(): boolean {
    return !!this.getTests().find((test) => test.requiresManualCheck());
  }

  public toJSON(): Record<string, unknown> {
    return {
      group: this.getDisplayName(),
      points: this.getPoints(),
      maxPoints: this.getMaxPoints(),
      strategy: this.getStrategy(),
      manualCheck: this.requiresManualCheck(),
      tests: this.getTests(),
    };
  }
}
