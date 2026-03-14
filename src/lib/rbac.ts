import {
  ClipboardCheck,
  FileText,
  FlaskConical,
  LayoutGrid,
  Settings2,
  ShieldCheck,
  Stethoscope,
  TestTube2,
  Truck,
  Users2
} from "lucide-react";
import type { ComponentType } from "react";

// Centralize role names and route rules so the founder can change permissions in one file.
export const appRoles = [
  "admin",
  "lab_manager",
  "scientist",
  "technician",
  "qc_manager",
  "client"
] as const;

export type AppRole = (typeof appRoles)[number];

export const roleLabels: Record<AppRole, string> = {
  admin: "Admin",
  lab_manager: "Lab Manager",
  scientist: "Doctor",
  technician: "Lab Assistant",
  qc_manager: "QC Manager",
  client: "Client"
};

export const roleDashboardRoutes: Record<AppRole, string> = {
  admin: "/admin/dashboard",
  lab_manager: "/manager/dashboard",
  scientist: "/scientist/dashboard",
  technician: "/technician/dashboard",
  qc_manager: "/qc/dashboard",
  client: "/client/dashboard"
};

export type RouteAccessRule = {
  prefix: string;
  allowedRoles: AppRole[];
};

// These rules are read by middleware before a page loads.
export const routeAccessRules: RouteAccessRule[] = [
  { prefix: "/admin", allowedRoles: ["admin"] },
  { prefix: "/manager", allowedRoles: ["lab_manager"] },
  { prefix: "/scientist", allowedRoles: ["scientist"] },
  { prefix: "/technician", allowedRoles: ["technician"] },
  { prefix: "/qc", allowedRoles: ["qc_manager"] },
  { prefix: "/client", allowedRoles: ["client"] },
  { prefix: "/dashboard", allowedRoles: ["admin", "lab_manager"] },
  { prefix: "/samples", allowedRoles: ["lab_manager", "scientist", "client"] }
];

