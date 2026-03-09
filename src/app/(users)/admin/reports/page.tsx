"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, Card, CardContent, Tabs, Tab, Chip,
} from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, BarChart2, Users, CheckCircle } from "lucide-react";
import { adminReportApi } from "@/app/apiService/adminApi";
import toast from "react-hot-toast";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#6b7280"];

interface RevenueData {
  total_revenue: number;
  total_bookings: number;
  average_booking_value: number;
  daily_breakdown: Record<string, { revenue: number; bookings: number }>;
}

interface PerformanceData {
  total_bookings: number;
  status_breakdown: Record<string, { count: number; percentage: number; display_name: string }>;
  completion_rate: number;
  cancellation_rate: number;
}

interface AssignmentData {
  total_bookings: number;
  assigned_bookings: number;
  unassigned_bookings: number;
  assignment_rate: number;
  employee_performance: { employee_id: number; name: string; email: string; total_assigned: number; completed: number; completion_rate: number }[];
}

const KPICard = ({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) => (
  <Card sx={{ borderRadius: 3, border: `1px solid ${color}22`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
          <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>{value}</Typography>
        </Box>
        <Box sx={{ bgcolor: `${color}18`, borderRadius: 2, p: 1, color }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

export default function AdminReportsPage() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [assignments, setAssignments] = useState<AssignmentData | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const [revRes, perfRes, assignRes] = await Promise.all([
        adminReportApi.get({ report_type: "revenue" }),
        adminReportApi.get({ report_type: "performance" }),
        adminReportApi.get({ report_type: "assignments" }),
      ]);
      setRevenue(revRes.data?.data as unknown as RevenueData ?? null);
      setPerformance(perfRes.data?.data as unknown as PerformanceData ?? null);
      setAssignments(assignRes.data?.data as unknown as AssignmentData ?? null);
    } catch (err) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  // Transform daily breakdown for chart
  const dailyChart = revenue?.daily_breakdown
    ? Object.entries(revenue.daily_breakdown)
        .map(([date, v]) => ({
          date,
          revenue: Number(v.revenue) || 0,
          bookings: v.bookings || 0,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
    : [];

  // Transform status breakdown for pie chart
  const statusChart = performance?.status_breakdown
    ? Object.entries(performance.status_breakdown).map(([, v]) => ({
        name: v.display_name,
        value: v.count,
        pct: v.percentage,
      }))
    : [];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #f59e0b", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
      </Box>
    );
  }

  const tabItems = ["Revenue & Bookings", "Booking Performance", "Employee Assignments"];

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
          Reports & Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Platform performance and business insights
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
        <KPICard
          label="Total Revenue"
          value={revenue ? `₹${Number(revenue.total_revenue).toLocaleString("en-IN")}` : "—"}
          icon={<TrendingUp size={20} />}
          color="#10b981"
        />
        <KPICard
          label="Total Bookings"
          value={revenue ? String(revenue.total_bookings) : "—"}
          icon={<BarChart2 size={20} />}
          color="#3b82f6"
        />
        <KPICard
          label="Completion Rate"
          value={performance ? `${performance.completion_rate.toFixed(1)}%` : "—"}
          icon={<CheckCircle size={20} />}
          color="#8b5cf6"
        />
        <KPICard
          label="Assignment Rate"
          value={assignments ? `${assignments.assignment_rate.toFixed(1)}%` : "—"}
          icon={<Users size={20} />}
          color="#f59e0b"
        />
      </Box>

      {/* Chart Tabs */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", mb: 3 }}>
        <Box sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2, "& .MuiTab-root": { fontSize: "0.82rem", fontWeight: 600, minWidth: "auto" } }}
          >
            {tabItems.map((t) => <Tab key={t} label={t} />)}
          </Tabs>
        </Box>

        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          {/* Tab 0: Revenue & Bookings */}
          {tab === 0 && (
            <motion.div key="rev" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Daily Revenue &amp; Bookings
              </Typography>
              {dailyChart.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={dailyChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <Tooltip
                      labelFormatter={((l: any) => new Date(String(l)).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })) as any}
                      formatter={((v: any, n: any) => [n === "revenue" ? `₹${Number(v ?? 0).toLocaleString("en-IN")}` : (v ?? 0), n === "revenue" ? "Revenue" : "Bookings"]) as any}
                    />
                    <Bar yAxisId="left" dataKey="revenue" name="revenue" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                    <Bar yAxisId="right" dataKey="bookings" name="bookings" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography color="text.secondary">No revenue data for this period</Typography>
                </Box>
              )}

              {/* Summary row */}
              {revenue && (
                <Box sx={{ display: "flex", gap: 3, mt: 2, flexWrap: "wrap" }}>
                  {[
                    { label: "Total Revenue", val: `₹${Number(revenue.total_revenue).toLocaleString("en-IN")}`, color: "#f59e0b" },
                    { label: "Total Bookings", val: String(revenue.total_bookings), color: "#3b82f6" },
                    { label: "Avg. Booking Value", val: `₹${Number(revenue.average_booking_value).toLocaleString("en-IN")}`, color: "#10b981" },
                  ].map((item) => (
                    <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                        <Typography variant="body2" fontWeight={700}>{item.val}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </motion.div>
          )}

          {/* Tab 1: Booking Performance */}
          {tab === 1 && (
            <motion.div key="perf" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Booking Status Breakdown
              </Typography>

              {statusChart.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, alignItems: "center" }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusChart}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                        label={((props: any) => `${props.name} (${Number(props.pct ?? 0).toFixed(1)}%)`) as any}
                      >
                        {statusChart.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={((v: any) => [v ?? 0, "Bookings"]) as any} />
                    </PieChart>
                  </ResponsiveContainer>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 200 }}>
                    {statusChart.map((item, idx) => (
                      <Box key={item.name} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: COLORS[idx % COLORS.length], flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ flex: 1 }}>{item.name}</Typography>
                        <Typography variant="body2" fontWeight={700}>{item.value}</Typography>
                        <Chip label={`${item.pct.toFixed(1)}%`} size="small" sx={{ fontSize: "0.7rem", height: 20, fontWeight: 600 }} />
                      </Box>
                    ))}
                    {performance && (
                      <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #f3f4f6" }}>
                        <Typography variant="caption" color="text.secondary">
                          Completion: <strong>{performance.completion_rate.toFixed(1)}%</strong> · Cancellation: <strong>{performance.cancellation_rate.toFixed(1)}%</strong>
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography color="text.secondary">No performance data available</Typography>
                </Box>
              )}
            </motion.div>
          )}

          {/* Tab 2: Employee Assignments */}
          {tab === 2 && (
            <motion.div key="assign" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Employee Assignment Performance
              </Typography>

              {assignments && (
                <>
                  <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                    {[
                      { label: "Total Bookings", val: assignments.total_bookings, color: "#3b82f6" },
                      { label: "Assigned", val: assignments.assigned_bookings, color: "#10b981" },
                      { label: "Unassigned", val: assignments.unassigned_bookings, color: "#ef4444" },
                    ].map((item) => (
                      <Box key={item.label} sx={{ bgcolor: `${item.color}10`, border: `1px solid ${item.color}30`, borderRadius: 2, px: 2.5, py: 1.5 }}>
                        <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ color: item.color }}>{item.val}</Typography>
                      </Box>
                    ))}
                  </Box>

                  {assignments.employee_performance.length > 0 ? (
                    <Box sx={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                            {["#", "Employee", "Email", "Assigned", "Completed", "Completion Rate"].map((h) => (
                              <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, fontSize: "0.82rem", color: "#6b7280", whiteSpace: "nowrap" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {assignments.employee_performance.map((emp, idx) => (
                            <tr key={emp.employee_id} style={{ borderBottom: "1px solid #f9fafb" }}>
                              <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: "#9ca3af" }}>{idx + 1}</td>
                              <td style={{ padding: "10px 12px", fontWeight: 600, fontSize: "0.85rem" }}>{emp.name}</td>
                              <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: "#6b7280" }}>{emp.email}</td>
                              <td style={{ padding: "10px 12px", fontWeight: 700 }}>{emp.total_assigned}</td>
                              <td style={{ padding: "10px 12px", fontWeight: 700, color: "#10b981" }}>{emp.completed}</td>
                              <td style={{ padding: "10px 12px" }}>
                                <Chip label={`${emp.completion_rate.toFixed(1)}%`} size="small" color={emp.completion_rate >= 80 ? "success" : emp.completion_rate >= 50 ? "warning" : "error"} sx={{ fontWeight: 700, fontSize: "0.72rem" }} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  ) : (
                    <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                      No employee assignment data available.
                    </Typography>
                  )}
                </>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
