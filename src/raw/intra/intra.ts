import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ActivityCode, EventCode, InstanceCode, ModuleCode } from "../../common";
import { RawActivity } from "./activity";
import { RawDashboard } from "./dashboard";
import { RawCourseFilterOutput, RawModule, RawModuleActivityAppointment, RawModuleBoardActivity, RawModuleRegisteredUser } from "./module";
import { RawPlanningElement } from "./planning";
import { RawUser, RawUserAbsencesOutput, RawUserDetails, RawUserEducationalUpdate, RawUserPartnersOutput } from "./user";
import { load as loadCheerio } from "cheerio";
import { RawProject, RawProjectFile, RawProjectRegisteredGroup } from "./project";
import { stringify } from "querystring";
import { RawInternshipOutput } from "./internship";
import { esc, isEventUrl, RawEventRegisteredUser, SolvedUrl } from ".";
import { isActivityUrl, isModuleUrl, isProjectUrl, includesPathType, UrlPathType, ActivityUrl, ModuleUrl, ProjectUrl, isProjectFileUrl } from "./url";
import { canBeIntraError, IntraError } from "./common";

export class IntraRequestProvider {
    protected endpoint = "https://intra.epitech.eu/";
    protected client: AxiosInstance;
    protected cookies: {[key: string]: string} = {};
    protected throwIntraError: boolean = true;

    constructor(autologin: string) {
        let autologinUrl: string;
        try {
            if (/^auth-[a-fA-F0-9]+$/.test(autologin)) {
                autologinUrl = "https://intra.epitech.eu/" + autologin;
            } else {
                const url = new URL(autologin);
                if (!/^\/auth-[a-fA-F0-9]+\/?$/.test(url.pathname)) {
                    throw "Invalid path";
                }
                autologinUrl = "https://intra.epitech.eu" + url.pathname;
            }
        } catch (e) {
            throw new IntraError({ message: "Invalid autologin: " + e });
        }

        this.endpoint = autologinUrl;
        this.client = axios.create({
            validateStatus: (status) => status < 500,
            baseURL: this.endpoint,
            timeout: 30 * 1000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }

    getClient() {
        return this.client;
    }

    async setTimezone(value: string) {
        await this.setCookie("tz", value);
    }

    disableThrowIntraError() {
        this.throwIntraError = false;
    }

    async setCookie(key: string, value: string) {
        let cookieString = "";

        this.cookies[key] = value;
        for (const key in this.cookies) {
            cookieString += esc`${key}=${this.cookies[key]}; `;
        }
        this.client.defaults.headers.Cookie = cookieString;
    }

    async get(route: string, config?: AxiosRequestConfig) {
        const out = await this.client.get(route, config);
        if (this.throwIntraError && canBeIntraError(out.data)) {
            throw new IntraError(out.data);
        }
        return out;
    }

    async json(route: string, config?: AxiosRequestConfig) {
        if (route.includes("?")) {
            route += "&"
        } else {
            route += "?"
        }
        route += "format=json";

        const out = await this.get(route, config);
        if (this.throwIntraError && typeof out.data === "string") {
            throw new IntraError({
                error: "Invalid response",
                message: out.data
            });
        }
        return out;
    }

    async post(route: string, body: any, config?: AxiosRequestConfig) {
        if (route.includes("?")) {
            route += "&"
        } else {
            route += "?"
        }
        route += "format=json";

        body = body ? stringify(body) : undefined;
        const out = await this.client.post(route, body, config);
        if (this.throwIntraError && canBeIntraError(out.data)) {
            throw new IntraError(out.data);
        }
        return out;
    }

    async getStream(route: string, config?: AxiosRequestConfig) {
        return this.client.get(route, {
            responseType: "stream",
            headers: {
                "Accept": "application/octet-stream",
                "Content-Type": "application/octet-stream"
            },
            ...config
        });
    }
}

export interface RawIntraConfig {
    autologin: string,
    timezone?: string,
    noThrowIntraError?: boolean
}

export interface RawCourseFilters {
    preload?: boolean;
    locations?: string[],
    courses?: `${string}/${string}`[],
    scolaryears?: number[]
}

export class RawIntra {
    protected request;

    constructor(config: RawIntraConfig) {
        this.request = new IntraRequestProvider(config.autologin);

        if (config.timezone) {
            this.request.setTimezone(config.timezone);
        }

        if (config.noThrowIntraError) {
            this.request.disableThrowIntraError();
        }
    }

    solveUrl<T extends UrlPathType[]>(url: string, validTypes?: T | undefined): SolvedUrl<T> {
        if (url.startsWith("/"))
            url = "https://intra.epitech.eu" + url;
        else if (!/^https?:\/\//.test(url)) // doesn't start with http or https
            url = "http://intra.epitech.eu/" + url;

        const uri = new URL(url);
        let pathname = uri.pathname;
        let i = pathname.indexOf("/", 1);

        if (pathname.startsWith("/auth-") && i !== -1) { // autologin link
            pathname = pathname.slice(i);
        }
        if (pathname.endsWith("/")) {
            pathname = pathname.slice(0, -1);
        }

        if (!validTypes || includesPathType(validTypes, "all"))
            return pathname as SolvedUrl<T>;

        if (includesPathType(validTypes, "module") && isModuleUrl(pathname))
            return pathname as SolvedUrl<T>;
        if (includesPathType(validTypes, "activity") && isActivityUrl(pathname))
            return pathname as SolvedUrl<T>;
        if (includesPathType(validTypes, "project") && isProjectUrl(pathname))
            return pathname as SolvedUrl<T>;
        if (includesPathType(validTypes, "projectfile") && isProjectFileUrl(pathname))
            return pathname as SolvedUrl<T>;
        if (includesPathType(validTypes, "event") && isEventUrl(pathname))
            return pathname as SolvedUrl<T>;

        if (includesPathType(validTypes, "project") && isActivityUrl(pathname))
            return (pathname + "/project/") as SolvedUrl<T>;

        if (includesPathType(validTypes, "projectfile") && isProjectFileUrl(pathname + "/"))
            return (pathname + "/") as SolvedUrl<T>;
        if (includesPathType(validTypes, "projectfile") && isProjectUrl(pathname))
            return (pathname + "/file/") as SolvedUrl<T>;
        if (includesPathType(validTypes, "projectfile") && isActivityUrl(pathname))
            return (pathname + "/project/file/") as SolvedUrl<T>;

        try {
            const lastSlash = pathname.lastIndexOf("/");
            if (lastSlash > 0) {
                return this.solveUrl<T>(pathname.slice(0, lastSlash), validTypes);
            }
        } catch (e) {
            // well, in either case, it will be an invalid path error
        }

        throw new Error("Unexpected path: " + pathname + ". "
            + "Expected path type: " + validTypes.join(", "));
    }

    solveModuleUrl({ scolaryear, module, instance }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
    }) {
        return esc<ModuleUrl>`/module/${scolaryear}/${module}/${instance}`;
    }

    solveActivityUrl({ scolaryear, module, instance, activity }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
    }) {
        return esc<ActivityUrl>`/module/${scolaryear}/${module}/${instance}/${activity}`;
    }

    solveProjectUrl({ scolaryear, module, instance, activity }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
    }) {
        return esc<ProjectUrl>`/module/${scolaryear}/${module}/${instance}/${activity}/project`;
    }

