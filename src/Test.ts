export default class Test {
  private manualCheck = false;

  constructor(
    private name: string,
    private maxPoints: number,
    private successful: boolean,
    private required: boolean,
  ) {}

  public getName(): string {
    return this.name;
  }

  public getPoints(): number {
    return this.successful ? this.maxPoints : 0;
  }

  public getMaxPoints(): number {
    return this.maxPoints;
  }

  public isSuccessful(): boolean {
    return this.successful;
  }

  public isRequired(): boolean {
    return this.required;
  }

  public setManualCheck(manualCheck: boolean): void {
    this.manualCheck = manualCheck;
  }

  public requiresManualCheck(): boolean {
    return this.manualCheck;
  }

  public toJSON(): Record<string, unknown> {
    return {
      name: this.getName(),
      points: this.getPoints(),
      maxPoints: this.getMaxPoints(),
      successful: this.isSuccessful(),
      required: this.isRequired(),
      manualCheck: this.requiresManualCheck(),
    };
  }
}
