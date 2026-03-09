"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, Card, CardContent, Chip, Button,
  IconButton, Tooltip, LinearProgress, useTheme, useMediaQuery,
} from "@mui/material";
import {
  TrendingUp, CurrencyRupee, CalendarMonth, Groups,
  Pending, ArrowUpward,
  MoreVert, Notifications, OpenInNew, Refresh,
  CheckCircle, Schedule, Cancel, Warning,
} from "@mui/icons-material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import Link from "next/link";
import CountUp from "react-countup";
import {
  adminDashboardApi, adminReportApi,
  type DashboardOverview, type RecentBooking,
} from "@/app/apiService/adminApi";
import toast from "react-hot-toast";

// ─── Quick action shortcuts ───────────────────────────────────────────────────
const quickActions = [
  { label: "Users", href: "/admin/users", color: "#3b82f6", bg: "#eff6ff" },
  { label: "Bookings", href: "/admin/bookings", color: "#10b981", bg: "#ecfdf5" },
  { label: "Payments", href: "/admin/payments", color: "#f59e0b", bg: "#fffbeb" },
  { label: "Reports", href: "/admin/reports", color: "#8b5cf6", bg: "#f5f3ff" },
  { label: "Employees", href: "/admin/employees", color: "#06b6d4", bg: "#ecfeff" },
  { label: "Support", href: "/admin/support", color: "#ef4444", bg: "#fef2f2" },
];

// ─── Stat card component ──────────────────────────────────────────────────────
const StatCard = ({
  title, value, prefix, suffix, icon, color, delay,
}: {
  title: string; value: number | string; prefix?: string; suffix?: string;
  icon: React.ReactNode; color: string; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay }}
    style={{ height: "100%" }}
  >
    <Card
      sx={{
        borderRadius: 3, height: "100%", position: "relative", overflow: "hidden",
        border: "1px solid", borderColor: `${color}22`,
        boxShadow: `0 4px 24px ${color}14`,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": { transform: "translateY(-3px)", boxShadow: `0 8px 32px ${color}28` },
      }}
    >
      <Box sx={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", bgcolor: `${color}12` }} />
      <Box sx={{ position: "absolute", top: -8, right: -8, width: 60, height: 60, borderRadius: "50%", bgcolor: `${color}1a` }} />

      <CardContent sx={{ p: { xs: 2, md: 2.5 }, position: "relative" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ bgcolor: `${color}18`, borderRadius: 2.5, p: 1.2, color, display: "flex" }}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, mb: 0.5 }}>
          {prefix && <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>{prefix}</span>}
          {typeof value === "number" ? (
            <CountUp end={value} duration={2.2} separator="," />
          ) : value}
          {suffix && <span style={{ fontSize: "1rem", fontWeight: 600 }}>{suffix}</span>}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>{title}</Typography>
      </CardContent>
    </Card>
  </motion.div>
);

// ─── Booking status helpers ───────────────────────────────────────────────────
const bookingStatusConfig: Record<string, { color: "success" | "warning" | "error" | "info" | "default"; icon: React.ReactNode }> = {
  COMPLETED: { color: "success", icon: <CheckCircle sx={{ fontSize: 14 }} /> },
  CONFIRMED: { color: "info", icon: <Schedule sx={{ fontSize: 14 }} /> },
  PENDING: { color: "warning", icon: <Pending sx={{ fontSize: 14 }} /> },
  CANCELLED: { color: "error", icon: <Cancel sx={{ fontSize: 14 }} /> },
  REJECTED: { color: "error", icon: <Cancel sx={{ fontSize: 14 }} /> },
  FAILED: { color: "error", icon: <Warning sx={{ fontSize: 14 }} /> },
};

