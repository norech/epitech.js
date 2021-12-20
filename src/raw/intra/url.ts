import { ActivityCode, InstanceCode, ModuleCode } from "../..";

export type UrlPathType = "all" | "project" | "module" | "activity";

export type ModuleUrl   = `/module/${number}/${ModuleCode}/${InstanceCode}/`
| `/module/${number}/${ModuleCode}/${InstanceCode}`;

export type ActivityUrl = `${ModuleUrl}/${ActivityCode}`
| `${ModuleUrl}/${ActivityCode}/`;

export type ProjectUrl  = `${ActivityUrl}/project`
| `${ActivityUrl}/project/`;

export function isModuleUrl(str: string): str is ModuleUrl {
    return /^\/module\/[0-9]{4}\/[A-Z]-[A-Z]{3}-[0-9]{3}\/[A-Z]{3}-[0-9]+-[0-9]+[\/]?$/.test(str);
}

export function isProjectUrl(str: string): str is ProjectUrl {
    return /^\/module\/[0-9]{4}\/[A-Z]-[A-Z]{3}-[0-9]{3}\/[A-Z]{3}-[0-9]+-[0-9]+\/acti-[0-9]+\/project[\/]?$/.test(str);
}

export function isActivityUrl(str: string): str is ActivityUrl {
    return /^\/module\/[0-9]{4}\/[A-Z]-[A-Z]{3}-[0-9]{3}\/[A-Z]{3}-[0-9]+-[0-9]+\/acti-[0-9]+[\/]?$/.test(str);
}

type ExcludeArrayElement<T extends string[], U> = T[number] extends U ? never : T;

export type SolvedUrl<T extends UrlPathType[]> = T extends ["all"] ? string
    : T[number] extends "project" ? ProjectUrl | SolvedUrl<ExcludeArrayElement<T, "project">>
    : T[number] extends "module" ? ModuleUrl | SolvedUrl<ExcludeArrayElement<T, "module">>
    : T[number] extends "activity" ? ActivityUrl | SolvedUrl<ExcludeArrayElement<T, "activity">>
    : never;

type IncludesPathType<T extends string[], U extends UrlPathType> = T[number] extends U ? true : false;

export function includesPathType<T extends string[], U extends UrlPathType>(pathTypes: T, pathType: U): IncludesPathType<T, U> {
    return (pathTypes.indexOf(pathType) !== -1) as IncludesPathType<T, U>;
}