import { and, desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  CreateOperationsRecordBody,
  DeleteOperationsRecordParams,
  GetOperationsSummaryResponse,
  ListOperationsRecordsQueryParams,
  ListOperationsRecordsResponseItem,
  UpdateOperationsRecordBody,
  UpdateOperationsRecordParams,
} from "@workspace/api-zod";
import { db, operationsRecords } from "@workspace/db";

const router: IRouter = Router();
const demoOrganizationId = "fieldwise-demo";

function serializeRecord(record: unknown) {
  const parsed = ListOperationsRecordsResponseItem.parse(record);
  return {
    ...parsed,
    dueDate: parsed.dueDate?.toISOString().slice(0, 10) ?? null,
    createdAt: parsed.createdAt.toISOString(),
  };
}

const demoRecords = [
  {
    kind: "task",
    title: "Complete opening temperature log",
    detail: "Record fridge and freezer temperatures before the morning rush.",
    status: "In Progress",
    assignee: "Mariam Hassan",
    branch: "Zamalek",
    department: "Operations",
    priority: "High",
    dueDate: "2026-10-09",
    progress: 65,
  },
  {
    kind: "task",
    title: "Review weekly stock variance",
    detail: "Compare physical counts with the inventory report.",
    status: "Todo",
    assignee: "Omar Nabil",
    branch: "Maadi",
    department: "Inventory",
    priority: "Normal",
    dueDate: "2026-10-10",
    progress: 0,
  },
  {
    kind: "task",
    title: "Refresh counter service checklist",
    detail: "Check the service station and refill take-away supplies.",
    status: "Completed",
    assignee: "Youssef Adel",
    branch: "Heliopolis",
    department: "Front of house",
    priority: "Low",
    dueDate: "2026-10-08",
    progress: 100,
  },
  {
    kind: "task",
    title: "Schedule equipment maintenance",
    detail: "Confirm a technician visit for the espresso machine.",
    status: "Blocked",
    assignee: "Nour Samir",
    branch: "Zamalek",
    department: "Facilities",
    priority: "Urgent",
    dueDate: "2026-10-11",
    progress: 25,
  },
  {
    kind: "task",
    title: "Prepare weekend team rota",
    detail: "Balance coverage across lunch and evening shifts.",
    status: "Todo",
    assignee: "Mariam Hassan",
    branch: "Maadi",
    department: "People",
    priority: "Normal",
    dueDate: "2026-10-12",
    progress: 0,
  },
  {
    kind: "request",
    title: "Cold room door seal replacement",
    detail: "The walk-in cooler is losing temperature overnight.",
    status: "In Progress",
    assignee: "Facilities",
    branch: "Zamalek",
    department: "Maintenance",
    priority: "Urgent",
    dueDate: "2026-10-09",
    progress: 50,
  },
  {
    kind: "request",
    title: "Uniform size exchange",
    detail: "Exchange two new team uniforms for different sizes.",
    status: "Open",
    assignee: "HR team",
    branch: "Maadi",
    department: "People",
    priority: "Normal",
    dueDate: "2026-10-13",
    progress: 0,
  },
  {
    kind: "request",
    title: "Tablet connection issue",
    detail: "The register tablet disconnects from the branch network.",
    status: "Waiting",
    assignee: "IT support",
    branch: "Heliopolis",
    department: "IT",
    priority: "High",
    dueDate: "2026-10-10",
    progress: 30,
  },
  {
    kind: "employee",
    title: "Mariam Hassan",
    detail: "Branch manager · Joined 2023",
    status: "Active",
    assignee: "Mariam Hassan",
    branch: "Zamalek",
    department: "Management",
    priority: "Normal",
    dueDate: null,
    progress: 94,
  },
  {
    kind: "employee",
    title: "Omar Nabil",
    detail: "Operations lead · Joined 2024",
    status: "Active",
    assignee: "Omar Nabil",
    branch: "Maadi",
    department: "Operations",
    priority: "Normal",
    dueDate: null,
    progress: 82,
  },
  {
    kind: "employee",
    title: "Nour Samir",
    detail: "Service team · Joined 2025",
    status: "Active",
    assignee: "Nour Samir",
    branch: "Zamalek",
    department: "Front of house",
    priority: "Normal",
    dueDate: null,
    progress: 71,
  },
  {
    kind: "employee",
    title: "Youssef Adel",
    detail: "Shift supervisor · Joined 2022",
    status: "Active",
    assignee: "Youssef Adel",
    branch: "Heliopolis",
    department: "Operations",
    priority: "Normal",
    dueDate: null,
    progress: 88,
  },
  {
    kind: "branch",
    title: "Zamalek",
    detail: "Flagship · Cairo",
    status: "Healthy",
    assignee: "Mariam Hassan",
    branch: "Zamalek",
    department: "All teams",
    priority: "Normal",
    dueDate: null,
    progress: 91,
  },
  {
    kind: "branch",
    title: "Maadi",
    detail: "Garden City · Cairo",
    status: "Healthy",
    assignee: "Omar Nabil",
    branch: "Maadi",
    department: "All teams",
    priority: "Normal",
    dueDate: null,
    progress: 86,
  },
  {
    kind: "branch",
    title: "Heliopolis",
    detail: "Korba · Cairo",
    status: "Attention",
    assignee: "Youssef Adel",
    branch: "Heliopolis",
    department: "All teams",
    priority: "High",
    dueDate: null,
    progress: 68,
  },
  {
    kind: "training",
    title: "Food safety essentials",
    detail: "Annual hygiene and safe-handling refresher.",
    status: "In Progress",
    assignee: "Operations team",
    branch: "All branches",
    department: "Operations",
    priority: "High",
    dueDate: "2026-10-16",
    progress: 76,
  },
  {
    kind: "training",
    title: "Service standards",
    detail: "A practical guide to the Fieldwise guest experience.",
    status: "In Progress",
    assignee: "Front of house",
    branch: "All branches",
    department: "Front of house",
    priority: "Normal",
    dueDate: "2026-10-20",
    progress: 63,
  },
  {
    kind: "sop",
    title: "Daily opening procedure",
    detail: "A consistent start-of-day routine for every branch.",
    status: "Published",
    assignee: "Operations team",
    branch: "All branches",
    department: "Operations",
    priority: "Normal",
    dueDate: null,
    progress: 92,
  },
  {
    kind: "checklist",
    title: "Closing standards",
    detail: "Secure the floor, equipment, and cash-up before close.",
    status: "Active",
    assignee: "Shift leads",
    branch: "All branches",
    department: "Operations",
    priority: "Normal",
    dueDate: null,
    progress: 84,
  },
  {
    kind: "kpi",
    title: "Guest satisfaction",
    detail: "Target: 4.7 / 5 · Monthly",
    status: "On Track",
    assignee: "Branch managers",
    branch: "All branches",
    department: "Service",
    priority: "Normal",
    dueDate: null,
    progress: 89,
  },
  {
    kind: "kpi",
    title: "Training completion",
    detail: "Target: 90% · Monthly",
    status: "At Risk",
    assignee: "HR team",
    branch: "All branches",
    department: "People",
    priority: "High",
    dueDate: null,
    progress: 76,
  },
];

