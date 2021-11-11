import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ActivityCode, InstanceCode, ModuleCode } from "../../common";
import { RawActivity } from "./activity";
import { RawDashboard } from "./dashboard";
import { RawCourseFilterOutput, RawModule, RawModuleBoardActivity, RawModuleRegisteredUser } from "./module";
import { RawPlanningElement } from "./planning";
import { RawUser, RawUserAbsencesOutput, RawUserEducationalUpdate, RawUserPartnersOutput } from "./user";
import cheerio from "cheerio";
import { RawProject, RawProjectFile, RawProjectRegisteredGroup } from "./project";
import { stringify } from "querystring";

export type ModuleUrl   = `/module/${number}/${ModuleCode}/${InstanceCode}/`
                        | `/module/${number}/${ModuleCode}/${InstanceCode}`;

export type ActivityUrl = `${ModuleUrl}/${ActivityCode}`
                        | `${ModuleUrl}/${ActivityCode}/`;

export type ProjectUrl  = `${ActivityUrl}/project`
                        | `${ActivityUrl}/project/`;

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

    solveUrl(url: string) {
        if (url.startsWith("/"))
            url = "https://intra.epitech.eu" + url;
        const uri = new URL(url);
        let pathname = uri.pathname;
        let i = pathname.indexOf("/", 1);

        if (pathname.startsWith("/auth-") && i !== -1) { // autologin link
            pathname = pathname.slice(i - 1);
        }
        return pathname;
    }

    solveModuleUrl({ scolaryear, module, instance }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
    }) {
        return `/module/${scolaryear}/${module}/${instance}` as ModuleUrl;
    }

    solveActivityUrl({ scolaryear, module, instance, activity }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
    }) {
        return `/module/${scolaryear}/${module}/${instance}/${activity}` as ActivityUrl;
    }

    solveProjectUrl({ scolaryear, module, instance, activity }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
    }) {
        return `/module/${scolaryear}/${module}/${instance}/${activity}/project` as ProjectUrl;
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
        const { data } = await this.request.get(login ? `/user/${login}/` : `/user/`);
        return data;
    }

    async getUserNetsoul(login: string): Promise<[number, number, number, number, number, number][]> {
        login = login?.replace(/[?/#]+/g, "");
        const { data } = await this.request.get(`/user/${login}/netsoul`);
        return data;
    }

    async getUserPartners(login: string): Promise<RawUserPartnersOutput> {
        login = login?.replace(/[?/#]+/g, "");
        const { data } = await this.request.get(`/user/${login}/binome`);
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
        const { data } = await this.request.get(`/user/${login}/notification/missed/`);
        return data;
    }

    async getPlanning(start?: Date, end?: Date): Promise<RawPlanningElement[]> {
        let query = "";
        if (start && end) {
            const startDate = `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`;
            const endDate = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`;
            query = `?start=${startDate}&end=${endDate}`;
        }
        const { data } = await this.request.get(`/planning/load${query}`);
        return data;
    }

    async getModuleBoard(start: Date, end: Date): Promise<RawModuleBoardActivity[]> {
        const startDate = `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`;
        const endDate = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`;
        const { data } = await this.request.get(`/module/board/?start=${startDate}&end=${endDate}`);
        return data;
    }

    async filterCourses(filter: RawCourseFilters): Promise<RawCourseFilterOutput> {
        const preload = "preload=" + (filter.preload ? "1" : "0");
        const locationString = filter.locations?.map(v => "location[]=" + v.replace(/[&=]+/g, "")).join("&");
        const courseString = filter.courses?.map(v => "course[]=" + v.replace(/[&=]+/g, "")).join("&");
        const scolaryearString = filter.scolaryears?.map(v => "course[]=" + v).join("&");
        const filterString = [preload, locationString, courseString, scolaryearString].filter(s => s != undefined).join("&");
        const { data } = await this.request.get(`/course/filter?` + filterString);
        return data;
    }

    async getModule({ scolaryear, module, instance }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
    }): Promise<RawModule> {
        const { data } = await this.request.get(`/module/${scolaryear}/${module}/${instance}/`);
        return data;
    }

    async getModuleByUrl(url: string): Promise<RawModule> {
        url = this.solveUrl(url);
        const { data } = await this.request.get(url);
        return data;
    }

    async getModuleRegistered(module: ModuleUrl): Promise<RawModuleRegisteredUser[]> {
        const { data } = await this.request.get(module + "/registered");
        return data;
    }

    async getActivity({ scolaryear, module, instance, activity }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
    }): Promise<RawModule> {
        const { data } = await this.request.get(`/module/${scolaryear}/${module}/${instance}/${activity}/`);
        return data;
    }

    async getActivityAppointments({ scolaryear, module, instance, activity }: {
        scolaryear: number | `${number}`;
        module: ModuleCode;
        instance: InstanceCode;
        activity: ActivityCode;
    }): Promise<RawModule> {
        const { data } = await this.request.get(`/module/${scolaryear}/${module}/${instance}/${activity}/rdv/`);
        return data;
    }

    async getActivityByUrl(url: string): Promise<RawActivity> {
        url = this.solveUrl(url);
        const { data } = await this.request.get(url);
        return data;
    }

    async getProjectByUrl(url: string): Promise<RawProject> {
        url = this.solveUrl(url);
        if(!url.includes("/project")) { // Activity Url
            url = url + "/project/";
        }
        const { data } = await this.request.get(url);
        return data;
    }

    async getProjectRegistered(project: ProjectUrl): Promise<RawProjectRegisteredGroup[]> {
        const { data } = await this.request.get(project + "/registered");
        return data;
    }

    async getProjectUnregistered(project: ProjectUrl): Promise<string[]> {
        const { data } = await this.request.get(project + "/exportunregistered");
        return data.split("\n");
    }

    async getProjectFiles(project: ProjectUrl): Promise<RawProjectFile[]> {
        const { data } = await this.request.get(project + "/file");
        return data;
    }

    async getAutologin() {
        const { data } = await this.request.get("/admin/autolog");
        return data.autologin;
    }

    async registerProject(project: ProjectUrl): Promise<void> {
        const { data } = await this.request.post(project + "/register", undefined);
        return data;
    }

    async registerProjectGroup(project: ProjectUrl, { title, membersLogins }: {
        title: string,
        membersLogins: string[]
    }): Promise<void> {
        const { data } = await this.request.post(project + "/register", {
            codegroup: undefined,
            members: membersLogins,
            title,
            force: false,
            unregister: undefined
        });
        return data;
    }

    async destroyProjectGroup(project: ProjectUrl, groupCode?: string): Promise<void> {
        if (groupCode === undefined) {
            const projectData = await this.getProjectByUrl(project);
            if (!projectData.user_project_code)
                throw new Error("User does not have a group");
            groupCode = projectData.user_project_code;
        }
        const { data } = await this.request.post(project + "/destroygroup", { code: groupCode });
        return data;
    }

    async joinGroup(project: ProjectUrl, userLogin?: string): Promise<void> {
        if (userLogin === undefined) {
            const user = await this.getUser();
            userLogin = user.login;
        }
        const { data } = await this.request.post(project + "/confirmjoingroup", { login: userLogin });
        return data;
    }

    async declineJoinGroup(project: ProjectUrl): Promise<void> {

        const { data } = await this.request.post(project + "/declinejoingroup", undefined);
        return data;
    }

    async leaveGroup(project: ProjectUrl, userLogin?: string): Promise<void> {
        if (userLogin === undefined) {
            const user = await this.getUser();
            userLogin = user.login;
        }
        const { data } = await this.request.post(project + "/confirmleavegroup", { login: userLogin });
        return data;
    }
}