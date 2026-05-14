export type Role = "ГС" | "ЗГС" | "Менеджер" | "Куратор";

export const ROLES: Role[] = ["ГС", "ЗГС", "Менеджер", "Куратор"];

export const ROLE_RANK: Record<Role, number> = {
  ГС: 4,
  ЗГС: 3,
  Менеджер: 2,
  Куратор: 1,
};

export type Status = "Online" | "Offline" | "AFK" | "Busy";
export const STATUSES: Status[] = ["Online", "Offline", "AFK", "Busy"];

export interface Admin {
  id: string;
  nickname: string;
  role: Role;
  curatorId: string | null;
  weeklyNorma: number;
  reportsDone: number;
  activity: number;
  status: Status;
  lastActive: string;
  warnings: number;
  joinedAt: string;
  avatarSeed: string;
}

export interface Curator {
  id: string;
  nickname: string;
  role: Role;
  managedAdminIds: string[];
  performance: number;
  status: Status;
  avatarSeed: string;
}

export interface ActivityEvent {
  id: string;
  adminId: string;
  type:
    | "report.submitted"
    | "report.approved"
    | "warning.issued"
    | "status.changed"
    | "login"
    | "assignment"
    | "norma.updated";
  message: string;
  at: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  level: "info" | "success" | "warning" | "danger";
  read: boolean;
  at: string;
}

export const MAX_ADMINS_PER_CURATOR = 5;
