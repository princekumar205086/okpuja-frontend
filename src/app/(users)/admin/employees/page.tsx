"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box, Typography, Card, CardContent, Chip, Avatar, Button, IconButton,
  TextField, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  useTheme, useMediaQuery, Drawer, Snackbar, Alert,
} from "@mui/material";
import {
  Search, Add, CheckCircle, Cancel, Assignment,
  Visibility, Close, Person, Email as EmailIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  adminEmployeeApi, adminBookingApi, adminUserApi,
  type Employee, type RecentBooking,
} from "@/app/apiService/adminApi";
import apiClient from "@/app/apiService/globalApiconfig";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getDisplayName = (emp: Employee) =>
  [emp.first_name, emp.last_name].filter(Boolean).join(" ") || emp.username || emp.email;

const getInitial = (emp: Employee) =>
  (emp.first_name || emp.username || emp.email).charAt(0).toUpperCase();

// ─── Main Component ────────────────────────────────────────────────────────
export default function EmployeesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [bookings, setBookings] = useState<RecentBooking[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [assignTarget, setAssignTarget] = useState<Employee | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: "success" | "error" }>({ open: false, msg: "", severity: "success" });

  // Add Employee form state
  const [newEmp, setNewEmp] = useState({ username: "", email: "", phone: "", password: "", employee_code: "" });

  // ─── Fetch data ──────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [empRes, bookingRes] = await Promise.all([
        adminEmployeeApi.list(),
        adminBookingApi.list({ status: "CONFIRMED" }),
      ]);
      const empData = Array.isArray(empRes.data) ? empRes.data : (empRes.data as { results?: Employee[] }).results ?? [];
      setEmployees(empData);

      const bookData = Array.isArray(bookingRes.data) ? bookingRes.data : (bookingRes.data as { results?: RecentBooking[] }).results ?? [];
      // Show unassigned bookings
      setBookings(bookData.filter((b) => !b.assigned_to));
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setSnack({ open: true, msg: "Failed to load employee data", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ─── Filtered list ─────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search) return employees;
    const q = search.toLowerCase();
    return employees.filter((e) =>
      getDisplayName(e).toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.username.toLowerCase().includes(q)
    );
  }, [employees, search]);

  // ─── Stats ──────────────────────────────────────────────────────────────
  const statsCards = useMemo(() => [
    { label: "Total Employees", value: employees.length, color: "#3b82f6", bg: "#eff6ff" },
    { label: "Unassigned Bookings", value: bookings.length, color: "#f59e0b", bg: "#fffbeb" },
  ], [employees, bookings]);

  // ─── Actions ───────────────────────────────────────────────────────────
  const handleAssignBooking = async (booking: RecentBooking) => {
    if (!assignTarget) return;
    try {
      await adminBookingApi.assign(booking.id, assignTarget.id);
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
      setAssignTarget(null);
      setSnack({ open: true, msg: `Booking ${booking.book_id} assigned to ${getDisplayName(assignTarget)}.`, severity: "success" });
    } catch {
      setSnack({ open: true, msg: "Failed to assign booking.", severity: "error" });
    }
  };

  const handleAddEmployee = async () => {
    if (!newEmp.username || !newEmp.email || !newEmp.password) {
      setSnack({ open: true, msg: "Please fill username, email, and password.", severity: "error" });
      return;
    }
    try {
      await apiClient.post("/auth/register/", {
        username: newEmp.username.trim(),
        email: newEmp.email.trim(),
        phone: newEmp.phone.trim() || undefined,
        password: newEmp.password,
        role: "EMPLOYEE",
        employee_code: newEmp.employee_code.trim() || undefined,
      });
      setNewEmp({ username: "", email: "", phone: "", password: "", employee_code: "" });
      setAddOpen(false);
      setSnack({ open: true, msg: "Employee registered successfully.", severity: "success" });
      fetchData();
    } catch {
      setSnack({ open: true, msg: "Failed to register employee.", severity: "error" });
    }
  };

  const handleDeleteUser = async (emp: Employee) => {
    try {
      await adminUserApi.delete(emp.id);
      setSnack({ open: true, msg: "Employee removed.", severity: "success" });
      fetchData();
    } catch {
      setSnack({ open: true, msg: "Failed to remove employee.", severity: "error" });
    }
  };

  // ─── Employee card (mobile view) ──────────────────────────────────────
  const EmployeeCard = ({ emp }: { emp: Employee }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card sx={{ borderRadius: 3, mb: 1.5, border: "1px solid #f3f4f6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "#f5f3ff", color: "#7c3aed", fontWeight: 700, width: 44, height: 44, fontSize: "1rem" }}>
                {getInitial(emp)}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={700}>{getDisplayName(emp)}</Typography>
                <Typography variant="caption" color="text.secondary">{emp.email}</Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button size="small" startIcon={<Visibility />} onClick={() => setViewEmployee(emp)} sx={{ fontSize: "0.72rem", color: "#3b82f6" }}>View</Button>
            <Button size="small" startIcon={<Assignment />} onClick={() => setAssignTarget(emp)} sx={{ fontSize: "0.72rem", color: "#8b5cf6" }}>Assign</Button>
            <Button size="small" startIcon={<Cancel />} onClick={() => handleDeleteUser(emp)} sx={{ fontSize: "0.72rem", color: "#ef4444" }}>Remove</Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <Box sx={{ textAlign: "center" }}>
          <Box sx={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #7c3aed", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", mx: "auto", mb: 2 }} />
          <Typography color="text.secondary">Loading employees…</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{
          display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 3,
        }}>
          <Box>
            <Typography variant="h5" fontWeight={800}>Employee Management</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage employees and assign bookings
            </Typography>
          </Box>
          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={() => setAddOpen(true)}
            sx={{ bgcolor: "#7c3aed", "&:hover": { bgcolor: "#6d28d9" }, borderRadius: 2.5, fontWeight: 700, whiteSpace: "nowrap" }}
          >
            Add Employee
          </Button>
        </Box>
      </motion.div>

      {/* ── Stats Row ─────────────────────────────────────────────────────── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(2, 1fr)" }, gap: { xs: 1.5, md: 2 }, mb: 3 }}>
        {statsCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card sx={{ borderRadius: 3, border: `1px solid ${s.color}22`, bgcolor: s.bg, boxShadow: `0 2px 12px ${s.color}14` }}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 }, "&:last-child": { pb: "16px !important" } }}>
                <Typography variant="h4" fontWeight={800} sx={{ color: s.color, fontSize: { xs: "1.8rem", md: "2.2rem" } }}>{s.value}</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>{s.label}</Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* ── Search ────────────────────────────────────────────────────────── */}
      <Card sx={{ borderRadius: 3, mb: 2.5, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search employees…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: "text.secondary" }} /></InputAdornment> }}
              sx={{ flex: 1, minWidth: 220 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: "auto", whiteSpace: "nowrap" }}>
              {filtered.length} of {employees.length} shown
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* ── Employee Table (desktop) / Cards (mobile) ─────────────────────── */}
      {isMobile || isTablet ? (
        <Box sx={{ pb: 2 }}>
          {filtered.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>No employees found.</Typography>
          ) : (
            filtered.map((emp) => <EmployeeCard key={emp.id} emp={emp} />)
          )}
        </Box>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", overflow: "hidden" }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f9fafb" }}>
                  {["#", "Employee", "Username", "Email", "Actions"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.78rem", color: "#6b7280", py: 1.5 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>No employees found.</TableCell>
                  </TableRow>
                ) : (
                  filtered.map((emp, idx) => (
                    <TableRow key={emp.id} sx={{ "&:hover": { bgcolor: "#f9fafb" }, borderBottom: "1px solid #f3f4f6" }}>
                      <TableCell sx={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 600 }}>{idx + 1}</TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: "#f5f3ff", color: "#7c3aed", fontWeight: 700, width: 34, height: 34, fontSize: "0.85rem" }}>
                            {getInitial(emp)}
                          </Avatar>
                          <Typography variant="body2" fontWeight={700} sx={{ fontSize: "0.83rem" }}>{getDisplayName(emp)}</Typography>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ fontSize: "0.82rem", color: "text.secondary" }}>{emp.username}</TableCell>
                      <TableCell sx={{ fontSize: "0.82rem", color: "text.secondary" }}>{emp.email}</TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => setViewEmployee(emp)} sx={{ color: "#3b82f6" }}>
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Assign Booking">
                            <IconButton size="small" onClick={() => setAssignTarget(emp)} sx={{ color: "#8b5cf6" }}>
                              <Assignment fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove">
                            <IconButton size="small" onClick={() => handleDeleteUser(emp)} sx={{ color: "#ef4444" }}>
                              <Cancel fontSize="small" />
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
        </motion.div>
      )}

      {/* ── View Details Drawer ───────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={!!viewEmployee}
        onClose={() => setViewEmployee(null)}
        PaperProps={{ sx: { width: { xs: "100%", sm: 400 }, p: 3 } }}
      >
        {viewEmployee && (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" fontWeight={700}>Employee Details</Typography>
              <IconButton onClick={() => setViewEmployee(null)}><Close /></IconButton>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: "#f5f3ff", color: "#7c3aed", fontSize: "2rem", fontWeight: 800, mb: 1.5 }}>
                {getInitial(viewEmployee)}
              </Avatar>
              <Typography variant="h6" fontWeight={800}>{getDisplayName(viewEmployee)}</Typography>
              <Chip label="Employee" size="small" sx={{ bgcolor: "#f5f3ff", color: "#7c3aed", fontWeight: 700, mt: 1 }} />
            </Box>

            <Divider sx={{ mb: 2.5 }} />

            {[
              { icon: <Person sx={{ fontSize: 18, color: "#3b82f6" }} />, label: "Username", val: viewEmployee.username },
              { icon: <EmailIcon sx={{ fontSize: 18, color: "#10b981" }} />, label: "Email", val: viewEmployee.email },
            ].map((row) => (
              <Box key={row.label} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", mb: 2 }}>
                <Box sx={{ mt: 0.15 }}>{row.icon}</Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">{row.label}</Typography>
                  <Typography variant="body2" fontWeight={600}>{row.val}</Typography>
                </Box>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Button
              fullWidth variant="contained"
              onClick={() => { setAssignTarget(viewEmployee); setViewEmployee(null); }}
              sx={{ bgcolor: "#8b5cf6", "&:hover": { bgcolor: "#7c3aed" }, borderRadius: 2, fontWeight: 700 }}
              startIcon={<Assignment />}
            >
              Assign Booking
            </Button>
          </>
        )}
      </Drawer>

      {/* ── Assign Booking Modal ──────────────────────────────────────────── */}
      <Dialog open={!!assignTarget} onClose={() => setAssignTarget(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Assign Booking
          <Typography variant="body2" color="text.secondary">Assigning to: <strong>{assignTarget ? getDisplayName(assignTarget) : ""}</strong></Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          {bookings.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">No unassigned bookings available.</Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {bookings.map((b) => (
                <Box
                  key={b.id}
                  onClick={() => handleAssignBooking(b)}
                  sx={{
                    p: 2, borderRadius: 2.5, border: "1px solid #e5e7eb", cursor: "pointer",
                    "&:hover": { bgcolor: "#f5f3ff", borderColor: "#8b5cf6" },
                    transition: "all 0.15s",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="body2" fontWeight={700} sx={{ color: "#7c3aed" }}>{b.book_id}</Typography>
                      <Typography variant="body2" fontWeight={600}>{b.user_name}</Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="body2" fontWeight={700}>₹{Number(b.total_amount).toLocaleString("en-IN")}</Typography>
                      <Typography variant="caption" color="text.secondary">{b.selected_date} · {b.selected_time}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Chip label={b.status} size="small" color="warning" sx={{ fontSize: "0.7rem", height: 20, fontWeight: 600 }} />
                    <Chip label="Unassigned" size="small" color="default" sx={{ fontSize: "0.7rem", height: 20, fontWeight: 600 }} />
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAssignTarget(null)} sx={{ color: "text.secondary" }}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* ── Add Employee Modal ────────────────────────────────────────────── */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Register New Employee
          <IconButton size="small" onClick={() => setAddOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, pt: 1 }}>
            <TextField label="Username *" size="small" value={newEmp.username} onChange={(e) => setNewEmp((p) => ({ ...p, username: e.target.value }))} />
            <TextField label="Email *" size="small" type="email" value={newEmp.email} onChange={(e) => setNewEmp((p) => ({ ...p, email: e.target.value }))} />
            <TextField label="Phone" size="small" value={newEmp.phone} onChange={(e) => setNewEmp((p) => ({ ...p, phone: e.target.value }))} />
            <TextField label="Password *" size="small" type="password" value={newEmp.password} onChange={(e) => setNewEmp((p) => ({ ...p, password: e.target.value }))} />
            <TextField
              label="Employee Code"
              size="small"
              value={newEmp.employee_code}
              onChange={(e) => setNewEmp((p) => ({ ...p, employee_code: e.target.value }))}
              sx={{ gridColumn: { sm: "span 2" } }}
            />
          </Box>
          <Box sx={{ mt: 2, p: 1.5, bgcolor: "#eff6ff", borderRadius: 2, border: "1px solid #bfdbfe" }}>
            <Typography variant="caption" sx={{ color: "#1e40af" }}>
              Employee will be registered with the <strong>EMPLOYEE</strong> role. They can log in using their credentials.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ color: "text.secondary" }}>Cancel</Button>
          <Button onClick={handleAddEmployee} variant="contained" sx={{ bgcolor: "#7c3aed", "&:hover": { bgcolor: "#6d28d9" }, borderRadius: 2, fontWeight: 700 }}>
            Register Employee
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ──────────────────────────────────────────────────────── */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity} sx={{ fontWeight: 600, borderRadius: 2 }} onClose={() => setSnack((p) => ({ ...p, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
