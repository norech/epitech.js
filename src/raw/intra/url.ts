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