"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { pick } from "@/lib/utils";
import type { ActivityEvent } from "@/lib/types";

const TYPES: ActivityEvent["type"][] = [
  "report.submitted",
  "report.approved",
  "status.changed",
  "login",
];

export default function LiveSim() {
  const pushActivity = useAppStore((s) => s.pushActivity);
  const adminsRef = useRef(useAppStore.getState().admins);

  useEffect(() => {
    const unsub = useAppStore.subscribe((s) => {
      adminsRef.current = s.admins;
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const admins = adminsRef.current;
      if (!admins.length) return;
      const a = pick(admins);
      const type = pick(TYPES);
      const msgs: Record<ActivityEvent["type"], string> = {
        "report.submitted": `${a.nickname} submitted a weekly report`,
        "report.approved": `Report from ${a.nickname} approved`,
        "warning.issued": `Warning issued to ${a.nickname}`,
        "status.changed": `${a.nickname} changed status`,
        login: `${a.nickname} connected to network`,
        assignment: `${a.nickname} reassigned`,
        "norma.updated": `Weekly norma updated for ${a.nickname}`,
      };
      pushActivity({ adminId: a.id, type, message: msgs[type] });
    }, 7000);
    return () => clearInterval(id);
  }, [pushActivity]);

  return null;
}
