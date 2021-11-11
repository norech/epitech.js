import { DatetimeDMYLiteral, DateDMYLiteral, DatetimeLiteral, DayLiteral, Grade, HourLiteral, MinuteLiteral, ModuleCode, MonthLiteral, YearLiteral } from "../../common";

export interface RawDashboardProject {
    title: string,
    title_link: string,
    timeline_start: DatetimeDMYLiteral,
    timeline_end: DatetimeDMYLiteral,
    timeline_barre: `${number}`,
    date_inscription: DatetimeDMYLiteral | false,
    id_activite: `${number}`,
    soutenance_name: string | false,
    soutenance_link: string | false,
    soutenance_date: DatetimeDMYLiteral | false,
    soutenance_salle: false
}

export interface RawDashboardModule {
    title: string,
    title_link: string,
    timeline_start: DateDMYLiteral
    timeline_end: DateDMYLiteral,
    timeline_barre: `${number}`,
    date_inscription: DatetimeDMYLiteral | false
}

export interface RawDashboardMark {
    title: string,
    title_link: string,
    note: `${number}`,
    noteur: string
}

export interface RawDashboardActivity {
    title: string,
    module: string,
    module_link: string,
    module_code: ModuleCode,
    title_link: string,
    timeline_start: DatetimeDMYLiteral,
    timeline_end: DatetimeDMYLiteral,
    timeline_barre: `${number}`,
    date_inscription: DatetimeDMYLiteral | false,
    salle: string,
    intervenant: string,
    token: string | null,
    token_link: string,
    register_link: string
}

export interface RawDashboardHistory {
    title: string,
    user: {
        picture: string | null,
        title: string,
        url: string
    },
    content: string,
    date: DatetimeLiteral,
    id: `${number}`,
    visible: "0" | "1",
    id_activite: `${number}`,
    class: string
}

export interface RawDashboardCurrentModule {
    credits_min: `${number}`,
    credits_norm: `${number}`,
    credits_obj: `${number}`,
    credits: `${number}`,
    grade: Grade | "-",
    cycle: string,
    code_module: ModuleCode,
    current_cycle: string,
    semester_code: string,
    semester_num: `${number}`,
    active_log: any | null
}

export interface RawDashboardInternship {
    company: string,
    link: string,
    timeline_start: `${DayLiteral}/${MonthLiteral}/${YearLiteral}`,
    timeline_end: `${DayLiteral}/${MonthLiteral}/${YearLiteral}`,
    timeline_barre: `${number}`,
    can_note: boolean,
    status: "waiting" | "confirmed",
    mandatory: boolean,
}

export interface RawDashboard {
    ip: string,
    board: {
        projets: RawDashboardProject[],
        notes: RawDashboardMark[],
        susies: any[],
        modules: RawDashboardModule[],
        stages: RawDashboardInternship[],
        tickets: any[]
    },
    history: RawDashboardHistory[],
    infos: {
        location: `${string}/${string}`
    },
    current: RawDashboardCurrentModule[]
}