export type DashboardNavigationItem = {
  title: string;
  description: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

export const roleDashboardContent: Record<
  AppRole,
  {
    title: string;
    description: string;
    workspaceLabel: string;
    persona: string;
    summary: string;
    metrics: Array<{ label: string; value: string; note: string }>;
    tabs: Array<{ name: string; detail: string }>;
    updates: Array<{ title: string; detail: string; time: string }>;
    navigation: DashboardNavigationItem[];
  }
> = {
  admin: {
    title: "Administration workspace",
    description:
      "Manage platform settings, user access, and reporting controls for the full LIMS environment.",
    workspaceLabel: "System control",
    persona: "Platform owner",
    summary: "Oversees users, settings, audit posture, and report governance.",
    metrics: [
      { label: "Active users", value: "38", note: "Across all business units" },
      { label: "Reports released", value: "214", note: "Last 30 days" },
      { label: "Open issues", value: "4", note: "Need admin attention" }
    ],
    tabs: [
      { name: "Users", detail: "Manage accounts, roles, and access boundaries." },
      { name: "Settings", detail: "Configure platform defaults and workflow policies." },
      { name: "Reports", detail: "Review releases, exports, and audit visibility." }
    ],
    updates: [
      { title: "User access review due", detail: "Quarterly review is scheduled for all active users.", time: "Today" },
      { title: "Report archive sync", detail: "System exports completed without errors overnight.", time: "08:20" }
    ],
    navigation: [
      {
        title: "System settings",
        description: "Review global configuration, security defaults, and operational options.",
        href: "/admin/settings",
        icon: Settings2
      },
      {
        title: "User administration",
        description: "Monitor accounts, profile assignments, and future permission changes.",
        href: "/admin/users",
        icon: Users2
      },
      {
        title: "Reports",
        description: "Open the reporting area used for system-wide visibility and exports.",
        href: "/admin/reports",
        icon: FileText
      }
    ]
  },
  lab_manager: {
    title: "Lab management workspace",
    description:
      "Oversee workflows, sample movement, and team execution across the daily operations pipeline.",
    workspaceLabel: "Operations command",
    persona: "Laboratory manager",
    summary: "Tracks intake, assignments, pending reports, and team throughput.",
    metrics: [
      { label: "Samples today", value: "126", note: "Registered since shift start" },
      { label: "Pending review", value: "19", note: "Doctor-facing reports waiting" },
      { label: "Instrument alerts", value: "3", note: "Require scheduling action" }
    ],
    tabs: [
      { name: "Overview", detail: "Monitor the full laboratory operation in one screen." },
      { name: "Samples", detail: "See sample progress and current handling teams." },
      { name: "Reports", detail: "Watch report drafting, review, and release queues." }
    ],
    updates: [
      { title: "Batch assigned", detail: "Microbiology batch M-241 received analyst assignment.", time: "11:05" },
      { title: "Doctor review queue", detail: "Six reports are ready to be checked before release.", time: "09:40" }
    ],
    navigation: [
      {
        title: "Operations dashboard",
        description: "Watch intake, queues, reviews, and throughput from one shared control page.",
        href: "/dashboard",
        icon: LayoutGrid
      },
      {
        title: "Sample workspace",
        description: "Track samples, assignments, and status updates across the lab lifecycle.",
        href: "/samples",
        icon: TestTube2
      },
      {
        title: "Manager home",
        description: "Return to the manager-specific dashboard at any time.",
        href: "/manager/dashboard",
        icon: ClipboardCheck
      }
    ]
  },
  scientist: {
    title: "Doctor review workspace",
    description:
      "Use this role for doctor-facing review, client report interpretation, and assigned medical result checks.",
    workspaceLabel: "Doctor review",
    persona: "Doctor or medical reviewer",
    summary: "Sees assigned client reports, reviews findings, and checks doctor-ready summaries.",
    metrics: [
      { label: "Assigned reports", value: "11", note: "Need doctor review" },
      { label: "Clients covered", value: "7", note: "Active patient groups" },
      { label: "Awaiting sign-off", value: "3", note: "Ready for final approval" }
    ],
    tabs: [
      { name: "Assigned Reports", detail: "Only reports linked to this doctor reviewer." },
      { name: "Client Cases", detail: "Client-wise grouping of samples and released outcomes." },
      { name: "Review Notes", detail: "Doctor remarks before report release." }
    ],
    updates: [
      { title: "Assigned case updated", detail: "Client CL-209 now has two reports ready for review.", time: "10:10" },
      { title: "Result flagged", detail: "Critical result for sample S-882 requires doctor comment.", time: "08:55" }
    ],
    navigation: [
      {
        title: "Assigned reports",
        description: "Open the report list that belongs to the current doctor reviewer.",
        href: "/scientist/dashboard",
        icon: FileText
      },
      {
        title: "Client-linked samples",
        description: "Check underlying samples related to the doctor&apos;s assigned report queue.",
        href: "/samples",
        icon: Stethoscope
      }
    ]
  },
  technician: {
    title: "Lab assistant workspace",
    description:
      "Use this role for sample registration, report detail entry, doctor assignment, and status handling at the bench level.",
    workspaceLabel: "Bench operations",
    persona: "Lab assistant",
    summary: "Manages sample status, prepares report details, and records the doctor assignment.",
    metrics: [
      { label: "Samples received", value: "42", note: "Current shift" },
      { label: "Reports drafting", value: "14", note: "Need detail entry" },
      { label: "Doctor assignments", value: "9", note: "Ready to forward" }
    ],
    tabs: [
      { name: "Registration", detail: "Capture new sample and client intake." },
      { name: "Status Tracking", detail: "Update progress from received to released." },
      { name: "Report Entry", detail: "Add result details and assign the doctor reviewer." }
    ],
    updates: [
      { title: "Sample registered", detail: "Three new chemistry samples were added in the last hour.", time: "11:20" },
      { title: "Doctor assigned", detail: "Dr. Rao assigned to report R-551 for final review.", time: "10:30" }
    ],
    navigation: [
      {
        title: "Sample registration",
        description: "Access the shared sample intake workspace used by the operations team.",
        href: "/samples",
        icon: TestTube2
      },
      {
        title: "Bench dashboard",
        description: "Return to the lab assistant dashboard and status summary.",
        href: "/technician/dashboard",
        icon: FlaskConical
      },
      {
        title: "Pending handoff",
        description: "Check reports waiting for doctor assignment or final detail completion.",
        href: "/samples",
        icon: Truck
      }
    ]
  },
  qc_manager: {
    title: "Quality control workspace",
    description:
      "Review deviations, approvals, and release decisions with controls focused on QA oversight.",
    workspaceLabel: "Quality oversight",
    persona: "QC manager",
    summary: "Approves release readiness, deviation handling, and quality checkpoints.",
    metrics: [
      { label: "Pending approvals", value: "8", note: "Waiting QC sign-off" },
      { label: "Open deviations", value: "2", note: "Require action plan" },
      { label: "Release holds", value: "1", note: "Blocked until review" }
    ],
    tabs: [
      { name: "Approvals", detail: "Approve or reject quality checkpoints." },
      { name: "Deviations", detail: "Review unresolved process exceptions." },
      { name: "Release Control", detail: "Authorize reports before they leave the lab." }
    ],
    updates: [
      { title: "Deviation opened", detail: "QC deviation D-14 logged for reagent temperature drift.", time: "09:15" },
      { title: "Release approved", detail: "Four reports cleared for client release.", time: "07:50" }
    ],
    navigation: [
      {
        title: "QC approvals",
        description: "Open the quality control review area for release and approval checkpoints.",
        href: "/qc",
        icon: ShieldCheck
      },
      {
        title: "QC home",
        description: "Return to the quality control dashboard and pending approval view.",
        href: "/qc/dashboard",
        icon: ClipboardCheck
      }
    ]
  },
  client: {
    title: "Client portal workspace",
    description:
      "Track sample status and published reports from a simplified portal experience.",
    workspaceLabel: "Client portal",
    persona: "Client user",
    summary: "Only sees their own sample progress and the reports released to their account.",
    metrics: [
      { label: "My reports", value: "5", note: "Available for download" },
      { label: "In progress", value: "2", note: "Samples still under testing" },
      { label: "Recent updates", value: "3", note: "Since last login" }
    ],
    tabs: [
      { name: "My Reports", detail: "Only reports belonging to this client account." },
      { name: "Sample Status", detail: "Status updates for submitted samples." },
      { name: "Downloads", detail: "Released report files and acknowledgements." }
    ],
    updates: [
      { title: "Report released", detail: "Report RP-401 is now available in your portal.", time: "Today" },
      { title: "Sample in testing", detail: "Sample SM-223 moved into analytical testing.", time: "Yesterday" }
    ],
    navigation: [
      {
        title: "Client portal",
        description: "View status updates and shared reports intended for external clients.",
        href: "/client",
        icon: FileText
      },
      {
        title: "My samples",
        description: "View only the samples that belong to the signed-in client account.",
        href: "/samples",
        icon: ClipboardCheck
      },
      {
        title: "Client home",
        description: "Return to the client dashboard and portal summary.",
        href: "/client/dashboard",
        icon: LayoutGrid
      }
    ]
  }
};

export function isAppRole(value: string | null | undefined): value is AppRole {
  return appRoles.includes(value as AppRole);
}

export function getDashboardPathForRole(role: AppRole) {
  return roleDashboardRoutes[role];
}

export function getAccessRuleForPath(pathname: string) {
  return routeAccessRules.find(
    (rule) => pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`)
  );
}
