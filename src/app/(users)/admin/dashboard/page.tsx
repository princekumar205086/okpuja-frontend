"use client";
import React, { useState } from "react";
import {
  Box, Typography, Card, CardContent, Chip, Avatar, Button,
  IconButton, Tooltip, LinearProgress, useTheme, useMediaQuery,
} from "@mui/material";
import {
  TrendingUp, CurrencyRupee, CalendarMonth, Groups,
  SupportAgent, Pending, ArrowUpward, ArrowDownward,
  MoreVert, Notifications, OpenInNew, Refresh,
  CheckCircle, Schedule, Cancel,
} from "@mui/icons-material";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import Link from "next/link";
import CountUp from "react-countup";
import { mockDashboardStats } from "@/app/lib/mock/adminData";

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
  title, value, prefix, suffix, icon, color, change, positive, delay,
}: {
  title: string; value: number | string; prefix?: string; suffix?: string;
  icon: React.ReactNode; color: string; change: string; positive: boolean; delay: number;
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
      {/* Decorative circle */}
      <Box sx={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", bgcolor: `${color}12` }} />
      <Box sx={{ position: "absolute", top: -8, right: -8, width: 60, height: 60, borderRadius: "50%", bgcolor: `${color}1a` }} />

      <CardContent sx={{ p: { xs: 2, md: 2.5 }, position: "relative" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ bgcolor: `${color}18`, borderRadius: 2.5, p: 1.2, color, display: "flex" }}>
            {icon}
          </Box>
          <Chip
            icon={positive ? <ArrowUpward sx={{ fontSize: "0.72rem !important" }} /> : <ArrowDownward sx={{ fontSize: "0.72rem !important" }} />}
            label={change}
            size="small"
            sx={{
              bgcolor: positive ? "#dcfce7" : "#fee2e2",
              color: positive ? "#16a34a" : "#dc2626",
              fontWeight: 700, fontSize: "0.72rem",
              "& .MuiChip-icon": { color: "inherit" },
            }}
          />
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
  completed: { color: "success", icon: <CheckCircle sx={{ fontSize: 14 }} /> },
  upcoming: { color: "info", icon: <Schedule sx={{ fontSize: 14 }} /> },
  pending: { color: "warning", icon: <Pending sx={{ fontSize: 14 }} /> },
  confirmed: { color: "success", icon: <CheckCircle sx={{ fontSize: 14 }} /> },
  cancelled: { color: "error", icon: <Cancel sx={{ fontSize: 14 }} /> },
};

const activityIcons: Record<string, { bg: string; color: string }> = {
  booking: { bg: "#eff6ff", color: "#3b82f6" },
  payment: { bg: "#ecfdf5", color: "#10b981" },
  employee: { bg: "#fffbeb", color: "#f59e0b" },
  support: { bg: "#fef2f2", color: "#ef4444" },
};

export default function AdminDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const stats = mockDashboardStats;
  const [refreshed, setRefreshed] = useState(false);

  const totalMonthlyRevenue = stats.monthlyRevenue.map((m) => ({
    ...m,
    total: m.puja + m.astrology,
  }));

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
          {/* Background decorative orbs */}
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
              {/* Mini KPIs in header */}
              <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
                {[
                  { label: "Revenue", val: `₹${(stats.totalRevenue / 1000).toFixed(0)}K` },
                  { label: "Bookings", val: stats.totalBookings },
                  { label: "Employees", val: stats.activeEmployees },
                  { label: "Open Tickets", val: stats.openTickets },
                ].map((kpi) => (
                  <Box key={kpi.label} sx={{ bgcolor: "rgba(255,255,255,0.1)", borderRadius: 2, px: 2, py: 0.8, backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)", display: "block", fontSize: "0.7rem" }}>{kpi.label}</Typography>
                    <Typography variant="body1" fontWeight={700} sx={{ fontSize: "0.95rem" }}>{kpi.val}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Quick actions */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: { xs: "flex-start", sm: "flex-end" } }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="Refresh">
                  <IconButton onClick={() => setRefreshed(true)} size="small" sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.25)" } }}>
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
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)", lg: "repeat(6, 1fr)" }, gap: { xs: 1.5, md: 2 }, mb: 3 }}>
        <StatCard title="Total Revenue" value={stats.totalRevenue} prefix="₹" icon={<CurrencyRupee />} color="#10b981" change="+19.4%" positive delay={0} />
        <StatCard title="Total Bookings" value={stats.totalBookings} icon={<CalendarMonth />} color="#3b82f6" change="+8.2%" positive delay={0.05} />
        <StatCard title="Active Employees" value={stats.activeEmployees} icon={<Groups />} color="#8b5cf6" change="+4.1%" positive delay={0.1} />
        <StatCard title="Pending Bookings" value={stats.pendingBookings} icon={<Pending />} color="#f59e0b" change="-2.3%" positive={false} delay={0.15} />
        <StatCard title="Open Tickets" value={stats.openTickets} icon={<SupportAgent />} color="#ef4444" change="+1" positive={false} delay={0.2} />
        <StatCard title="Completion Rate" value={`${stats.completionRate}%`} icon={<TrendingUp />} color="#06b6d4" change="+2.3%" positive delay={0.25} />
      </Box>

      {/* ── Main Content Grid ────────────────────────────────────────────────── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 360px" }, gap: 2.5, mb: 2.5 }}>
        {/* Left: Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card sx={{ borderRadius: 3, height: "100%", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Revenue Analytics</Typography>
                  <Typography variant="body2" color="text.secondary">Puja vs Astrology revenue — last 7 months</Typography>
                </Box>
                <IconButton size="small"><MoreVert fontSize="small" /></IconButton>
              </Box>

              {/* Revenue summary row */}
              <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
                {[
                  { label: "Puja Revenue", value: totalMonthlyRevenue.reduce((s, m) => s + m.puja, 0), color: "#f59e0b" },
                  { label: "Astrology", value: totalMonthlyRevenue.reduce((s, m) => s + m.astrology, 0), color: "#8b5cf6" },
                  { label: "Total", value: totalMonthlyRevenue.reduce((s, m) => s + m.total, 0), color: "#10b981" },
                ].map((item) => (
                  <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                      <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.2 }}>₹{(item.value / 1000).toFixed(0)}K</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={totalMonthlyRevenue} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pujaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="astroGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}K`} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                    formatter={(v: number | undefined) => [`₹${(v ?? 0).toLocaleString("en-IN")}`, ""]}
                  />
                  <Legend iconType="circle" iconSize={8} />
                  <Area type="monotone" dataKey="puja" name="Puja" stroke="#f59e0b" fill="url(#pujaGrad)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Area type="monotone" dataKey="astrology" name="Astrology" stroke="#8b5cf6" fill="url(#astroGrad)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Activity Feed + Quick Actions stacked */}
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

          {/* Activity Feed */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", flex: 1 }}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Recent Activity</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {stats.recentActivity.map((item, idx) => {
                    const { bg, color } = activityIcons[item.type] ?? { bg: "#f3f4f6", color: "#6b7280" };
                    return (
                      <motion.div key={idx} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + idx * 0.05 }}>
                        <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                          <Box sx={{ bgcolor: bg, borderRadius: 2, p: 0.8, mt: 0.2, flexShrink: 0 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontSize: "0.8rem", lineHeight: 1.4 }}>{item.message}</Typography>
                            <Typography variant="caption" color="text.secondary">{item.time}</Typography>
                          </Box>
                        </Box>
                      </motion.div>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>

      {/* ── Bottom Row: Recent Bookings + Monthly Bar Chart ───────────────── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "1fr 360px" }, gap: 2.5, mb: 2.5 }}>
        {/* Recent Bookings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Recent Bookings</Typography>
                  <Typography variant="body2" color="text.secondary">Latest 5 booking requests</Typography>
                </Box>
                <Button component={Link} href="/admin/bookings" size="small" endIcon={<OpenInNew sx={{ fontSize: 14 }} />} sx={{ color: "#7c3aed", fontWeight: 700, fontSize: "0.8rem" }}>
                  View All
                </Button>
              </Box>

              {/* Table on desktop, cards on mobile */}
              {!isMobile ? (
                <Box sx={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
                        {["ID", "Customer", "Service", "Employee", "Amount", "Status", "Date"].map((h) => (
                          <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "0.79rem", fontWeight: 700, color: "#9ca3af", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentBookings.map((b) => (
                        <tr key={b.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                          <td style={{ padding: "10px 12px", fontSize: "0.82rem", fontWeight: 700, color: "#f59e0b" }}>{b.id}</td>
                          <td style={{ padding: "10px 12px", fontWeight: 600, fontSize: "0.83rem" }}>{b.customer}</td>
                          <td style={{ padding: "10px 12px", fontSize: "0.83rem", color: "#374151", maxWidth: 140 }}>
                            <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.service}</span>
                          </td>
                          <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: b.employee ? "#10b981" : "#9ca3af" }}>
                            {b.employee ?? <em>Unassigned</em>}
                          </td>
                          <td style={{ padding: "10px 12px", fontWeight: 700, whiteSpace: "nowrap" }}>₹{b.amount.toLocaleString("en-IN")}</td>
                          <td style={{ padding: "10px 12px" }}>
                            <Chip
                              label={b.status}
                              size="small"
                              color={bookingStatusConfig[b.status]?.color ?? "default"}
                              sx={{ textTransform: "capitalize", fontWeight: 600, fontSize: "0.72rem" }}
                            />
                          </td>
                          <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: "#9ca3af", whiteSpace: "nowrap" }}>{b.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {stats.recentBookings.map((b) => (
                    <Box key={b.id} sx={{ p: 2, borderRadius: 2, border: "1px solid #f3f4f6", bgcolor: "#fafafa" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={700} sx={{ color: "#f59e0b" }}>{b.id}</Typography>
                        <Chip label={b.status} size="small" color={bookingStatusConfig[b.status]?.color ?? "default"} sx={{ fontWeight: 600, fontSize: "0.7rem" }} />
                      </Box>
                      <Typography variant="body2" fontWeight={600}>{b.customer} · {b.service}</Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">{b.date}</Typography>
                        <Typography variant="caption" fontWeight={700}>₹{b.amount.toLocaleString("en-IN")}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Comparison Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}>
          <Card sx={{ borderRadius: 3, height: "100%", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
            <CardContent sx={{ p: { xs: 2, md: 2.5 }, height: "100%", display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>Monthly Bookings</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Revenue split by service</Typography>
              <Box sx={{ flex: 1, minHeight: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={totalMonthlyRevenue} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barCategoryGap="35%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb" }}
                      formatter={(v: number | undefined) => [`₹${(v ?? 0).toLocaleString("en-IN")}`, ""]}
                    />
                    <Bar dataKey="puja" name="Puja" fill="#f59e0b" radius={[3, 3, 0, 0]} stackId="a" />
                    <Bar dataKey="astrology" name="Astrology" fill="#8b5cf6" radius={[3, 3, 0, 0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              {/* Platform health indicators */}
              <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.2 }}>
                {[
                  { label: "Booking Completion", val: 94, color: "#10b981" },
                  { label: "Payment Success", val: 88, color: "#3b82f6" },
                  { label: "Employee Utilisation", val: 72, color: "#f59e0b" },
                ].map((item) => (
                  <Box key={item.label}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                      <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                      <Typography variant="caption" fontWeight={700} sx={{ color: item.color }}>{item.val}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.val}
                      sx={{ height: 5, borderRadius: 3, bgcolor: `${item.color}18`, "& .MuiLinearProgress-bar": { bgcolor: item.color, borderRadius: 3 } }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
}


