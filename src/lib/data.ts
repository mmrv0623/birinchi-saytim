import type {
  Admin,
  ActivityEvent,
  Curator,
  Notification,
  Role,
  Status,
} from "./types";

const NICKNAMES = [
  "NovaStrike", "PhantomByte", "VoidWalker", "NeonRider", "PixelGhost",
  "CyberFox", "QuantumWolf", "ShadowProtocol", "BlackHalo", "AstroNet",
  "RogueCipher", "OmegaPulse", "VioletDawn", "ZeroCool", "HexHunter",
  "NeoSamurai", "SiliconKnight", "DataReaper", "EchoFrame", "NightCrawler",
  "Vexora", "Lumenize", "ChromeFalcon", "NyxBlade", "TitanGlitch",
  "SynthLord", "OrionFlux", "CipherSage", "FrostBurn", "HoloDrift",
  "BinaryWraith", "ViperX", "AeroHack", "PulseKnight", "GhostCircuit",
  "VanguardZ", "RaptorSync", "QuasarBeam", "DriftKnight", "Necronite",
];

const CURATOR_NICKS = [
  "Praetor",
  "Archon",
  "Sentinel",
  "Warden",
  "Magister",
  "Hyperion",
  "Aegis",
  "Oracle",
  "Specter",
  "Halcyon",
];

const ACTIVITY_TEMPLATES: Array<{
  type: ActivityEvent["type"];
  msg: (nick: string) => string;
}> = [
  { type: "report.submitted", msg: (n) => `${n} submitted a weekly report` },
  { type: "report.approved", msg: (n) => `Report from ${n} approved` },
  { type: "warning.issued", msg: (n) => `Warning issued to ${n}` },
  { type: "status.changed", msg: (n) => `${n} changed status` },
  { type: "login", msg: (n) => `${n} connected to network` },
  { type: "assignment", msg: (n) => `${n} reassigned to a new curator` },
  { type: "norma.updated", msg: (n) => `Weekly norma updated for ${n}` },
];

const STATUS_POOL: Status[] = ["Online", "Online", "Online", "AFK", "Busy", "Offline", "Offline"];

function seeded(seed: number) {
  let s = seed | 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return ((s >>> 0) % 100000) / 100000;
  };
}

function pickWith<T>(rand: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

export interface DemoData {
  admins: Admin[];
  curators: Curator[];
  activity: ActivityEvent[];
  notifications: Notification[];
}

export function generateDemoData(seed = 42): DemoData {
  const rand = seeded(seed);
  const curators: Curator[] = CURATOR_NICKS.map((nick, i) => {
    const role: Role = i < 1 ? "ГС" : i < 3 ? "ЗГС" : i < 6 ? "Менеджер" : "Куратор";
    return {
      id: `c_${i + 1}`,
      nickname: nick,
      role,
      managedAdminIds: [],
      performance: Math.round(70 + rand() * 28),
      status: pickWith(rand, STATUS_POOL),
      avatarSeed: `${nick}-${i}`,
    };
  });

  const admins: Admin[] = NICKNAMES.map((nick, i) => {
    const norma = pickWith(rand, [10, 12, 14, 16, 18, 20]);
    const done = Math.floor(rand() * (norma + 4));
    const status = pickWith(rand, STATUS_POOL);
    const daysAgo = Math.floor(rand() * 220) + 5;
    const lastActiveMinutes = status === "Online" ? Math.floor(rand() * 3) : Math.floor(rand() * 2880) + 5;
    const role: Role = pickWith(rand, ["Менеджер", "Куратор", "Куратор", "Куратор", "Куратор", "ЗГС"]);
    return {
      id: `a_${i + 1}`,
      nickname: nick,
      role,
      curatorId: null,
      weeklyNorma: norma,
      reportsDone: done,
      activity: Math.round(40 + rand() * 60),
      status,
      lastActive: new Date(Date.now() - lastActiveMinutes * 60 * 1000).toISOString(),
      warnings: Math.floor(rand() * 4),
      joinedAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      avatarSeed: `${nick}-${i}`,
    };
  });

  // Distribute admins among first N curators, max 5 each
  const eligibleCurators = curators.filter((c) => c.role === "Куратор" || c.role === "Менеджер");
  let cIdx = 0;
  for (const admin of admins) {
    let attempts = 0;
    while (attempts < eligibleCurators.length) {
      const cur = eligibleCurators[cIdx % eligibleCurators.length];
      if (cur.managedAdminIds.length < 5) {
        cur.managedAdminIds.push(admin.id);
        admin.curatorId = cur.id;
        cIdx++;
        break;
      }
      cIdx++;
      attempts++;
    }
  }

  // Activity feed
  const activity: ActivityEvent[] = Array.from({ length: 28 }, (_, i) => {
    const admin = pickWith(rand, admins);
    const tpl = pickWith(rand, ACTIVITY_TEMPLATES);
    return {
      id: `ev_${i + 1}`,
      adminId: admin.id,
      type: tpl.type,
      message: tpl.msg(admin.nickname),
      at: new Date(Date.now() - Math.floor(rand() * 7200) * 1000 - i * 60000).toISOString(),
    };
  }).sort((a, b) => b.at.localeCompare(a.at));

  const notifications: Notification[] = [
    {
      id: "n1",
      title: "System uplink stable",
      body: "All curator subnets reporting nominal latency.",
      level: "success",
      read: false,
      at: new Date(Date.now() - 2 * 60000).toISOString(),
    },
    {
      id: "n2",
      title: "Norma threshold alert",
      body: "3 admins are below 60% of their weekly target.",
      level: "warning",
      read: false,
      at: new Date(Date.now() - 14 * 60000).toISOString(),
    },
    {
      id: "n3",
      title: "Curator capacity warning",
      body: "Praetor is approaching maximum admin assignment (5/5).",
      level: "danger",
      read: false,
      at: new Date(Date.now() - 38 * 60000).toISOString(),
    },
    {
      id: "n4",
      title: "Weekly report cycle started",
      body: "Cycle #214 opened. Deadline in 6 days 12 hours.",
      level: "info",
      read: true,
      at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    },
  ];

  return { admins, curators, activity, notifications };
}

export function weeklySeries(seed = 7) {
  const rand = seeded(seed);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((d) => ({
    day: d,
    reports: Math.floor(28 + rand() * 70),
    approvals: Math.floor(22 + rand() * 60),
    warnings: Math.floor(rand() * 6),
  }));
}

export function performanceSeries(seed = 11) {
  const rand = seeded(seed);
  const labels = ["W-7", "W-6", "W-5", "W-4", "W-3", "W-2", "W-1", "Now"];
  let v = 62 + rand() * 12;
  return labels.map((l) => {
    v = Math.min(100, Math.max(35, v + (rand() - 0.45) * 12));
    return { week: l, performance: Math.round(v) };
  });
}

export function roleDistribution(curators: Curator[], admins: Admin[]) {
  const counts: Record<Role, number> = { "ГС": 0, "ЗГС": 0, "Менеджер": 0, "Куратор": 0 };
  for (const c of curators) counts[c.role]++;
  for (const a of admins) counts[a.role]++;
  return (Object.entries(counts) as Array<[Role, number]>).map(([role, value]) => ({ role, value }));
}
