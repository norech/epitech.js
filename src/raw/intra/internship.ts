import { DateLiteral, DatetimeLiteral, DayLiteral, HourLiteral } from "../..";

export interface RawInternship {
    begin: `${DateLiteral}`,
    end: `${DateLiteral}`,
    date_diff: `${DayLiteral}`,
    duration: `${HourLiteral}`,
    login: string,
    school_year: "tech2" | "tech3" | "tech4" | "tech5",
    location: `${string}/${string}`,
    deal_type: "stage" | "etranger" | "cdd" | "cdi" | "autoentrepreneur",
    mandatory: "1" | "0",
    pay: `${number}`,
    pay_period: "hours" | "days" | "weeks" | "months" | "years",
    subject: string,
    jury: string,
    time_work: "plein" | "partiel",
    nb_hours_week: `${HourLiteral}`,
    presence_day: string,
    address: string,
    city: string,
    area_code: `${number}`,
    holidays: string,
    special_cases: string,
    status: "confirmed",
    stage_obligatoire: "oui" | "non",
    stage_note: "oui" | "non",
    refusal_reason: string | null,
    last_modification: DatetimeLiteral,
    date_creation: DatetimeLiteral,
    country: string,
    company_id: `${number}`,
    company_name: string,
    company_sector: string,
    company_phone: string,
    company_cell: string,
    company_email: string,
    company_address: string,
    company_area_code: `${number}`,
    company_city: string,
    company_workforce: string,
    company_country: string,
    company_ape: string,
    company_siret: string,
    master_id: string,
    master_lastname: string,
    master_firstname: string,
    master_activity: string,
    master_phone: string,
    master_cell: string,
    master_email: string,
    signatory_id: string,
    signatory_lastname: string,
    signatory_firstname: string,
    signatory_activity: string,
    signatory_phone: string,
    signatory_cell: string,
    signatory_email: string,
    trainee_fullname: string,
    trainee_address: string,
    trainee_area_code: `${number}`,
    trainee_city: string,
    trainee_email: string,
    trainee_country: string,
    desc_company: null,
    desc_work_placement: null,
    desc_personal_feeling: null,
    id_validated: string,
    login_validated: string,
    id_confirmed: `${number}`,
    login_confirmed: string,
    id_selected: `${number}`,
    login_selected: string,
    id_refused: string | null,
    login_refused: string | null,
    id_tutor: `${number}`,
    login_tutor: string,
    status_student: "1" | "0",
    status_tutor: "1" | "0",
    ws_id: `${number}`,
    status_signatory: "1" | "0",
    status_master: "1" | "0",
    tutor_name: string,
    hash: string,
    over_notation: "1" | "0",
    promo: `${number}`,
    nb_stage_current: `${number}`
}

export interface RawInternshipsOutput {
    items: RawInternship[];
}

export type RawStage = RawInternship;
export type RawStageOutput = RawInternshipsOutput;
