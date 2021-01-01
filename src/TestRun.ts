import Group from './Group';

export default class TestRun {
  private groups: Group[] = [];

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
   * @param name Test name
   * @param extra Whether it is an extra test or not
   * @param successful Whether the test was successful or not
   * @returns False if no matching group was found
   */
  public recordTest(name: string, extra: boolean, successful: boolean): boolean {
    return !!this.groups.find((group) => {
      if (group.matches(name)) {
        group.addTest(name, extra, successful);
        return true;
      }

      return false;
    });
  }

  public getGroups(): Group[] {
    return this.groups;
  }
}
