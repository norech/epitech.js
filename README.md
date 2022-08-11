# epitech.js

Wrapper for Epitech intranet for NodeJS with complete TypeScript typings.

## Install

```bash
npm install epitech.js
```

## Getting started

You might want to take a look at files in [`src/examples`](./src/examples).

You may also want to have a look at the Usage section below to discover how login to the intranet.

## Usage

### Login to the intranet (Puppeteer auth provider)

Epitech.js can be used with [Puppeteer](https://puppeteer.dev) to login to the intranet without using an autologin link and without having to renew the session manually.

To do so, you need to install an additional dependency:

```bash
npm install @epitech.js/puppeteer-auth-provider
```

You will then need to import the `RawIntra` and `PuppeteerAuthProvider` classes:

```ts
import { RawIntra } from 'epitech.js';
import { PuppeteerAuthProvider } from '@epitech.js/puppeteer-auth-provider';

// or

const { RawIntra } = require('epitech.js');
const { PuppeteerAuthProvider } = require('@epitech.js/puppeteer-auth-provider');
```

The `RawIntra` class will provide you a low-abstraction access to the Intranet endpoints.

The `PuppeteerAuthProvider` class will provide you a way to login to the intranet for a long period of time.

> You may want to read the [@epitech.js/puppeteer-auth-provider](https://github.com/norech/epitech.js-puppeteer-auth-provider) documentation to know how to make adjustments and **[how to fix common issues](https://github.com/norech/epitech.js-puppeteer-auth-provider#troubleshooting)**.

```js
const intra = new RawIntra({
    provider: new PuppeteerAuthProvider({
        // path to the file where the auth data will be stored
        storageFilePath: './storage.json',

        // ... additional options for the PuppeteerAuthProvider are available
    })
});
```

You can then use the `RawIntra` class to access the intranet endpoints! Feel free to have a look at the [Documentation](#documentation) section to see the available endpoints.

Puppeteer is only one way to login to the intranet with epitech.js, but not the only one! See the sections below to learn more about other ways to login to the intranet and access endpoints with epitech.js.

### Login to the intranet (custom auth provider - cookie auth)

Import the `RawIntra` class, that provides you a low-abstraction access to the Intranet endpoints:
```ts
import { RawIntra } from "epitech.js";  // TypeScript / ES6
// or
const { RawIntra } = require("epitech.js");  // Classic NodeJS
```

You will also need to use an auth provider to get an access cookie.

> See the [auth providers](#auth-providers) section for more information on how to create your own auth provider.


Here is an example provider, the access cookie can be grabbed from a browser authenticated to the intranet (Inspector -> Storage -> Cookies -> `user` -> Value).

Please note that authentication cookies are only valid for a limited time (usually up to a week), which is why you may only directly use this provider for testing purposes or short automation scripts.

```ts
class MyProvider {
    async refresh() {
        return "{authentication cookie}";
    }
}
```

Once you have the access cookie, you can create a `RawIntra` instance:

```ts
const intra = new RawIntra({
    provider: new MyProvider(),
});
```

And now you can access the intranet endpoints!

### Login to the intranet (autologin - legacy)

> Since August 2022, autologin access doesn't work any more and is locked behind a whitelist.
> You will probably need to use an auth provider in order to manually provide and refresh authentication cookies instead.

Go into `https://intra.epitech.eu/admin/autolog` and grab your autologin link.

Import the `RawIntra` class, that provides you a low-abstraction access to the Intranet endpoints:
```ts
import { RawIntra } from "epitech.js";  // TypeScript / ES6
// or
const { RawIntra } = require("epitech.js");  // Classic NodeJS
```

```ts
const intra = new RawIntra({
    autologin: "https://intra.epitech.eu/auth-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
});
```

## Safety concerns

This section describes some safety concerns regarding the usage of previous versions of this library.

Old versions of epitech.js did not have any security measures or sanity checks built-in. It is therefore recommended having a recent version of epitech.js (at least `v0.1.7`).

Since `v0.2.0`, epitech.js performs an autologin link validation. Previous versions of epitech.js did not perform this check, which could lead to security issues when using invalid autologin links.

Since `v0.2.0`, epitech.js provides an `indirect` authentication strategy to avoid leaking your autologin link. This strategy performs an authentication request separately from your requests. As of this release, it is the default strategy. Previous versions used a `direct` strategy, which was insecure.

## Documentation

### Raw classes (bindings)

Here is a table matching each method of the raw classes and the corresponding endpoint:

#### RawIntra (`intra.epitech.eu`)

| Binding                        | Endpoint                                                       |
|--------------------------------|----------------------------------------------------------------|
| `getDashboard`                 | `/`                                                            |
| `getUser`                      | `/user/:user` or `/user`                                       |
| `getUserDetails`               | `/user/:user/print/`                                           |
| `getUserNetsoul`               | `/user/:user/netsoul`                                          |
| `getUserPartners`              | `/user/:user/binome`                                           |
| `getUserEducationalOverview`   | none (scraped from `/user/:user/#!/pedago`)                    |
| `getUserAbsences`              | `/user/:user/absences`                                         |
| `getPlanning`                  | `/planning/load`                                               |
| `getModuleBoard`               | `/module/board`                                                |
| `filterCourses`                | `/course/filter`                                               |
| `getModule`                    | `/module/:year/:module/:instance`                              |
| `getModuleRegistered`          | `/module/:year/:module/:instance/registered`                   |
| `getActivity`                  | `/module/:year/:module/:instance/:activity`                    |
| `getActivityAppointments`      | `/module/:year/:module/:instance/:activity/rdv`                |
| `getProject`                   | `/module/:year/:module/:instance/:activity/project`            |
| `getProjectRegistered`         | `/module/:year/:mod/:ins/:act/project/registered`              |
| `getProjectUnregistered`       | `/module/:year/:mod/:ins/:act/project/exportunregistered`      |
| `getProjectFiles`              | `/module/:year/:mod/:ins/:act/project/file`                    |
| `getEventRegistered`           | `/module/:year/:mod/:ins/:act/:event/registered`               |
| `getInternships`               | `/stage`                                                       |
| `getAutologin`                 | `/admin/autologin`                                             |

| Binding                        | Endpoint                                                       |
|--------------------------------|----------------------------------------------------------------|
| `registerEventByUrl`           | `/module/:year/:mod/:ins/:act/:event/register`                 |
| `unregisterEventByUrl`         | `/module/:year/:mod/:ins/:act/:event/unregister`               |
| `registerProjectByUrl`         | `/module/:year/:mod/:ins/:act/project/register`                |
| `registerProjectGroupByUrl`    | `/module/:year/:mod/:ins/:act/project/register`                |
| `destroyProjectGroupByUrl`     | `/module/:year/:mod/:ins/:act/project/destroygroup`            |
| `joinGroupByUrl`               | `/module/:year/:mod/:ins/:act/project/confirmjoingroup`        |
| `declineJoinGroupByUrl`        | `/module/:year/:mod/:ins/:act/project/declinejoingroup`        |
| `leaveGroupByUrl`              | `/module/:year/:mod/:ins/:act/project/confirmleavegroup`       |

> Note: The same endpoints can be used to perform different actions or fetch different data, as the parameters or the payloads can be different.


### Classes

#### `RawIntra`

##### `getDashboard(): Promise<RawDashboard>`

Get the dashboard information.

##### `getUser(login?: string): Promise<RawUser>`

Get the user overall information.

If login is not provided, the current user will be used.

If login is provided and is not the current user, you might need additional permissions.

##### `getUserDetails(login: string): Promise<RawUserDetails>`

Get the detailed profile of the user. If the specified user is not the current user, you might need additional permissions.

##### `getUserNetsoul(login: string): Promise<RawUser>`

Get the user netsoul stats. If the specified user is not the current user, you might need additional permissions.

##### `getUserPartners(login: string): Promise<RawUserPartnersOutput>`

Get the other users with which the user has been with in projects and/or activities. If the specified user is not the current user, you might need additional permissions.

##### `getUserEducationalOverview(login: string): Promise<RawUserEducationalUpdate[]>`

Get the educational history of the specified user (courses changes, semester changes, location changes, ...). If the specified user is not the current user, you might need additional permissions.

Note: The current implementation relies on JSON extraction and scraping techniques since no endpoint is available.

##### `getUserAbsences(login: string): Promise<RawUserAbsencesOutput>`

Get the absences of the user. If the specified user is not the current user, you might need additional permissions.

##### `getPlanning(start?: Date, end?: Date): Promise<RawPlanningElement[]>`

Gets the planning between the specified dates, both parameters are required to show planning in a range.

Otherwise, the full year planning will be loaded.

##### `getModuleBoard(start: Date, end: Date): Promise<RawModuleBoardActivity[]>`

Get every modules' activities between the start date and the end date.

##### `filterCourses(filter: RawCourseFilters): Promise<RawCourseFilterOutput>`

Get the modules matching the specified filter.

Filter format:
```ts
{
    preload?: boolean;
    locations?: string[],
    courses?: `${string}/${string}`[],
    scolaryears?: number[]
}
```

Example usage:
```ts
const coursesPromise = intra.filterCourses({
    locations: [ "FR", "FR/PAR" ],
    courses: [ "bachelor/classic" ],
    scolaryears: [ 2021 ]
});
```

##### `getModule({ scolaryear, module, instance }): Promise<RawModule>`

Get the specified module.

##### `getModuleByUrl(url: ModuleUrl | string): Promise<RawModule>`

Get the specified module by url.

##### `getModuleRegistered({ scolaryear, module, instance }): Promise<RawModuleRegisteredUser[]>`

Get the registered users for a module.

##### `getModuleRegisteredByUrl(url: ModuleUrl | string): Promise<RawModuleRegisteredUser[]>`

Get the registered users for a module by module url.

##### `getActivity({ scolaryear, module, instance, activity }): Promise<RawActivity>`

Get the activity information.

##### `getActivityByUrl(url): Promise<RawActivity>`

Get the activity information by activity url.

##### `getActivityAppointments({ scolaryear, module, instance, activity }): Promise<RawModuleActivityAppointment>`

Get the activity appointments (rdv).

##### `getActivityAppointmentsByUrl(url): Promise<RawModuleActivityAppointment>`

Get the activity appointments (rdv) by activity url.

##### `getProject({ scolaryear, module, instance, activity }): Promise<RawProject>`

Get the project.

##### `getProjectByUrl(url): Promise<RawProject>`

Get the project by project or activity url.

##### `getProjectRegistered({ scolaryear, module, instance, activity }): Promise<RawProjectRegisteredGroup[]>`

Get the registered groups for the project.

##### `getProjectRegisteredByUrl(url): Promise<RawProjectRegisteredGroup[]>`

Get the registered groups for the project by project or activity url.

##### `getProjectUnregistered({ scolaryear, module, instance, activity }): Promise<string[]>`

Get an array of unregistered users logins for the project.

##### `getProjectUnregisteredByUrl(url): Promise<string[]>`

Get an array of unregistered users logins for the project by project or activity url.

##### `getProjectFiles({ scolaryear, module, instance, activity }): Promise<RawProjectFile[]>`

Get an array of files for the project.

##### `downloadFile(url): Promise<stream>`

Download a file from the intranet by its url.

The file will be downloaded and returned as an axios stream, which can be then
be handled. See [the file download example](./src/examples/fileDownload.ts).

##### `getProjectFilesByUrl(url): Promise<RawProjectFile[]>`

Get an array of files for the project by project or activity url.

##### `getEventRegistered({ scolaryear, module, instance, activity, event }): Promise<RawEventRegisteredUser[]>`

Get the users registered to the event.

##### `getEventRegisteredByUrl(eventUrl): Promise<RawEventRegisteredUser[]>`

Get the users registered to the event by url.

##### `getInternships(): Promise<RawInternshipOutput>`

Get the internships for current user.

##### `getAutologin(): Promise<string>`

Get autologin link for the current session.

##### `registerEventByUrl(eventUrl): Promise<void>`

Register to event by event url.

##### `unregisterEventByUrl(eventUrl): Promise<void>`

Unregister to event by event url.

##### `registerProjectByUrl(projectUrl): Promise<void>`

Register to project by project url.

##### `registerProjectGroupByUrl(projectUrl, { title: string, membersLogins: string[] }): Promise<void>`

Register a project group by project url.

##### `destroyProjectGroupByUrl(projectUrl, groupCode?: string): Promise<void>`

Destroy a project group by project url and group code (searched if not specified).

##### `joinGroupByUrl(projectUrl, userLogin?: string): Promise<void>`

Make the specified user join a project group by project url.

If user login is not specified, current user login is used. Additional permissions might be required if user login is not the current user.

##### `declineJoinGroupByUrl(projectUrl): Promise<void>`

Decline joining the inviting group for this project, by project url.

##### `leaveGroupByUrl(projectUrl, userLogin?: string): Promise<void>`

Make the specified user leave a project group by project url.

If user login is not specified, current user login is used. Additional permissions might be required if user login is not the current user.

##### `solveUrl(url: string, validTypes: string[] = ["all"]): string`

Get the underlying route from specified intranet URL. Will strip the autologin part if present.

Valid types: `"all", "module", "project", "activity"`.

Unless `"all"` is specified in the valid types, path checks will be performed.

In case of no match with any valid types provided, if possible, a path transformation will be attempted (e.g. `activity` -> `project`).

If url doesn't match any valid types and the path transformation fails, an error is thrown.

##### `solveModuleUrl({ scolaryear, module, instance }): ActivityUrl`

Get the module route using the provided information.

##### `solveActivityUrl({ scolaryear, module, instance, activity }): ActivityUrl`

Get the activity route using the provided information.

##### `solveProjectUrl({ scolaryear, module, instance, activity }): ProjectUrl`

Get the project route using the provided information.

##### `getRequestProvider(): IntraRequestProvider`

Get the request provider that performs the API calls.


#### `IntraRequestProvider`

##### `get(route: string, config?: AxiosRequestConfig): Promise<AxiosResponse>`

##### `post(route: string, body: any, config?: AxiosRequestConfig): Promise<AxiosResponse>`


## Auth Providers

Auth providers are used to provide authentication cookies to epitech.js in order to perform API calls.

An auth provider is a class that implements the `AuthProvider` interface.

#### `AuthProvider`
##### `refresh(): Promise<string>` - Refresh the authentication cookie.
Returns a promise that resolves to the new authentication cookie.
Is called a first time before the first API call, and then each time the authentication cookie has expired.

Please note that if a request still fails after a refresh, no further refreshes will be made until the next request is done and the current request will fail.
