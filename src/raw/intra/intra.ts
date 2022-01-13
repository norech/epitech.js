import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ActivityCode, InstanceCode, ModuleCode } from "../../common";
import { RawActivity } from "./activity";
import { RawDashboard } from "./dashboard";
import { RawCourseFilterOutput, RawModule, RawModuleActivityAppointment, RawModuleBoardActivity, RawModuleRegisteredUser } from "./module";
import { RawPlanningElement } from "./planning";
import { RawUser, RawUserAbsencesOutput, RawUserEducationalUpdate, RawUserPartnersOutput } from "./user";
import cheerio from "cheerio";
import { RawProject, RawProjectFile, RawProjectRegisteredGroup } from "./project";
import { stringify } from "querystring";
import { RawStagesOutput } from "./stage";
import { esc, SolvedUrl } from ".";
import { isActivityUrl, isModuleUrl, isProjectUrl, includesPathType, UrlPathType, ActivityUrl, ModuleUrl, ProjectUrl } from "./url";

export class IntraRequestProvider {
    protected endpoint = "https://intra.epitech.eu/";
    protected client: AxiosInstance

    constructor(autologin: string) {
        this.endpoint = autologin;
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

    async get(route: string, config?: AxiosRequestConfig) {
        return this.client.get(route, config);
    }

    async post(route: string, body: any, config?: AxiosRequestConfig) {
        body = body ? stringify(body) : undefined;
        return this.client.post(route, body, config);
    }
}

export interface RawIntraConfig {
    autologin: string
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
    }