    getRequestProvider() {
        return this.request;
    }

    async getDashboard(): Promise<RawDashboard> {
        const { data } = await this.request.json("/");
        return data;
    }

    async getUser(login?: string): Promise<RawUser> {
        login = login?.replace(/[?/#]+/g, "");
        const { data } = await this.request.json(
            login ? esc`/user/${login}/` : `/user/`
        );
        return data;
    }

    async getUserNetsoul(login: string): Promise<[number, number, number, number, number, number][]> {
        login = login?.replace(/[?/#]+/g, "");
        const { data } = await this.request.json(esc`/user/${login}/netsoul`);
        return data;
    }

    async getUserPartners(login: string): Promise<RawUserPartnersOutput> {
        login = login?.replace(/[?/#]+/g, "");
        const { data } = await this.request.json(esc`/user/${login}/binome`);
        return data;
    }

    async getUserEducationalOverview(login: string): Promise<RawUserEducationalUpdate[]> {
        const { data } = await this.request.get(`/user/${login}/`, {
            headers: {
                'Accept': 'text/html',
                'Content-Type': 'text/html'
            }
        });
        const $ = loadCheerio(data, { xmlMode: false });
        const scripts = $("script");
        const regex = /<!--\s+window\.user(?:.|\n)+history:(\[\{"scolaryear":.+}])(?:\s|\n)+\}\);\s+\/\/-->/;
        const scrapedScript = scripts.filter((i, s) => regex.test($(s).toString())).first();
        if (scrapedScript === null)
            throw new EvalError("Expected script was not found on the intranet");
        const scrapedString = regex.exec(scrapedScript.toString())!;
        return JSON.parse(scrapedString[1]);
    }

    async getUserAbsences(login: string): Promise<RawUserAbsencesOutput> {
        login = login?.replace(/[?/#]+/g, "");
        const { data } = await this.request.json(
            esc`/user/${login}/notification/missed/`
        );
        return data;
    }

    async getUserDetails(login: string): Promise<RawUserDetails> {
        login = login?.replace(/[?/#]+/g, "");
        const { data } = await this.request.json(
            esc`/user/${login}/print/`
        );
        return data;
    }

    async getPlanning(start?: Date, end?: Date): Promise<RawPlanningElement[]> {
        let query = "";
        if (start && end) {
            const startDate = `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`;
            const endDate = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`;
            query = esc`?start=${startDate}&end=${endDate}`;
        }
        const { data } = await this.request.json(`/planning/load${query}`);
        return data;
    }

    async getModuleBoard(start: Date, end: Date): Promise<RawModuleBoardActivity[]> {
        const startDate = `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`;
        const endDate = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`;
        const { data } = await this.request.json(
            esc`/module/board/?start=${startDate}&end=${endDate}`
        );
        return data;
    }

    async filterCourses(filter: RawCourseFilters): Promise<RawCourseFilterOutput> {
        const preload = "preload=" + (filter.preload ? "1" : "0");

        const locationString = filter.locations
            ?.map(v => esc`location[]=${v}`).join("&");

        const courseString = filter.courses
            ?.map(v => esc`course[]=${v}`).join("&");

        const scolaryearString = filter.scolaryears
            ?.map(v => esc`scolaryear[]=${v}`).join("&");

        const filterString = [
            preload, locationString, courseString, scolaryearString
        ].filter(s => s != undefined).join("&");

        const { data } = await this.request.json(`/course/filter?${filterString}`);

        return data;
    }

    async getModule({ scolaryear, module, instance }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
    }): Promise<RawModule> {
        const { data } = await this.request.json(
            esc`/module/${scolaryear}/${module}/${instance}/`
        );
        return data;
    }

    async getModuleByUrl(url: ModuleUrl | string): Promise<RawModule> {
        url = this.solveUrl(url, ["module"]);
        const { data } = await this.request.json(url);
        return data;
    }

    async getModuleRegistered({ scolaryear, module, instance }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
    }): Promise<RawModuleRegisteredUser[]> {
        const { data } = await this.request.json(
            esc`/module/${scolaryear}/${module}/${instance}/registered`
        );
        return data;
    }

    async getModuleRegisteredByUrl(url: ModuleUrl | string): Promise<RawModuleRegisteredUser[]> {
        url = this.solveUrl(url, ["module"]);
        const { data } = await this.request.json(url + "/registered");
        return data;
    }

    async getActivity({ scolaryear, module, instance, activity }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
    }): Promise<RawActivity> {
        const { data } = await this.request.json(
            esc`/module/${scolaryear}/${module}/${instance}/${activity}/`
        );
        return data;
    }

    async getActivityByUrl(url: string): Promise<RawActivity> {
        url = this.solveUrl(url, ["activity"]);
        const { data } = await this.request.json(url);
        return data;
    }

    async getActivityAppointments({ scolaryear, module, instance, activity }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
    }): Promise<RawModuleActivityAppointment> {
        const { data } = await this.request.json(
            esc`/module/${scolaryear}/${module}/${instance}/${activity}/rdv/`
        );
        return data;
    }

    async getActivityAppointmentsByUrl(url: ActivityUrl | string): Promise<RawModuleActivityAppointment> {
        url = this.solveUrl(url, ["activity"]);
        const { data } = await this.request.json(`${url}/rdv/`);
        return data;
    }

    async getProject({ scolaryear, module, instance, activity }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
    }): Promise<RawProject> {
        const { data } = await this.request.json(
            esc`/module/${scolaryear}/${module}/${instance}/${activity}/project`
        );
        return data;
    }

    async getProjectByUrl(url: string): Promise<RawProject> {
        url = this.solveUrl(url, ["project"]);
        const { data } = await this.request.json(url);
        return data;
    }

    async getProjectRegistered({ scolaryear, module, instance, activity }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
    }): Promise<RawProjectRegisteredGroup[]> {
        const { data } = await this.request.json(
            esc`/module/${scolaryear}/${module}/${instance}/${activity}/`
                + `project/registered`
        );
        return data;
    }

    async getProjectRegisteredByUrl(url: string): Promise<RawProjectRegisteredGroup[]> {
        url = this.solveUrl(url, ["project"]);
        const { data } = await this.request.json(url + "/registered");
        return data;
    }

    async getProjectUnregistered({ scolaryear, module, instance, activity }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
    }): Promise<RawProjectRegisteredGroup[]> {
        const { data } = await this.request.json(
            esc`/module/${scolaryear}/${module}/${instance}/${activity}/`
                + `project/exportunregistered`
        );
        return data;
    }

    async getProjectUnregisteredByUrl(url: string): Promise<string[]> {
        url = this.solveUrl(url, ["project"]);
        const { data } = await this.request.get(url + "/exportunregistered");
        return data.split("\n");
    }

    async getProjectFiles({ scolaryear, module, instance, activity, path }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
        path?: string;
    }): Promise<RawProjectFile[]> {
        const url = esc`/module/${scolaryear}/${module}/${instance}/${activity}/project/file/` + path;
        return this.getProjectFilesByUrl(url);
    }

    async getProjectFilesByUrl(projectUrl: string): Promise<RawProjectFile[]> {
        projectUrl = this.solveUrl(projectUrl, ["projectfile"]);
        if (projectUrl.endsWith("/"))
            projectUrl = projectUrl.substring(0, projectUrl.length - 1);

        try {

            const { data } = await this.request.json(projectUrl + "/");
            if (canBeIntraError(data)) // since IntraError can be disabled, throw it anyway
                throw new IntraError(data);
            return data;

        } catch (err) {

            if (err instanceof IntraError) {
                const { data } = await this.request.json(projectUrl);
                return data;
            }
            throw err;

        }
    }

    async downloadFile(url: string): Promise<any> {
        url = this.solveUrl(url, ["all"]);
        const res = await this.request.getStream(url);
        return res.data;
    }

    async getEventRegistered({ scolaryear, module, instance, activity, event }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
        event: EventCode;
    }): Promise<RawEventRegisteredUser[]> {
        const { data } = await this.request.json(
            esc`/module/${scolaryear}/${module}/${instance}/`
                + esc`${activity}/${event}/registered`
        );
        return data;
    }

