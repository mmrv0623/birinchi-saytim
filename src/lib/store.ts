"use client";

import { create } from "zustand";
import { generateDemoData } from "./data";
import {
  MAX_ADMINS_PER_CURATOR,
  type Admin,
  type ActivityEvent,
  type Curator,
  type Notification,
  type Role,
  type Status,
} from "./types";

type AssignResult = { ok: true } | { ok: false; reason: string };

interface AppState {
  admins: Admin[];
  curators: Curator[];
  activity: ActivityEvent[];
  notifications: Notification[];
  soundEnabled: boolean;
  theme: "dark" | "midnight" | "neon";
  commandOpen: boolean;
  notifOpen: boolean;
  // actions
  toggleSound: () => void;
  setTheme: (t: AppState["theme"]) => void;
  openCommand: () => void;
  closeCommand: () => void;
  toggleNotifPanel: () => void;
  markAllNotificationsRead: () => void;
  pushNotification: (n: Omit<Notification, "id" | "at" | "read">) => void;
  updateAdminStatus: (id: string, status: Status) => void;
  updateAdminRole: (id: string, role: Role) => void;
  incrementReports: (id: string, by?: number) => void;
  assignAdminToCurator: (adminId: string, curatorId: string) => AssignResult;
  unassignAdmin: (adminId: string) => void;
  issueWarning: (adminId: string) => void;
  pushActivity: (e: Omit<ActivityEvent, "id" | "at">) => void;
}

const seed = generateDemoData(42);

export const useAppStore = create<AppState>((set, get) => ({
  admins: seed.admins,
  curators: seed.curators,
  activity: seed.activity,
  notifications: seed.notifications,
  soundEnabled: false,
  theme: "dark",
  commandOpen: false,
  notifOpen: false,

  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  setTheme: (theme) => set({ theme }),
  openCommand: () => set({ commandOpen: true }),
  closeCommand: () => set({ commandOpen: false }),
  toggleNotifPanel: () => set((s) => ({ notifOpen: !s.notifOpen })),

  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),

  pushNotification: (n) =>
    set((s) => ({
      notifications: [
        {
          id: `n_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
          at: new Date().toISOString(),
          read: false,
          ...n,
        },
        ...s.notifications,
      ].slice(0, 30),
    })),

  updateAdminStatus: (id, status) =>
    set((s) => ({
      admins: s.admins.map((a) => (a.id === id ? { ...a, status, lastActive: new Date().toISOString() } : a)),
    })),

  updateAdminRole: (id, role) =>
    set((s) => ({
      admins: s.admins.map((a) => (a.id === id ? { ...a, role } : a)),
    })),

  incrementReports: (id, by = 1) =>
    set((s) => ({
      admins: s.admins.map((a) =>
        a.id === id
          ? { ...a, reportsDone: a.reportsDone + by, lastActive: new Date().toISOString() }
          : a,
      ),
    })),

  assignAdminToCurator: (adminId, curatorId) => {
    const state = get();
    const curator = state.curators.find((c) => c.id === curatorId);
    if (!curator) return { ok: false, reason: "Curator not found" };
    if (curator.managedAdminIds.includes(adminId)) return { ok: true };
    if (curator.managedAdminIds.length >= MAX_ADMINS_PER_CURATOR) {
      return { ok: false, reason: "Curator limit exceeded" };
    }
    set((s) => {
      // Detach from previous curator if any
      const curators = s.curators.map((c) => ({
        ...c,
        managedAdminIds: c.managedAdminIds.filter((id) => id !== adminId),
      }));
      const target = curators.find((c) => c.id === curatorId)!;
      target.managedAdminIds = [...target.managedAdminIds, adminId];
      const admins = s.admins.map((a) =>
        a.id === adminId ? { ...a, curatorId } : a,
      );
      return { admins, curators };
    });
    const admin = state.admins.find((a) => a.id === adminId);
    if (admin) {
      get().pushActivity({
        adminId,
        type: "assignment",
        message: `${admin.nickname} reassigned to ${curator.nickname}`,
      });
    }
    return { ok: true };
  },

  unassignAdmin: (adminId) =>
    set((s) => ({
      admins: s.admins.map((a) => (a.id === adminId ? { ...a, curatorId: null } : a)),
      curators: s.curators.map((c) => ({
        ...c,
        managedAdminIds: c.managedAdminIds.filter((id) => id !== adminId),
      })),
    })),

  issueWarning: (adminId) => {
    set((s) => ({
      admins: s.admins.map((a) =>
        a.id === adminId ? { ...a, warnings: a.warnings + 1 } : a,
      ),
    }));
    const admin = get().admins.find((a) => a.id === adminId);
    if (admin) {
      get().pushActivity({
        adminId,
        type: "warning.issued",
        message: `Warning issued to ${admin.nickname}`,
      });
    }
  },

  pushActivity: (e) =>
    set((s) => ({
      activity: [
        {
          id: `ev_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
          at: new Date().toISOString(),
          ...e,
        },
        ...s.activity,
      ].slice(0, 100),
    })),
}));

export function adminsForCurator(curatorId: string, admins: Admin[]) {
  return admins.filter((a) => a.curatorId === curatorId);
}

export function curatorForAdmin(curatorId: string | null, curators: Curator[]): Curator | null {
  if (!curatorId) return null;
  return curators.find((c) => c.id === curatorId) ?? null;
}
