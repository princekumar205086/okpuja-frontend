"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Box, Typography, Card, CardContent, Chip, TextField, MenuItem,
  Select, FormControl, InputLabel, InputAdornment, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Pagination,
  Avatar, SelectChangeEvent,
} from "@mui/material";
import { Search as SearchIcon, Work as WorkIcon, CheckCircle, PendingActions, Cancel, AssignmentTurnedIn } from "@mui/icons-material";
import { motion } from "framer-motion";
import { mockJobs } from "@/app/lib/mock/adminData";

type Job = (typeof mockJobs)[0];

const ROWS_PER_PAGE = 8;

const statusConfig: Record<string, { color: "success" | "warning" | "error" | "default" | "info"; label: string; icon: React.ReactNode }> = {
  completed: { color: "success", label: "Completed", icon: <CheckCircle sx={{ fontSize: 14 }} /> },
  assigned: { color: "info", label: "Assigned", icon: <AssignmentTurnedIn sx={{ fontSize: 14 }} /> },
  pending: { color: "warning", label: "Pending", icon: <PendingActions sx={{ fontSize: 14 }} /> },
  cancelled: { color: "error", label: "Cancelled", icon: <Cancel sx={{ fontSize: 14 }} /> },
};

const StatCard = ({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
    <Card sx={{ borderRadius: 3, border: `1px solid ${color}22`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
        <Box sx={{ bgcolor: `${color}18`, borderRadius: 2, p: 1.5, display: "flex", color }}>{icon}</Box>
        <Box>
          <Typography variant="h5" fontWeight={700}>{value}</Typography>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/admin/jobs");
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        } else {
          setJobs(mockJobs);
        }
      } catch {
        setJobs(mockJobs);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchSearch =
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.customer.toLowerCase().includes(search.toLowerCase()) ||
        j.city.toLowerCase().includes(search.toLowerCase()) ||
        (j.pandit && j.pandit.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = statusFilter === "all" || j.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [jobs, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);

  const stats = useMemo(() => ({
    total: jobs.length,
    pending: jobs.filter((j) => j.status === "pending").length,
    assigned: jobs.filter((j) => j.status === "assigned").length,
    completed: jobs.filter((j) => j.status === "completed").length,
  }), [jobs]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #f59e0b", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
          Job Openings &amp; Assignments
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage pandit job assignments and booking requests
        </Typography>
      </Box>

      {/* Stats */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
        <StatCard label="Total Jobs" value={stats.total} color="#3b82f6" icon={<WorkIcon />} />
        <StatCard label="Pending" value={stats.pending} color="#f59e0b" icon={<PendingActions />} />
        <StatCard label="Assigned" value={stats.assigned} color="#06b6d4" icon={<AssignmentTurnedIn />} />
        <StatCard label="Completed" value={stats.completed} color="#10b981" icon={<CheckCircle />} />
      </Box>

      {/* Filters */}
      <Card sx={{ borderRadius: 3, mb: 2.5, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search service, customer, city, pandit…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} /></InputAdornment> }}
              sx={{ flex: "1 1 240px", minWidth: 220 }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e: SelectChangeEvent) => { setStatusFilter(e.target.value); setPage(1); }}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="assigned">Assigned</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                {["Job ID", "Service", "Customer", "City", "Date", "Pandit Assigned", "Amount", "Status"].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.82rem", color: "text.secondary", whiteSpace: "nowrap" }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    No jobs found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((job) => (
                  <TableRow key={job.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.82rem", color: "#d97706" }}>#{job.id}</TableCell>
                    <TableCell sx={{ fontSize: "0.83rem", fontWeight: 600, maxWidth: 180 }}>
                      <Typography noWrap variant="body2" fontWeight={600}>{job.title}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: "#f59e0b22", color: "#d97706", fontSize: "0.75rem", fontWeight: 700 }}>
                          {job.customer.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" fontWeight={500} sx={{ fontSize: "0.83rem" }}>{job.customer}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.83rem", color: "text.secondary" }}>{job.city}</TableCell>
                    <TableCell sx={{ fontSize: "0.82rem", color: "text.secondary", whiteSpace: "nowrap" }}>{job.date}</TableCell>
                    <TableCell sx={{ fontSize: "0.82rem" }}>
                      {job.pandit ? (
                        <Typography variant="body2" sx={{ fontSize: "0.82rem", color: "#10b981", fontWeight: 500 }}>{job.pandit}</Typography>
                      ) : (
                        <Typography variant="body2" sx={{ fontSize: "0.78rem", color: "#9ca3af", fontStyle: "italic" }}>Unassigned</Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>₹{job.amount.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusConfig[job.status]?.label ?? job.status}
                        size="small"
                        color={statusConfig[job.status]?.color ?? "default"}
                        sx={{ fontWeight: 600, fontSize: "0.74rem", textTransform: "capitalize" }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2, borderTop: "1px solid", borderColor: "divider" }}>
            <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" size="small" showFirstButton showLastButton />
          </Box>
        )}
      </Card>
    </Box>
  );
}
