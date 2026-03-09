"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box, Typography, Card, CardContent, Chip, TextField, MenuItem,
  Select, FormControl, InputLabel, InputAdornment, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Pagination, Avatar, Tooltip, SelectChangeEvent,
} from "@mui/material";
import {
  Search as SearchIcon, People as PeopleIcon, PersonAdd as PersonAddIcon,
  Block as BlockIcon, CheckCircle as CheckIcon, Edit as EditIcon,
  Visibility as ViewIcon, Delete as DeleteIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { adminUserApi, type ApiUser } from "@/app/apiService/adminApi";
import toast from "react-hot-toast";

const ROWS_PER_PAGE = 8;

const roleColors: Record<string, "default" | "primary" | "secondary" | "success" | "error" | "warning" | "info"> = {
  USER: "primary",
  EMPLOYEE: "secondary",
  ADMIN: "warning",
};

const statusColors: Record<string, "success" | "error" | "warning" | "default"> = {
  ACTIVE: "success",
  INACTIVE: "default",
  SUSPENDED: "error",
};

const StatCard = ({ label, value, icon, color }: { label: string; value: number | string; icon: React.ReactNode; color: string }) => (
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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminUserApi.list();
      const data = Array.isArray(res.data) ? res.data : (res.data as { results?: ApiUser[] }).results ?? [];
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const searchTerm = search.toLowerCase();
      const matchSearch =
        u.username.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm) ||
        (u.phone ?? "").includes(search);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || u.account_status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    return {
      total: users.length,
      active: users.filter((u) => u.account_status === "ACTIVE").length,
      customers: users.filter((u) => u.role === "USER").length,
      newThisMonth: users.filter((u) => u.date_joined >= monthStart).length,
    };
  }, [users]);

  const handleToggleStatus = async (user: ApiUser) => {
    const newStatus = user.account_status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    try {
      await adminUserApi.update(user.id, { account_status: newStatus });
      toast.success(`User ${newStatus === "SUSPENDED" ? "blocked" : "unblocked"}`);
      fetchUsers();
    } catch {
      toast.error("Failed to update user status");
    }
  };

  const handleDelete = async (user: ApiUser) => {
    try {
      await adminUserApi.delete(user.id);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <Box sx={{ textAlign: "center" }}>
          <Box sx={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #f59e0b", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", mx: "auto", mb: 2 }} />
          <Typography color="text.secondary">Loading users…</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: "text.primary", fontSize: { xs: "1.5rem", md: "2rem" } }}>
          User Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage all registered users on OKPUJA
        </Typography>
      </Box>

      {/* Stats */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
        <StatCard label="Total Users" value={stats.total} icon={<PeopleIcon />} color="#f59e0b" />
        <StatCard label="Active Users" value={stats.active} icon={<CheckIcon />} color="#10b981" />
        <StatCard label="Customers" value={stats.customers} icon={<PersonAddIcon />} color="#3b82f6" />
        <StatCard label="New This Month" value={stats.newThisMonth} icon={<PersonAddIcon />} color="#8b5cf6" />
      </Box>

      {/* Filters */}
      <Card sx={{ borderRadius: 3, mb: 2.5, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search name, email, phone…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} /></InputAdornment>,
              }}
              sx={{ flex: "1 1 220px", minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Role</InputLabel>
              <Select value={roleFilter} label="Role" onChange={(e: SelectChangeEvent) => { setRoleFilter(e.target.value); setPage(1); }}>
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="USER">Customer</MenuItem>
                <MenuItem value="EMPLOYEE">Employee</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e: SelectChangeEvent) => { setStatusFilter(e.target.value); setPage(1); }}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="SUSPENDED">Suspended</MenuItem>
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
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                {["#", "User", "Email", "Phone", "Role", "Status", "Joined", "Actions"].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.82rem", color: "text.secondary", whiteSpace: "nowrap" }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    No users found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((user) => (
                  <TableRow key={user.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                    <TableCell sx={{ color: "text.secondary", fontSize: "0.82rem" }}>#{user.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: "#f59e0b22", color: "#d97706", fontSize: "0.85rem", fontWeight: 700 }}>
                          {(user.username || user.email).charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>{user.username || user.email}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.83rem", color: "text.secondary" }}>{user.email}</TableCell>
                    <TableCell sx={{ fontSize: "0.83rem", color: "text.secondary", whiteSpace: "nowrap" }}>{user.phone ?? "—"}</TableCell>
                    <TableCell>
                      <Chip label={user.role} size="small" color={roleColors[user.role] ?? "default"} sx={{ fontWeight: 600, fontSize: "0.74rem" }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={user.account_status} size="small" color={statusColors[user.account_status] ?? "default"} sx={{ fontWeight: 600, fontSize: "0.74rem" }} />
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.83rem", color: "text.secondary", whiteSpace: "nowrap" }}>
                      {new Date(user.date_joined).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title={user.account_status === "SUSPENDED" ? "Unblock" : "Block"}>
                          <IconButton size="small" onClick={() => handleToggleStatus(user)} sx={{ color: user.account_status === "SUSPENDED" ? "#10b981" : "#ef4444" }}>
                            <BlockIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => handleDelete(user)} sx={{ color: "#ef4444" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2, borderTop: "1px solid", borderColor: "divider" }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              color="primary"
              size="small"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Card>
    </Box>
  );
}