    async getEventRegisteredByUrl(eventUrl: string): Promise<RawEventRegisteredUser[]> {
        eventUrl = this.solveUrl(eventUrl, ["event"]);
        const { data } = await this.request.json(eventUrl + "/registered");
        return data;
    }

    async getStages(): Promise<RawInternshipOutput> {
        return this.getInternships();
    }

    async getInternships(): Promise<RawInternshipOutput> {
        const { data } = await this.request.json(
            "/stage/load?format=json&offset=0&number=120"
        );
        return data;
    }

    async getAutologin() {
        const { data } = await this.request.json("/admin/autolog");
        return data.autologin;
    }

    async registerEventByUrl(eventUrl: string): Promise<void> {
        eventUrl = this.solveUrl(eventUrl, ["event"]);

        const { data } = await this.request.post(
            eventUrl + "/register", undefined
        );
        return data;
    }

    async unregisterEventByUrl(eventUrl: string): Promise<void> {
        eventUrl = this.solveUrl(eventUrl, ["event"]);

        const { data } = await this.request.post(
            eventUrl + "/unregister", undefined
        );
        return data;
    }

    async registerProjectByUrl(projectUrl: string): Promise<void> {
        projectUrl = this.solveUrl(projectUrl, ["project"]);

        const { data } = await this.request.post(
            projectUrl + "/register", undefined
        );
        return data;
    }

