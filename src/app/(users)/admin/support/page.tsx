"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Box, Typography, Card, CardContent, Chip, TextField, MenuItem,
  Select, FormControl, InputLabel, InputAdornment, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Pagination,
  Avatar, IconButton, Tooltip, Accordion, AccordionSummary, AccordionDetails,
  SelectChangeEvent,
} from "@mui/material";
import {
  Search as SearchIcon, SupportAgent as SupportIcon, ExpandMore as ExpandIcon,
  Visibility as ViewIcon, CheckCircle, HourglassEmpty, ErrorOutline,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { mockSupport } from "@/app/lib/mock/adminData";
import toast from "react-hot-toast";

type Ticket = (typeof mockSupport)[0];

const ROWS_PER_PAGE = 7;

const statusConfig: Record<string, { color: "success" | "warning" | "error" | "default" | "info"; label: string }> = {
  open: { color: "error", label: "Open" },
  "in-progress": { color: "warning", label: "In Progress" },
  resolved: { color: "success", label: "Resolved" },
};

const priorityConfig: Record<string, { color: string; label: string }> = {
  high: { color: "#ef4444", label: "High" },
  medium: { color: "#f59e0b", label: "Medium" },
  low: { color: "#10b981", label: "Low" },
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

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/admin/support");
        if (res.ok) {
          const data = await res.json();
          setTickets(data);
        } else {
          setTickets(mockSupport);
        }
      } catch {
        setTickets(mockSupport);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.user.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);

  const stats = useMemo(() => ({
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    total: tickets.length,
  }), [tickets]);

  const handleMarkResolved = (id: string) => {
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status: "resolved" } : t));
    toast.success(`Ticket ${id} marked as resolved`);
  };

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
          Support Tickets
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage customer support requests and complaints
        </Typography>
      </Box>

      {/* Stats */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
        <StatCard label="Total Tickets" value={stats.total} color="#3b82f6" icon={<SupportIcon />} />
        <StatCard label="Open" value={stats.open} color="#ef4444" icon={<ErrorOutline />} />
        <StatCard label="In Progress" value={stats.inProgress} color="#f59e0b" icon={<HourglassEmpty />} />
        <StatCard label="Resolved" value={stats.resolved} color="#10b981" icon={<CheckCircle />} />
      </Box>

      {/* Filters */}
      <Card sx={{ borderRadius: 3, mb: 2.5, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search ticket ID, user, subject…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} /></InputAdornment> }}
              sx={{ flex: "1 1 220px", minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e: SelectChangeEvent) => { setStatusFilter(e.target.value); setPage(1); }}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Priority</InputLabel>
              <Select value={priorityFilter} label="Priority" onChange={(e: SelectChangeEvent) => { setPriorityFilter(e.target.value); setPage(1); }}>
                <MenuItem value="all">All Priority</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Ticket Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden", mb: 3 }}>
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                {["Ticket ID", "User", "Subject", "Priority", "Status", "Created", "Actions"].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.82rem", color: "text.secondary", whiteSpace: "nowrap" }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    No tickets found.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((t) => (
                  <TableRow key={t.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.82rem", color: "#d97706" }}>{t.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: "#3b82f618", color: "#3b82f6", fontSize: "0.75rem", fontWeight: 700 }}>
                          {t.user.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.83rem" }}>{t.user}</Typography>
                          <Typography variant="caption" color="text.secondary">{t.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.83rem", maxWidth: 200 }}>
                      <Typography noWrap variant="body2" sx={{ fontSize: "0.83rem" }}>{t.subject}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{
                        bgcolor: `${priorityConfig[t.priority]?.color ?? "#666"}18`,
                        color: priorityConfig[t.priority]?.color ?? "#666",
                        px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: "0.74rem"
                      }}>
                        {priorityConfig[t.priority]?.label ?? t.priority}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={statusConfig[t.status]?.label ?? t.status} size="small" color={statusConfig[t.status]?.color ?? "default"} sx={{ fontWeight: 600, fontSize: "0.74rem" }} />
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.82rem", color: "text.secondary", whiteSpace: "nowrap" }}>{t.created}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => setExpanded(expanded === t.id ? false : t.id)} sx={{ color: "#3b82f6" }}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {t.status !== "resolved" && (
                          <Tooltip title="Mark Resolved">
                            <IconButton size="small" onClick={() => handleMarkResolved(t.id)} sx={{ color: "#10b981" }}>
                              <CheckCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
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

      {/* Expanded Ticket Detail */}
      {paginated.filter((t) => t.id === expanded).map((t) => (
        <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f59e0b33" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
                <Typography variant="h6" fontWeight={700}>{t.subject}</Typography>
                <Chip label={t.id} size="small" sx={{ bgcolor: "#f59e0b18", color: "#d97706", fontWeight: 700 }} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>From:</strong> {t.user} ({t.email}) &nbsp;|&nbsp; <strong>Created:</strong> {t.created}
              </Typography>
              <Box sx={{ bgcolor: "grey.50", borderRadius: 2, p: 2, borderLeft: "3px solid #f59e0b" }}>
                <Typography variant="body2">{t.message}</Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </Box>
  );
}
