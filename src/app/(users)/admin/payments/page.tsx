"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Box, Typography, Card, CardContent, Chip, TextField, MenuItem,
  Select, FormControl, InputLabel, InputAdornment, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Pagination,
  Divider, SelectChangeEvent,
} from "@mui/material";
import {
  Search as SearchIcon, CurrencyRupee as RupeeIcon, CheckCircle as CheckIcon,
  Pending as PendingIcon, Cancel as CancelIcon, Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { mockPayments } from "@/app/lib/mock/adminData";

type Payment = (typeof mockPayments)[0];

const ROWS_PER_PAGE = 8;

const statusConfig: Record<string, { color: "success" | "warning" | "error" | "default" | "info"; label: string }> = {
  completed: { color: "success", label: "Completed" },
  pending: { color: "warning", label: "Pending" },
  failed: { color: "error", label: "Failed" },
  refunded: { color: "info", label: "Refunded" },
};

const methodColors: Record<string, string> = {
  UPI: "#3b82f6",
  Card: "#8b5cf6",
  "Net Banking": "#06b6d4",
  Wallet: "#f59e0b",
};

const StatCard = ({ label, value, icon, color, sub }: { label: string; value: string; icon: React.ReactNode; color: string; sub?: string }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
    <Card sx={{ borderRadius: 3, border: `1px solid ${color}22`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "100%" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Box sx={{ bgcolor: `${color}18`, borderRadius: 2, p: 1, display: "flex", color }}>{icon}</Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
        </Box>
        <Typography variant="h5" fontWeight={700}>{value}</Typography>
        {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
      </CardContent>
    </Card>
  </motion.div>
);

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch("/api/admin/payments");
        if (res.ok) {
          const data = await res.json();
          setPayments(data);
        } else {
          setPayments(mockPayments);
        }
      } catch {
        setPayments(mockPayments);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch =
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.user.toLowerCase().includes(search.toLowerCase()) ||
        p.service.toLowerCase().includes(search.toLowerCase()) ||
        p.txnId.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchMethod = methodFilter === "all" || p.method === methodFilter;
      return matchSearch && matchStatus && matchMethod;
    });
  }, [payments, search, statusFilter, methodFilter]);

  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);

  const stats = useMemo(() => {
    const completed = payments.filter((p) => p.status === "completed");
    const totalRevenue = completed.reduce((s, p) => s + p.amount, 0);
    const pending = payments.filter((p) => p.status === "pending");
    const pendingAmount = pending.reduce((s, p) => s + p.amount, 0);
    const failed = payments.filter((p) => p.status === "failed").length;
    return { totalRevenue, pendingAmount, failed, completedCount: completed.length };
  }, [payments]);

  const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #f59e0b", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
          Payments
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Track all transactions and revenue on OKPUJA
        </Typography>
      </Box>

      {/* Revenue Stats */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
        <StatCard label="Total Revenue" value={formatINR(stats.totalRevenue)} icon={<RupeeIcon />} color="#10b981" sub={`${stats.completedCount} transactions`} />
        <StatCard label="Pending Amount" value={formatINR(stats.pendingAmount)} icon={<PendingIcon />} color="#f59e0b" />
        <StatCard label="Failed Payments" value={String(stats.failed)} icon={<CancelIcon />} color="#ef4444" />
        <StatCard label="Total Transactions" value={String(payments.length)} icon={<ReceiptIcon />} color="#3b82f6" />
      </Box>

      {/* Revenue Breakdown by Method */}
      <Card sx={{ borderRadius: 3, mb: 2.5, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Revenue by Payment Method</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {["UPI", "Card", "Net Banking", "Wallet"].map((method) => {
              const methodPayments = payments.filter((p) => p.method === method && p.status === "completed");
              const total = methodPayments.reduce((s, p) => s + p.amount, 0);
              return (
                <Box key={method} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: methodColors[method] ?? "#666" }} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>{method}</Typography>
                    <Typography variant="caption" color="text.secondary">{formatINR(total)}</Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card sx={{ borderRadius: 3, mb: 2.5, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search Payment ID, user, service…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} /></InputAdornment> }}
              sx={{ flex: "1 1 220px", minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e: SelectChangeEvent) => { setStatusFilter(e.target.value); setPage(1); }}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="refunded">Refunded</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Method</InputLabel>
              <Select value={methodFilter} label="Method" onChange={(e: SelectChangeEvent) => { setMethodFilter(e.target.value); setPage(1); }}>
                <MenuItem value="all">All Methods</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="Card">Card</MenuItem>
                <MenuItem value="Net Banking">Net Banking</MenuItem>
                <MenuItem value="Wallet">Wallet</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                {["Payment ID", "User", "Service", "Amount", "Method", "Status", "Date", "Txn ID"].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.82rem", color: "text.secondary", whiteSpace: "nowrap" }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    No payments found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((p) => (
                  <TableRow key={p.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.82rem", color: "#d97706" }}>{p.id}</TableCell>
                    <TableCell sx={{ fontSize: "0.83rem", fontWeight: 500 }}>{p.user}</TableCell>
                    <TableCell sx={{ fontSize: "0.82rem", color: "text.secondary", maxWidth: 180 }}>
                      <Typography noWrap variant="body2" sx={{ fontSize: "0.82rem" }}>{p.service}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                      {formatINR(p.amount)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ bgcolor: `${methodColors[p.method] ?? "#666"}18`, color: methodColors[p.method] ?? "#666", px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 600 }}>
                        {p.method}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusConfig[p.status]?.label ?? p.status}
                        size="small"
                        color={statusConfig[p.status]?.color ?? "default"}
                        sx={{ fontWeight: 600, fontSize: "0.74rem" }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.82rem", color: "text.secondary", whiteSpace: "nowrap" }}>{p.date}</TableCell>
                    <TableCell sx={{ fontSize: "0.78rem", color: "text.secondary", fontFamily: "monospace" }}>{p.txnId}</TableCell>
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