export default function AdminDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState<{ date: string; revenue: number; bookings: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [dashRes, revenueRes] = await Promise.all([
        adminDashboardApi.get(30),
        adminReportApi.get({ report_type: "revenue" }),
      ]);

      const dashData = dashRes.data?.data ?? dashRes.data;
      if (dashData) {
        setOverview((dashData as { overview: DashboardOverview }).overview ?? null);
        setRecentBookings((dashData as { recent_bookings: RecentBooking[] }).recent_bookings ?? []);
      }

      // Parse daily breakdown for chart
      const revData = revenueRes.data?.data as { daily_breakdown?: Record<string, { revenue: number; bookings: number }> } | undefined;
      if (revData?.daily_breakdown) {
        const entries = Object.entries(revData.daily_breakdown)
          .map(([date, v]) => ({ date, revenue: Number(v.revenue) || 0, bookings: v.bookings || 0 }))
          .sort((a, b) => a.date.localeCompare(b.date));
        setDailyRevenue(entries);
      }
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const completionRate = overview && overview.total_bookings > 0
    ? Math.round((overview.completed_bookings / overview.total_bookings) * 100)
    : 0;

  const assignmentRate = overview && overview.total_bookings > 0
    ? Math.round((overview.assigned_bookings / overview.total_bookings) * 100)
    : 0;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <Box sx={{ textAlign: "center" }}>
          <Box sx={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #7c3aed", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", mx: "auto", mb: 2 }} />
          <Typography color="text.secondary">Loading dashboard…</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
      {/* ── Hero Header ──────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box
          sx={{
            borderRadius: 4, mb: 3, overflow: "hidden", position: "relative",
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 70%, #7c3aed 100%)",
            p: { xs: 2.5, md: 3.5 }, color: "white",
          }}
        >
          <Box sx={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.05)" }} />
          <Box sx={{ position: "absolute", bottom: -30, left: "30%", width: 150, height: 150, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.03)" }} />

          <Box sx={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
            <Box>
              <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.7)", letterSpacing: 2, fontSize: "0.72rem" }}>
                OKPUJA ADMIN
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, mt: 0.5, mb: 0.5 }}>
                Welcome back 👋
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: "0.88rem" }}>
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </Typography>
              {overview && (
                <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
                  {[
                    { label: "Revenue", val: `₹${(parseFloat(overview.total_revenue) / 1000).toFixed(0)}K` },
                    { label: "Bookings", val: overview.total_bookings },
                    { label: "Employees", val: overview.active_employees },
                    { label: "Today", val: overview.today_bookings },
                  ].map((kpi) => (
                    <Box key={kpi.label} sx={{ bgcolor: "rgba(255,255,255,0.1)", borderRadius: 2, px: 2, py: 0.8, backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)", display: "block", fontSize: "0.7rem" }}>{kpi.label}</Typography>
                      <Typography variant="body1" fontWeight={700} sx={{ fontSize: "0.95rem" }}>{kpi.val}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: { xs: "flex-start", sm: "flex-end" } }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="Refresh">
                  <IconButton onClick={fetchDashboard} size="small" sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.25)" } }}>
                    <Refresh fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Notifications">
                  <IconButton size="small" sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.25)" } }}>
                    <Notifications fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Button
                component={Link}
                href="/admin/bookings"
                variant="contained"
                size="small"
                sx={{ bgcolor: "white", color: "#4c1d95", fontWeight: 700, borderRadius: 2, px: 2.5, "&:hover": { bgcolor: "#f3e8ff" }, whiteSpace: "nowrap" }}
              >
                View All Bookings
              </Button>
            </Box>
          </Box>
        </Box>
      </motion.div>

      {/* ── KPI Stat Cards ──────────────────────────────────────────────────── */}
      {overview && (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)", lg: "repeat(6, 1fr)" }, gap: { xs: 1.5, md: 2 }, mb: 3 }}>
          <StatCard title="Total Revenue" value={parseFloat(overview.total_revenue)} prefix="₹" icon={<CurrencyRupee />} color="#10b981" delay={0} />
          <StatCard title="Total Bookings" value={overview.total_bookings} icon={<CalendarMonth />} color="#3b82f6" delay={0.05} />
          <StatCard title="Active Employees" value={overview.active_employees} icon={<Groups />} color="#8b5cf6" delay={0.1} />
          <StatCard title="Pending Bookings" value={overview.pending_bookings} icon={<Pending />} color="#f59e0b" delay={0.15} />
          <StatCard title="Overdue Bookings" value={overview.overdue_bookings} icon={<Warning />} color="#ef4444" delay={0.2} />
          <StatCard title="Completion Rate" value={`${completionRate}%`} icon={<TrendingUp />} color="#06b6d4" delay={0.25} />
        </Box>
      )}

      {/* ── Main Content Grid ────────────────────────────────────────────────── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 360px" }, gap: 2.5, mb: 2.5 }}>
        {/* Left: Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card sx={{ borderRadius: 3, height: "100%", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Revenue Analytics</Typography>
                  <Typography variant="body2" color="text.secondary">Daily revenue — last 30 days</Typography>
                </Box>
                <IconButton size="small"><MoreVert fontSize="small" /></IconButton>
              </Box>

              {dailyRevenue.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={dailyRevenue} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    />
                    <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${v / 1000}K`} />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                      formatter={((v: any) => [`₹${Number(v ?? 0).toLocaleString("en-IN")}`, "Revenue"]) as any}
                      labelFormatter={((l: any) => new Date(String(l)).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })) as any}
                    />
                    <Bar dataKey="revenue" name="Revenue" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography color="text.secondary">No revenue data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Quick Actions + Status Breakdown */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Quick Navigation</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1 }}>
                  {quickActions.map((a) => (
                    <Button
                      key={a.href}
                      component={Link}
                      href={a.href}
                      variant="text"
                      sx={{
                        display: "flex", flexDirection: "column", gap: 0.5, py: 1.5, px: 1,
                        bgcolor: a.bg, color: a.color, borderRadius: 2.5, fontSize: "0.75rem",
                        fontWeight: 700, textTransform: "none", minWidth: 0,
                        "&:hover": { bgcolor: `${a.color}22` },
                      }}
                    >
                      <OpenInNew sx={{ fontSize: 18, color: a.color }} />
                      {a.label}
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Booking Status Breakdown */}
          {overview && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", flex: 1 }}>
                <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Booking Status</Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {[
                      { label: "Confirmed", val: overview.confirmed_bookings, color: "#3b82f6" },
                      { label: "Completed", val: overview.completed_bookings, color: "#10b981" },
                      { label: "Pending", val: overview.pending_bookings, color: "#f59e0b" },
                      { label: "Cancelled", val: overview.cancelled_bookings, color: "#ef4444" },
                      { label: "Assigned", val: overview.assigned_bookings, color: "#8b5cf6" },
                      { label: "Unassigned", val: overview.unassigned_bookings, color: "#06b6d4" },
                    ].map((item) => (
                      <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ flex: 1, fontSize: "0.82rem" }}>{item.label}</Typography>
                        <Typography variant="body2" fontWeight={700}>{item.val}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </Box>
      </Box>

      {/* ── Bottom Row: Recent Bookings + Health Metrics ───────────────── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "1fr 360px" }, gap: 2.5, mb: 2.5 }}>
        {/* Recent Bookings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Recent Bookings</Typography>
                  <Typography variant="body2" color="text.secondary">Latest booking requests</Typography>
                </Box>
                <Button component={Link} href="/admin/bookings" size="small" endIcon={<OpenInNew sx={{ fontSize: 14 }} />} sx={{ color: "#7c3aed", fontWeight: 700, fontSize: "0.8rem" }}>
                  View All
                </Button>
              </Box>

              {!isMobile ? (
                <Box sx={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
                        {["ID", "Customer", "Date", "Employee", "Amount", "Status", "Age"].map((h) => (
                          <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "0.79rem", fontWeight: 700, color: "#9ca3af", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.length === 0 ? (
                        <tr><td colSpan={7} style={{ padding: "24px 12px", textAlign: "center", color: "#9ca3af" }}>No recent bookings.</td></tr>
                      ) : (
                        recentBookings.slice(0, 8).map((b) => (
                          <tr key={b.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                            <td style={{ padding: "10px 12px", fontSize: "0.82rem", fontWeight: 700, color: "#f59e0b" }}>{b.book_id}</td>
                            <td style={{ padding: "10px 12px", fontWeight: 600, fontSize: "0.83rem" }}>{b.user_name}</td>
                            <td style={{ padding: "10px 12px", fontSize: "0.83rem", color: "#374151", whiteSpace: "nowrap" }}>{b.selected_date}</td>
                            <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: b.assigned_to_name ? "#10b981" : "#9ca3af" }}>
                              {b.assigned_to_name ?? <em>Unassigned</em>}
                            </td>
                            <td style={{ padding: "10px 12px", fontWeight: 700, whiteSpace: "nowrap" }}>₹{Number(b.total_amount).toLocaleString("en-IN")}</td>
                            <td style={{ padding: "10px 12px" }}>
                              <Chip
                                label={b.status}
                                size="small"
                                color={bookingStatusConfig[b.status]?.color ?? "default"}
                                sx={{ fontWeight: 600, fontSize: "0.72rem" }}
                              />
                            </td>
                            <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: b.is_overdue ? "#ef4444" : "#9ca3af", whiteSpace: "nowrap" }}>{b.booking_age}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {recentBookings.slice(0, 5).map((b) => (
                    <Box key={b.id} sx={{ p: 2, borderRadius: 2, border: "1px solid #f3f4f6", bgcolor: "#fafafa" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={700} sx={{ color: "#f59e0b" }}>{b.book_id}</Typography>
                        <Chip label={b.status} size="small" color={bookingStatusConfig[b.status]?.color ?? "default"} sx={{ fontWeight: 600, fontSize: "0.7rem" }} />
                      </Box>
                      <Typography variant="body2" fontWeight={600}>{b.user_name}</Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">{b.selected_date}</Typography>
                        <Typography variant="caption" fontWeight={700}>₹{Number(b.total_amount).toLocaleString("en-IN")}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Platform Health */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}>
          <Card sx={{ borderRadius: 3, height: "100%", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
            <CardContent sx={{ p: { xs: 2, md: 2.5 }, height: "100%", display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>Platform Health</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Key operational metrics</Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                {[
                  { label: "Booking Completion", val: completionRate, color: "#10b981" },
                  { label: "Assignment Rate", val: assignmentRate, color: "#3b82f6" },
                  { label: "Avg. Booking Value", val: overview ? `₹${parseFloat(overview.average_booking_value).toLocaleString("en-IN")}` : "—", color: "#f59e0b", isText: true },
                ].map((item) => (
                  <Box key={item.label}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                      <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                      <Typography variant="caption" fontWeight={700} sx={{ color: item.color }}>
                        {"isText" in item ? item.val : `${item.val}%`}
                      </Typography>
                    </Box>
                    {"isText" in item ? null : (
                      <LinearProgress
                        variant="determinate"
                        value={item.val as number}
                        sx={{ height: 5, borderRadius: 3, bgcolor: `${item.color}18`, "& .MuiLinearProgress-bar": { bgcolor: item.color, borderRadius: 3 } }}
                      />
                    )}
                  </Box>
                ))}
              </Box>

              {/* Overdue & Today alerts */}
              {overview && (overview.overdue_bookings > 0 || overview.today_bookings > 0) && (
                <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 1 }}>
                  {overview.overdue_bookings > 0 && (
                    <Box sx={{ bgcolor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 2, px: 2, py: 1 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: "#dc2626" }}>
                        ⚠ {overview.overdue_bookings} overdue booking{overview.overdue_bookings > 1 ? "s" : ""}
                      </Typography>
                    </Box>
                  )}
                  {overview.today_bookings > 0 && (
                    <Box sx={{ bgcolor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 2, px: 2, py: 1 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: "#2563eb" }}>
                        📅 {overview.today_bookings} booking{overview.today_bookings > 1 ? "s" : ""} today
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
}