async function seedDemoRecords() {
  const existing = await db
    .select({ id: operationsRecords.id })
    .from(operationsRecords)
    .where(eq(operationsRecords.organizationId, demoOrganizationId))
    .limit(1);
  if (existing.length) return;
  await db.insert(operationsRecords).values(
    demoRecords.map((record) => ({
      ...record,
      organizationId: demoOrganizationId,
    })),
  );
}

router.get("/operations/records", async (req, res, next) => {
  try {
    const query = ListOperationsRecordsQueryParams.safeParse(req.query);
    if (!query.success) {
      res.status(400).json({ error: "Invalid record filter." });
      return;
    }
    await seedDemoRecords();
    const where = query.data.kind
      ? and(
          eq(operationsRecords.organizationId, demoOrganizationId),
          eq(operationsRecords.kind, query.data.kind),
        )
      : eq(operationsRecords.organizationId, demoOrganizationId);
    const rows = await db
      .select()
      .from(operationsRecords)
      .where(where)
      .orderBy(desc(operationsRecords.createdAt), desc(operationsRecords.id));
    res.json(rows.map(serializeRecord));
  } catch (error) {
    next(error);
  }
});

router.post("/operations/records", async (req, res, next) => {
  try {
    const input = CreateOperationsRecordBody.safeParse(req.body);
    if (!input.success) {
      res.status(400).json({ error: "Invalid record details." });
      return;
    }
    await seedDemoRecords();
    const values = input.data;
    const [created] = await db
      .insert(operationsRecords)
      .values({
        organizationId: demoOrganizationId,
        kind: values.kind,
        title: values.title.trim(),
        detail: values.detail ?? "",
        status: values.status ?? "Open",
        assignee: values.assignee ?? "Unassigned",
        branch: values.branch ?? "All branches",
        department: values.department ?? "Operations",
        priority: values.priority ?? "Normal",
        dueDate:
          values.dueDate instanceof Date
            ? values.dueDate.toISOString().slice(0, 10)
            : null,
        progress: values.progress ?? 0,
      })
      .returning();
    res.status(201).json(serializeRecord(created));
  } catch (error) {
    next(error);
  }
});

