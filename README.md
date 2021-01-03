# skills17/test-result

This package commonly generates and converts test results.
It can be used to abstract logic for the different testing library helper packages.

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
  - [Specific test overrides](#specific-test-overrides)
  - [Converting to JSON](#converting-to-json)
- [License](#license)

## Installation

```bash
npm install @skills17/test-result
```

## Usage

First, create a new instance for every test run:

```typescript
import { TestRun, Group, Strategy, Override } from '@skills17/test-result';

const run = new TestRun();
```

After that, you have to define and add all test groups:

```typescript
/**
 * Group constructor:
 *
 * @param {string}    match           Tests that match this regular expression
 *                                    get added to the group
 * @param {number}    defaultPoints   Points a test within this group will award
 *                                    by default
 * @param {Strategy}  strategy        Either Strategy.Add or Strategy.Deduct
 * @param {string}    [displayName]   Group name that should be used in outputs
 * @param {number}    [maxPoints]     Only for the deduct strategy, a point maximum
 *                                    can be set
 */

run.addGroup(new Group('CountriesIndex.+', 1, Strategy.Add));
```

Once all groups have been added, you can start recording tests:

```typescript
/**
 * recordTest method:
 *
 * @param {string}    name        Test name
 * @param {boolean}   extra       Whether it is an extra test or not
 * @param {boolean}   successful  Whether the test was successful or not
 * @returns {boolean}             False if no matching group was found
 */

run.recordTest('CountriesIndexAll', false, true);
```

After that, points and everything else will get calculated automatically.
To get an overview of available getters and other functions, take a look at the [class implementations](https://github.com/skills17/test-result/tree/master/src).

### Specific test overrides

If specific tests should award more points or have to pass in order that the whole group passes,
overrides can be defined on a group.

```typescript
/**
 * Override constructor:
 *
 * @param {string}  match             The override applies to all tests
 *                                    that match this regular expression
 * @param {boolean} [required=false]  If the test is required for the whole
 *                                    group to pass
 * @param {boolean} [points]          Points this test awards
 */

group.addOverride(new Override('CountriesIndexJson', true, 0));
```

### Converting to JSON

The whole test run can simply be converted to JSON by passing the object to the `JSON.stringify` function:
```typescript
JSON.stringify(run);
```

## License

[MIT](https://github.com/skills17/test-result/blob/master/LICENSE)
