import { ActivityCode, EventCode, InstanceCode, ModuleCode } from "../..";

export type UrlPathType = "all" | "project" | "projectfile" | "module" | "activity" | "event";

export type ModuleUrl   = `/module/${number}/${ModuleCode}/${InstanceCode}/`
| `/module/${number}/${ModuleCode}/${InstanceCode}`;

export type ActivityUrl = `${ModuleUrl}/${ActivityCode}`
| `${ModuleUrl}/${ActivityCode}/`;

export type EventUrl = `${ModuleUrl}/${ActivityCode}/${EventCode}`
| `${ModuleUrl}/${ActivityCode}/${EventCode}/`;

export type ProjectUrl  = `${ActivityUrl}/project`
| `${ActivityUrl}/project/`;

export type ProjectFileUrl  = `${ActivityUrl}/project/file/${string}`;

export function isModuleUrl(str: string): str is ModuleUrl {
    return /^\/module\/[0-9]{4}\/[A-Z]-[A-Z]{3}-[0-9]{3}\/[A-Z]{3}-[0-9]+-[0-9]+[\/]?$/.test(str);
}

export function isProjectUrl(str: string): str is ProjectUrl {
    return /^\/module\/[0-9]{4}\/[A-Z]-[A-Z]{3}-[0-9]{3}\/[A-Z]{3}-[0-9]+-[0-9]+\/acti-[0-9]+\/project[\/]?$/.test(str);
}

export function isProjectFileUrl(str: string): str is ProjectFileUrl {
    return /^\/module\/[0-9]{4}\/[A-Z]-[A-Z]{3}-[0-9]{3}\/[A-Z]{3}-[0-9]+-[0-9]+\/acti-[0-9]+\/project\/file\/([a-zA-Z0-9.\- _~!$&'()*+,;=:@\/%]*)+$/.test(str);
}

export function isActivityUrl(str: string): str is ActivityUrl {
    return /^\/module\/[0-9]{4}\/[A-Z]-[A-Z]{3}-[0-9]{3}\/[A-Z]{3}-[0-9]+-[0-9]+\/acti-[0-9]+[\/]?$/.test(str);
}

export function isEventUrl(str: string): str is EventUrl {
    return /^\/module\/[0-9]{4}\/[A-Z]-[A-Z]{3}-[0-9]{3}\/[A-Z]{3}-[0-9]+-[0-9]+\/acti-[0-9]+\/event-[0-9]+[\/]?$/.test(str);
}

type ExcludeArrayElement<T extends string[], U>
    = T extends (infer R)[] ? R extends U ? never : R[] : never;

export type SolvedUrl<T extends UrlPathType[]> = T extends (infer R)[]
    ? R extends "all" ? string
    : R extends "project" ? ProjectUrl | SolvedUrl<ExcludeArrayElement<T, "project">>
    : R extends "projectfile" ? ProjectUrl | SolvedUrl<ExcludeArrayElement<T, "projectfile">>
    : R extends "module" ? ModuleUrl | SolvedUrl<ExcludeArrayElement<T, "module">>
    : R extends "activity" ? ActivityUrl | SolvedUrl<ExcludeArrayElement<T, "activity">>
    : R extends "event" ? EventUrl | SolvedUrl<ExcludeArrayElement<T, "event">>
    : never /*gonna give you up*/
    : never /*gonna let you down*/;

type IncludesPathType<T extends UrlPathType[], U extends UrlPathType>
    = T[number] extends U ? true : false;

export function includesPathType<T extends UrlPathType[], U extends UrlPathType>(
    pathTypes: T, pathType: U): IncludesPathType<T, U> {
        return (pathTypes.indexOf(pathType) !== -1) as IncludesPathType<T, U>;
}