router.patch("/operations/records/:id", async (req, res, next) => {
  try {
    const params = UpdateOperationsRecordParams.safeParse(req.params);
    const input = UpdateOperationsRecordBody.safeParse(req.body);
    if (!params.success || !input.success) {
      res.status(400).json({ error: "Invalid record update." });
      return;
    }
    const update = input.data;
    const [updated] = await db
      .update(operationsRecords)
      .set({
        ...update,
        dueDate:
          update.dueDate === undefined
            ? undefined
            : update.dueDate === null
              ? null
              : update.dueDate.toISOString().slice(0, 10),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(operationsRecords.organizationId, demoOrganizationId),
          eq(operationsRecords.id, params.data.id),
        ),
      )
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Record not found." });
      return;
    }
    res.json(serializeRecord(updated));
  } catch (error) {
    next(error);
  }
});

router.delete("/operations/records/:id", async (req, res, next) => {
  try {
    const params = DeleteOperationsRecordParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Invalid record id." });
      return;
    }
    const deleted = await db
      .delete(operationsRecords)
      .where(
        and(
          eq(operationsRecords.organizationId, demoOrganizationId),
          eq(operationsRecords.id, params.data.id),
        ),
      )
      .returning({ id: operationsRecords.id });
    if (!deleted.length) {
      res.status(404).json({ error: "Record not found." });
      return;
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.get("/operations/summary", async (_req, res, next) => {
  try {
    await seedDemoRecords();
    const rows = await db
      .select()
      .from(operationsRecords)
      .where(eq(operationsRecords.organizationId, demoOrganizationId))
      .orderBy(desc(operationsRecords.createdAt), desc(operationsRecords.id));
    const averageProgress = (kind: string) => {
      const items = rows.filter((row) => row.kind === kind);
      return items.length
        ? Math.round(
            items.reduce((total, item) => total + item.progress, 0) /
              items.length,
          )
        : 0;
    };
    const summary = GetOperationsSummaryResponse.parse({
      employees: rows.filter((row) => row.kind === "employee").length,
      branches: rows.filter((row) => row.kind === "branch").length,
      tasksOpen: rows.filter(
        (row) =>
          row.kind === "task" &&
          !["Completed", "Cancelled"].includes(row.status),
      ).length,
      requestsOpen: rows.filter(
        (row) =>
          row.kind === "request" &&
          !["Resolved", "Closed"].includes(row.status),
      ).length,
      trainingCompletion: averageProgress("training"),
      kpiAchievement: averageProgress("kpi"),
      recentActivity: rows.slice(0, 8),
    });
    res.json({
      ...summary,
      recentActivity: summary.recentActivity.map(serializeRecord),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
