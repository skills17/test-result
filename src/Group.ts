import Strategy from './Strategy';
import Test from './Test';

export default class Group {
  private pattern: RegExp;

  private extraTests: Record<string, boolean> = {};

  private tests: Record<string, Test> = {};

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

    this.tests[name] = new Test(name, this.defaultPoints, successful, false);

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
   * Calculates the scored points
   */
  public getPoints(): number {
    const points = this.getTests().reduce(
      (prev, current) => {
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

    return Math.max(points, 0);
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
}
