# Test Strategy

## Objective

Demonstrate a maintainable automation baseline for the ServeRest application, covering the requested UI and API happy paths while keeping the scenarios independent and suitable for CI execution.

## Coverage

- UI authentication
- UI user registration
- UI product registration
- API user registration
- API authentication
- API product listing

## Automation principles

1. **Independence:** every test prepares its own state when required.
2. **Deterministic data:** dynamic values avoid collisions in the shared environment.
3. **Stable synchronization:** network aliases are used when the business action depends on an asynchronous API call.
4. **Business assertions:** tests validate outcomes, not only that an element was clicked.
5. **Layer separation:** API actions, UI actions, selectors and data generation have separate responsibilities.
6. **Fast setup:** API is used to prepare authenticated UI state instead of chaining UI flows that belong to another test concern.
7. **CI readiness:** the suite can run headlessly and exposes reports/artifacts for investigation.

## Scope decision

The challenge explicitly requests three frontend and three API scenarios. The suite keeps this scope focused rather than adding negative cases solely to increase test count. Additional coverage can be introduced later based on product risk, such as authorization rules, validation messages, duplicate records and product lifecycle operations.

## Known risk

The public ServeRest environment is shared and can be unavailable or changed independently of this repository. Such environmental failures should be distinguished from functional regressions in the application under test.