    solveUrl<T extends UrlPathType[]>(url: string, validTypes?: T | undefined): SolvedUrl<T> {
        if (url.startsWith("/"))
            url = "https://intra.epitech.eu" + url;
        const uri = new URL(url);
        let pathname = uri.pathname;
        let i = pathname.indexOf("/", 1);

        if (pathname.startsWith("/auth-") && i !== -1) { // autologin link
            pathname = pathname.slice(i);
        }

        if (!validTypes || includesPathType(validTypes, "all"))
            return pathname as SolvedUrl<T>;

        if (includesPathType(validTypes, "module") && isModuleUrl(pathname))
            return pathname as SolvedUrl<T>;
        if (includesPathType(validTypes, "activity") && isActivityUrl(pathname))
            return pathname as SolvedUrl<T>;
        if (includesPathType(validTypes, "project") && isProjectUrl(pathname))
            return pathname as SolvedUrl<T>;

        if (includesPathType(validTypes, "project") && isActivityUrl(pathname))
            return (pathname + "/project/")  as SolvedUrl<T>;

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

    async getRequestProvider() {
        return this.request;
    }

    async getDashboard(): Promise<RawDashboard> {
        const { data } = await this.request.get("/");
        return data;
    }

    async getUser(login?: string): Promise<RawUser> {
        login = login?.replace(/[?/#]+/g, "");
        const { data } = await this.request.get(
            login ? esc`/user/${login}/` : `/user/`
        );
        return data;
    }

    async getUserNetsoul(login: string): Promise<[number, number, number, number, number, number][]> {
        login = login?.replace(/[?/#]+/g, "");
        const { data } = await this.request.get(esc`/user/${login}/netsoul`);
        return data;
    }

    async getUserPartners(login: string): Promise<RawUserPartnersOutput> {
        login = login?.replace(/[?/#]+/g, "");
        const { data } = await this.request.get(esc`/user/${login}/binome`);
        return data;
    }

    async getUserEducationalOverview(login: string): Promise<RawUserEducationalUpdate[]> {
        const { data } = await this.request.get(`/user/${login}/`, {
            headers: {
                'Accept': 'text/html',
                'Content-Type': 'text/html'
            }
        });
        const $ = cheerio.load(data, { xmlMode: false });
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
        const { data } = await this.request.get(
            esc`/user/${login}/notification/missed/`
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
        const { data } = await this.request.get(`/planning/load${query}`);
        return data;
    }

    async getModuleBoard(start: Date, end: Date): Promise<RawModuleBoardActivity[]> {
        const startDate = `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`;
        const endDate = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`;
        const { data } = await this.request.get(
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

        const { data } = await this.request.get(`/course/filter?${filterString}`);

        return data;
    }

    async getModule({ scolaryear, module, instance }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
    }): Promise<RawModule> {
        const { data } = await this.request.get(
            esc`/module/${scolaryear}/${module}/${instance}/`
        );
        return data;
    }

    async getModuleByUrl(url: ModuleUrl | string): Promise<RawModule> {
        url = this.solveUrl(url, ["module"]);
        const { data } = await this.request.get(url);
        return data;
    }

    async getModuleRegistered({ scolaryear, module, instance }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
    }): Promise<RawModuleRegisteredUser[]> {
        const { data } = await this.request.get(
            esc`/module/${scolaryear}/${module}/${instance}/registered`
        );
        return data;
    }

    async getModuleRegisteredByUrl(url: ModuleUrl | string): Promise<RawModuleRegisteredUser[]> {
        url = this.solveUrl(url, ["module"]);
        const { data } = await this.request.get(url + "/registered");
        return data;
    }

    async getActivity({ scolaryear, module, instance, activity }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
    }): Promise<RawActivity> {
        const { data } = await this.request.get(
            esc`/module/${scolaryear}/${module}/${instance}/${activity}/`
        );
        return data;
    }

    async getActivityByUrl(url: string): Promise<RawActivity> {
        url = this.solveUrl(url, ["activity"]);
        const { data } = await this.request.get(url);
        return data;
    }

    async getActivityAppointments({ scolaryear, module, instance, activity }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
    }): Promise<RawModuleActivityAppointment> {
        const { data } = await this.request.get(
            esc`/module/${scolaryear}/${module}/${instance}/${activity}/rdv/`
        );
        return data;
    }

    async getActivityAppointmentsByUrl(url: ActivityUrl | string): Promise<RawModuleActivityAppointment> {
        url = this.solveUrl(url, ["activity"]);
        const { data } = await this.request.get(`${url}/rdv/`);
        return data;
    }

    async getProject({ scolaryear, module, instance, activity }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
    }): Promise<RawProject> {
        const { data } = await this.request.get(
            esc`/module/${scolaryear}/${module}/${instance}/${activity}/project`
        );
        return data;
    }

    async getProjectByUrl(url: string): Promise<RawProject> {
        url = this.solveUrl(url, ["project"]);
        const { data } = await this.request.get(url);
        return data;
    }

    async getProjectRegistered({ scolaryear, module, instance, activity }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
    }): Promise<RawProjectRegisteredGroup[]> {
        const { data } = await this.request.get(
            esc`/module/${scolaryear}/${module}/${instance}/${activity}/`
                + `project/registered`
        );
        return data;
    }

    async getProjectRegisteredByUrl(url: string): Promise<RawProjectRegisteredGroup[]> {
        url = this.solveUrl(url, ["project"]);
        const { data } = await this.request.get(url + "/registered");
        return data;
    }

    async getProjectUnregistered({ scolaryear, module, instance, activity }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
    }): Promise<RawProjectRegisteredGroup[]> {
        const { data } = await this.request.get(
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

    async getProjectFiles({ scolaryear, module, instance, activity }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
    }): Promise<RawProjectFile[]> {
        const { data } = await this.request.get(
            esc`/module/${scolaryear}/${module}/${instance}/${activity}/project/file`
        );
        return data;
    }

    async getProjectFilesByUrl(projectUrl: string): Promise<RawProjectFile[]> {
        projectUrl = this.solveUrl(projectUrl, ["project"]);
        const { data } = await this.request.get(projectUrl + "/file");
        return data;
    }

    async getStages(): Promise<RawStagesOutput> {
        const { data } = await this.request.get(
            "/stage/load?format=json&offset=0&number=120"
        );
        return data;
    }

    async getAutologin() {
        const { data } = await this.request.get("/admin/autolog");
        return data.autologin;
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