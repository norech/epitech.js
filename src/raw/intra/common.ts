export type LiteralTrue = "1" | "true" | 1 | true;
export type LiteralFalse = "0" | "false" | 0 | false | null;
export type LiteralBoolean = LiteralTrue | LiteralFalse;

export function isLiteralTrue(value: any): value is LiteralTrue {
    return value === "1" || value === "true" || value === 1 || value === true;
}

export function isLiteralFalse(value: any): value is LiteralFalse {
    return value === "0" || value === "false" || value === 0 || value === false || value == null;
}

export function esc<T extends string = string>(strs: TemplateStringsArray, ...args: any[]) {
    return strs.map(str => str + (args.length > 0 ? encodeURIComponent(args.shift()) : "")).join('') as T;
}

export interface RawGroup {
    type: "group",
    login: string
};

export interface RawPerson {
    type: "user",
    login: string,
    title?: string,
    picture?: string
};

export interface RawRoom {
    code: `${string}/${string}/${string}` | null,
    type: "bureau" | "exterieur" | "salle-de-reunion" | "salle_de_cours" | "salle-de-cours-td" | "hub",
    seats: number | null
};

export type RawMember = RawGroup | RawPerson;