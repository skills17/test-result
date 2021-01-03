export default class Override {
  private pattern: RegExp;

  constructor(private match: string, private required: boolean = false, private points?: number) {
    this.pattern = new RegExp(`^${match}$`);
  }

  /**
   * Check if a test matches this override
   *
   * @param match Test name to check
   */
  public matches(match: string): boolean {
    return this.pattern.test(match);
  }

  public getPoints(): number | undefined {
    return this.points;
  }

  public isRequired(): boolean {
    return this.required;
  }
}
