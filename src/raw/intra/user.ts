import { ActivityCode, ActivityTypeTitle, DatetimeLiteral, Grade, InstanceCode, ModuleCode } from "../../common";

export interface RawUserGroup {
    title: string,
    name: string,
    count: number
}

export interface RawUserEvent {
    id_event_failed: `${number}`,
    id_user: `${number}`,
    begin: `${DatetimeLiteral}`,
    id_activite_failed: `${number}`
}

export interface RawUserGPA {
    gpa: `${number}`,
    cycle: string
}

export interface RawUserNSStat {
    active: number,
    idle: number,
    out_active: number,
    out_idle: number,
    nslog_norm: number
}

export interface RawUser {
    login: string,
    title: string,
    internal_email: string,
    lastname: string,
    firstname: string,
    userinfo: any,
    referent_used: boolean,
    picture: string | null,
    picture_fun: string | null,
    scolaryear: `${number}`,
    promo: number,
    semester: number,
    location: `${string}/${string}`,
    userdocs: null,
    shell: null,
    close: boolean,
    ctime: `${DatetimeLiteral}`,
    mtime: `${DatetimeLiteral}`,
    id_promo: `${number}`,
    id_history: `${number}`,
    course_code: string,
    semester_code: string,
    school_id: `${number}`,
    school_code: string,
    school_title: string,
    old_id_promo: string,
    old_id_location: string,
    rights: any,
    invited: boolean,
    studentyear: number,
    admin: boolean,
    editable: boolean,
    restrictprofiles: boolean,
    groups: RawUserGroup[],
    events: RawUserEvent[],
    credits: number,
    gpa: RawUserGPA[],
    spice: any,
    nsstat: RawUserNSStat | null
}

export interface RawUserPartner {
    login: string,
    picture: string | null,
    activities: string,
    id_activities: string,
    nb_activities: `${number}`,
    weight: `${number}`
}

export interface RawUserPartnersOutput {
    user: {
        login: string,
        picture: string | null,
    },
    binomes: RawUserPartner[]
}

export interface RawUserEducationalUpdate {
    scolaryear: number,
    date: DatetimeLiteral,
    location: `${string}/${string}`,
    promo: number,
    course_code: string,
    semester: number,
    special: null,
    modifier: string,
    comment: string,
    course_title: string
}

export interface RawUserListHistory {
    scolaryear: number,
    date: DatetimeLiteral,
    location: `${string}/${string}`,
    promo: number,
    course_code: string,
    semester: number,
    special: null,
    modifier: string,
    comment: string
}

export interface RawUserAbsence {
    module_title: string,
    acti_title: string,
    link_module: string,
    link_event: string,
    recent: "0" | "1",
    begin: DatetimeLiteral,
    end: DatetimeLiteral,
    categ_title: ActivityTypeTitle
}

export interface RawUserAbsencesOutput {
    recents: RawUserAbsence[],
    others: RawUserAbsence[]
}

export interface RawUserFlagsModule {
    scolaryear: number,
    id_user_history: string,
    codemodule: ModuleCode,
    codeinstance: InstanceCode,
    title: string,
    id_instance: `${number}`,
    date_ins: DatetimeLiteral,
    cycle: string,
    grade: Grade,
    credits: number,
    flags: `${number}`,
    barrage: 0 | 1,
    instance_id: `${number}`,
    module_rating: null,
    semester: number
}

export interface RawUserFlag {
    value: number,
    label: string,
    modules: RawUserFlagsModule[]
}

export interface RawUserFlags {
    ghost: RawUserFlag,
    difficulty: RawUserFlag,
    remarkable: RawUserFlag,
    medal: RawUserFlag,
    [key: string]: RawUserFlag
}

export interface RawUserNote {
    scolaryear: number,
    codemodule: ModuleCode,
    codeinstance: InstanceCode,
    codeacti: ActivityCode,
    title: string,
    date: DatetimeLiteral,
    final_note: number
}

export interface RawUserDetails {
    login: string,
    title: string,
    internal_email: string,
    lastname: string,
    firstname: string,
    userinfo: any,
    referent_used: boolean,
    picture: string | null,
    picture_fun: string | null,
    scolaryear: `${number}`,
    promo: number,
    semester: number,
    location: `${string}/${string}`,
    userdocs: null,
    shell: null,
    close: boolean,
    ctime: `${DatetimeLiteral}`,
    mtime: `${DatetimeLiteral}`,
    id_promo: `${number}`,
    id_history: `${number}`,
    course_code: string,
    semester_code: string,
    school_id: `${number}`,
    school_code: string,
    school_title: string,
    old_id_promo: string,
    old_id_location: string,
    rights: any,
    invited: boolean,
    studentyear: number,
    admin: boolean,
    editable: boolean,
    restrictprofiles: boolean,
    groups: RawUserGroup[],
    events: RawUserEvent[],
    credits: number,
    gpa: RawUserGPA[],
    nsstat: RawUserNSStat | null,
    flags: RawUserFlags,
    partners: RawUserPartnersOutput,
    list_history: RawUserListHistory[],
    missed: RawUserAbsence[],
    modules: RawUserFlagsModule[],
    notes: RawUserNote[]
}