    async registerProjectGroupByUrl(projectUrl: string, { title, membersLogins }: {
        title: string,
        membersLogins: string[]
    }): Promise<void> {
        projectUrl = this.solveUrl(projectUrl, ["project"]);

        const { data } = await this.request.post(projectUrl + "/register", {
            codegroup: undefined,
            members: membersLogins,
            title,
            force: false,
            unregister: undefined
        });
        return data;
    }

    async destroyProjectGroupByUrl(projectUrl: string, groupCode?: string): Promise<void> {
        projectUrl = this.solveUrl(projectUrl, ["project"]);

        if (groupCode === undefined) {
            const projectData = await this.getProjectByUrl(projectUrl);
            if (!projectData.user_project_code)
                throw new Error("User does not have a group");
            groupCode = projectData.user_project_code;
        }
        const { data } = await this.request.post(
            projectUrl + "/destroygroup", { code: groupCode }
        );
        return data;
    }

    async joinGroupByUrl(projectUrl: string, userLogin?: string): Promise<void> {
        projectUrl = this.solveUrl(projectUrl, ["project"]);

        if (userLogin === undefined) {
            const user = await this.getUser();
            userLogin = user.login;
        }
        const { data } = await this.request.post(
            projectUrl + "/confirmjoingroup", { login: userLogin }
        );
        return data;
    }

    async declineJoinGroupByUrl(projectUrl: string): Promise<void> {
        projectUrl = this.solveUrl(projectUrl, ["project"]);

        const { data } = await this.request.post(
            projectUrl + "/declinejoingroup", undefined
        );
        return data;
    }

    async leaveGroupByUrl(projectUrl: string, userLogin?: string): Promise<void> {
        projectUrl = this.solveUrl(projectUrl, ["project"]);

        if (userLogin === undefined) {
            const user = await this.getUser();
            userLogin = user.login;
        }
        const { data } = await this.request.post(
            projectUrl + "/confirmleavegroup", { login: userLogin }
        );
        return data;
    }
}
