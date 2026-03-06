"use client";
import React, { useState, useEffect } from "react";
import {
  Box, Typography, Card, CardContent, Tabs, Tab,
} from "@mui/material";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { mockReports } from "@/app/lib/mock/adminData";
import { TrendingUp, BarChart2, MapPin, Star } from "lucide-react";

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4"];

const SectionCard = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
    <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>{title}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>{subtitle}</Typography>}
        {children}
      </CardContent>
    </Card>
  </motion.div>
);

const KPICard = ({ label, value, change, icon, color }: { label: string; value: string; change: string; icon: React.ReactNode; color: string }) => (
  <Card sx={{ borderRadius: 3, border: `1px solid ${color}22`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
          <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>{value}</Typography>
        </Box>
        <Box sx={{ bgcolor: `${color}18`, borderRadius: 2, p: 1, color }}>{icon}</Box>
      </Box>
      <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 600, mt: 1, display: "block" }}>{change} vs last month</Typography>
    </CardContent>
  </Card>
);

export default function AdminReportsPage() {
  const [data, setData] = useState(mockReports);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/admin/reports");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          setData(mockReports);
        }
      } catch {
        setData(mockReports);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const totalRevenue = data.monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalBookings = data.monthlyRevenue.reduce((s, m) => s + m.bookings, 0);
  const totalUsers = data.userGrowth[data.userGrowth.length - 1]?.users ?? 0;
  const topCity = data.bookingsByCity[0]?.city ?? "—";

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #f59e0b", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
      </Box>
    );
  }

  const tabItems = ["Revenue & Bookings", "City-wise Bookings", "Top Services", "User Growth"];

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
        <KPICard label="Total Revenue" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} change="+19.4%" icon={<TrendingUp size={20} />} color="#10b981" />
        <KPICard label="Total Bookings" value={String(totalBookings)} change="+17.4%" icon={<BarChart2 size={20} />} color="#3b82f6" />
        <KPICard label="Total Users" value={String(totalUsers)} change="+14.9%" icon={<Star size={20} />} color="#8b5cf6" />
        <KPICard label="Top City" value={topCity} change="Most bookings" icon={<MapPin size={20} />} color="#f59e0b" />
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
                Monthly Revenue (₹) &amp; Bookings — last 7 months
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={data.monthlyRevenue} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number | undefined, n: string | undefined) => { const val = v ?? 0; const name = n ?? ""; return [name === "revenue" ? `₹${val.toLocaleString("en-IN")}` : val, name === "revenue" ? "Revenue" : "Bookings"] as [string | number, string]; }} />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#f59e0b" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
                  <Area yAxisId="right" type="monotone" dataKey="bookings" stroke="#3b82f6" fill="url(#bookGrad)" strokeWidth={2} name="Bookings" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Tab 1: City-wise */}
          {tab === 1 && (
            <motion.div key="city" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Total Bookings by City
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={data.bookingsByCity} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="city" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="bookings" name="Bookings" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Tab 2: Top Services */}
          {tab === 2 && (
            <motion.div key="svc" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Top Puja Services by Bookings
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={data.topServices} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="service" type="category" tick={{ fontSize: 12 }} width={120} />
                  <Tooltip formatter={(v: number | undefined, n: string | undefined) => { const val = v ?? 0; const name = n ?? ""; return [name === "revenue" ? `₹${val.toLocaleString("en-IN")}` : val, name] as [string | number, string]; }} />
                  <Legend />
                  <Bar dataKey="bookings" name="Bookings" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="revenue" name="Revenue (₹)" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Tab 3: User Growth */}
          {tab === 3 && (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Cumulative User Registrations — last 7 months
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data.userGrowth} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" name="Total Users" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Top Services Summary Table */}
      <SectionCard title="Top Services Summary" subtitle="Ranking by bookings and revenue">
        <Box sx={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                {["#", "Service", "Bookings", "Revenue", "Avg Booking Value"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, fontSize: "0.82rem", color: "#6b7280", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.topServices.map((svc, idx) => (
                <tr key={svc.service} style={{ borderBottom: "1px solid #f9fafb" }}>
                  <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: "#9ca3af" }}>{idx + 1}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 600, fontSize: "0.85rem" }}>{svc.service}</td>
                  <td style={{ padding: "10px 12px", fontSize: "0.85rem" }}>{svc.bookings}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 700, fontSize: "0.85rem", color: "#10b981" }}>₹{svc.revenue.toLocaleString("en-IN")}</td>
                  <td style={{ padding: "10px 12px", fontSize: "0.85rem", color: "#6b7280" }}>₹{Math.round(svc.revenue / svc.bookings).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </SectionCard>
    </Box>
  );
}
