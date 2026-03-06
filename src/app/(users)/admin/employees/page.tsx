"use client";
import React, { useState, useMemo } from "react";
import {
  Box, Typography, Card, CardContent, Chip, Avatar, Button, IconButton,
  TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  useTheme, useMediaQuery, Drawer, Snackbar, Alert, SelectChangeEvent,
} from "@mui/material";
import {
  Search, FilterList, Add, CheckCircle, Cancel, Assignment,
  Edit, Visibility, Star, StarBorder, Close, Person, Phone,
  Email, LocationOn, Work, AttachMoney, CalendarMonth,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { mockEmployees, mockBookingsForAssignment } from "@/app/lib/mock/adminData";

// ─── Types ────────────────────────────────────────────────────────────────────
type Employee = typeof mockEmployees[0];
type Booking = typeof mockBookingsForAssignment[0];
type EmployeeStatus = "active" | "inactive" | "pending";
type AvailabilityStatus = "available" | "busy" | "unavailable";

// ─── Color helpers ─────────────────────────────────────────────────────────
const statusColors: Record<EmployeeStatus, "success" | "warning" | "error"> = {
  active: "success",
  pending: "warning",
  inactive: "error",
};

const availabilityColors: Record<AvailabilityStatus, string> = {
  available: "#10b981",
  busy: "#f59e0b",
  unavailable: "#6b7280",
};

const roleColors: Record<string, { bg: string; color: string }> = {
  pandit: { bg: "#fff7ed", color: "#c2410c" },
  astrologer: { bg: "#f5f3ff", color: "#7c3aed" },
};

// ─── Star rating renderer ──────────────────────────────────────────────────
const Stars = ({ value }: { value: number }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
    {[1, 2, 3, 4, 5].map((s) =>
      s <= Math.floor(value) ? (
        <Star key={s} sx={{ fontSize: 14, color: "#f59e0b" }} />
      ) : (
        <StarBorder key={s} sx={{ fontSize: 14, color: "#d1d5db" }} />
      )
    )}
    {value > 0 && (
      <Typography variant="caption" fontWeight={700} sx={{ ml: 0.3, color: "#374151" }}>
        {value.toFixed(1)}
      </Typography>
    )}
  </Box>
);

// ─── Main Component ────────────────────────────────────────────────────────
export default function EmployeesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // State
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [bookings, setBookings] = useState<Booking[]>(mockBookingsForAssignment);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [availFilter, setAvailFilter] = useState<string>("all");

  // Dialog states
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [assignTarget, setAssignTarget] = useState<Employee | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: "success" | "error" }>({ open: false, msg: "", severity: "success" });

  // Add Employee form state
  const [newEmp, setNewEmp] = useState({ name: "", email: "", phone: "", role: "pandit", city: "", specialization: "", salary: "" });

  // ─── Derived stats ──────────────────────────────────────────────────────
  const statsCards = useMemo(() => [
    { label: "Total Employees", value: employees.length, color: "#3b82f6", bg: "#eff6ff" },
    { label: "Active", value: employees.filter((e) => e.status === "active").length, color: "#10b981", bg: "#ecfdf5" },
    { label: "Pending Approval", value: employees.filter((e) => e.status === "pending").length, color: "#f59e0b", bg: "#fffbeb" },
    { label: "Available Now", value: employees.filter((e) => e.availability === "available").length, color: "#8b5cf6", bg: "#f5f3ff" },
  ], [employees]);

  // ─── Filtered list ─────────────────────────────────────────────────────
  const filtered = useMemo(() => employees.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.city.toLowerCase().includes(q);
    const matchRole = roleFilter === "all" || e.role === roleFilter;
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    const matchAvail = availFilter === "all" || e.availability === availFilter;
    return matchSearch && matchRole && matchStatus && matchAvail;
  }), [employees, search, roleFilter, statusFilter, availFilter]);

  // ─── Actions ───────────────────────────────────────────────────────────
  const handleApprove = (id: number) => {
    setEmployees((prev) => prev.map((e) => e.id === id ? { ...e, status: "active", availability: "available" } : e));
    setSnack({ open: true, msg: "Employee approved and activated.", severity: "success" });
  };
  const handleDeactivate = (id: number) => {
    setEmployees((prev) => prev.map((e) => e.id === id ? { ...e, status: "inactive", availability: "unavailable" } : e));
    setSnack({ open: true, msg: "Employee deactivated.", severity: "success" });
  };
  const handleReactivate = (id: number) => {
    setEmployees((prev) => prev.map((e) => e.id === id ? { ...e, status: "active", availability: "available" } : e));
    setSnack({ open: true, msg: "Employee reactivated.", severity: "success" });
  };
  const handleReject = (id: number) => {
    setEmployees((prev) => prev.map((e) => e.id === id ? { ...e, status: "inactive" } : e));
    setSnack({ open: true, msg: "Employee request rejected.", severity: "error" });
  };
  const handleAssignBooking = (booking: Booking) => {
    if (!assignTarget) return;
    setBookings((prev) => prev.filter((b) => b.id !== booking.id));
    setEmployees((prev) => prev.map((e) =>
      e.id === assignTarget.id ? { ...e, assignedBookings: e.assignedBookings + 1, availability: "busy" } : e
    ));
    setAssignTarget(null);
    setSnack({ open: true, msg: `Booking ${booking.id} assigned to ${assignTarget.name}.`, severity: "success" });
  };
  const handleAddEmployee = () => {
    if (!newEmp.name || !newEmp.email || !newEmp.phone || !newEmp.city) {
      setSnack({ open: true, msg: "Please fill all required fields.", severity: "error" });
      return;
    }
    const emp: Employee = {
      id: Date.now(),
      name: newEmp.name.trim(),
      email: newEmp.email.trim(),
      phone: newEmp.phone.trim(),
      role: newEmp.role as "pandit" | "astrologer",
      city: newEmp.city.trim(),
      specialization: newEmp.specialization.trim() || "General",
      status: "pending",
      joinDate: new Date().toISOString().split("T")[0],
      assignedBookings: 0,
      completedBookings: 0,
      rating: 0,
      salary: Number(newEmp.salary) || 18000,
      availability: "unavailable",
    };
    setEmployees((prev) => [emp, ...prev]);
    setNewEmp({ name: "", email: "", phone: "", role: "pandit", city: "", specialization: "", salary: "" });
    setAddOpen(false);
    setSnack({ open: true, msg: "Employee added and pending approval.", severity: "success" });
  };

  // ─── Employee card (mobile view) ──────────────────────────────────────
  const EmployeeCard = ({ emp }: { emp: Employee }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card sx={{ borderRadius: 3, mb: 1.5, border: "1px solid #f3f4f6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <Avatar sx={{ bgcolor: roleColors[emp.role]?.bg, color: roleColors[emp.role]?.color, fontWeight: 700, width: 44, height: 44, fontSize: "1rem" }}>
                {emp.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={700}>{emp.name}</Typography>
                <Chip label={emp.role} size="small" sx={{ bgcolor: roleColors[emp.role]?.bg, color: roleColors[emp.role]?.color, fontWeight: 600, fontSize: "0.68rem", height: 18, mt: 0.3 }} />
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
              <Chip label={emp.status} size="small" color={statusColors[emp.status as EmployeeStatus]} sx={{ fontWeight: 700, fontSize: "0.7rem" }} />
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: availabilityColors[emp.availability as AvailabilityStatus] }} />
            </Box>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mt: 1.5, mb: 1.5 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">City</Typography>
              <Typography variant="body2" fontWeight={600}>{emp.city}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Bookings</Typography>
              <Typography variant="body2" fontWeight={600}>{emp.assignedBookings} / {emp.completedBookings}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Rating</Typography>
              <Stars value={emp.rating} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Salary</Typography>
              <Typography variant="body2" fontWeight={600}>₹{emp.salary.toLocaleString("en-IN")}</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button size="small" startIcon={<Visibility />} onClick={() => setViewEmployee(emp)} sx={{ fontSize: "0.72rem", color: "#3b82f6" }}>View</Button>
            {emp.status === "pending" && (
              <>
                <Button size="small" startIcon={<CheckCircle />} onClick={() => handleApprove(emp.id)} sx={{ fontSize: "0.72rem", color: "#10b981" }}>Approve</Button>
                <Button size="small" startIcon={<Cancel />} onClick={() => handleReject(emp.id)} sx={{ fontSize: "0.72rem", color: "#ef4444" }}>Reject</Button>
              </>
            )}
            {emp.status === "active" && (
              <>
                <Button size="small" startIcon={<Assignment />} onClick={() => setAssignTarget(emp)} sx={{ fontSize: "0.72rem", color: "#8b5cf6" }}>Assign</Button>
                <Button size="small" startIcon={<Cancel />} onClick={() => handleDeactivate(emp.id)} sx={{ fontSize: "0.72rem", color: "#ef4444" }}>Deactivate</Button>
              </>
            )}
            {emp.status === "inactive" && (
              <Button size="small" startIcon={<CheckCircle />} onClick={() => handleReactivate(emp.id)} sx={{ fontSize: "0.72rem", color: "#10b981" }}>Reactivate</Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

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
              Manage pandits & astrologers — approve registrations, assign bookings
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
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: { xs: 1.5, md: 2 }, mb: 3 }}>
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

      {/* ── Pending Approvals Banner ──────────────────────────────────────── */}
      {employees.filter((e) => e.status === "pending").length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Box sx={{
            p: 2, mb: 2.5, borderRadius: 3, bgcolor: "#fffbeb", border: "1px solid #fde68a",
            display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2,
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={700} sx={{ color: "#92400e" }}>
                ⏳ {employees.filter((e) => e.status === "pending").length} employee(s) waiting for approval
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {employees.filter((e) => e.status === "pending").map((e) => (
                  <Box key={e.id} sx={{ display: "flex", gap: 0.8, alignItems: "center", bgcolor: "white", border: "1px solid #fde68a", borderRadius: 2, px: 1.5, py: 0.5 }}>
                    <Typography variant="body2" fontWeight={600}>{e.name}</Typography>
                    <Chip label={e.role} size="small" sx={{ bgcolor: roleColors[e.role]?.bg, color: roleColors[e.role]?.color, fontSize: "0.68rem", height: 18 }} />
                    <Button size="small" onClick={() => handleApprove(e.id)} sx={{ color: "#10b981", minWidth: 0, p: 0.3, fontSize: "0.72rem", fontWeight: 700 }}>Approve</Button>
                    <Typography variant="body2" color="text.secondary">|</Typography>
                    <Button size="small" onClick={() => handleReject(e.id)} sx={{ color: "#ef4444", minWidth: 0, p: 0.3, fontSize: "0.72rem", fontWeight: 700 }}>Reject</Button>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </motion.div>
      )}

      {/* ── Filters ───────────────────────────────────────────────────────── */}
      <Card sx={{ borderRadius: 3, mb: 2.5, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search employees…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: "text.secondary" }} /></InputAdornment> }}
              sx={{ flex: 1, minWidth: 180 }}
            />
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Role</InputLabel>
              <Select value={roleFilter} label="Role" onChange={(e: SelectChangeEvent) => setRoleFilter(e.target.value)}>
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="pandit">Pandit</MenuItem>
                <MenuItem value="astrologer">Astrologer</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value)}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Availability</InputLabel>
              <Select value={availFilter} label="Availability" onChange={(e: SelectChangeEvent) => setAvailFilter(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="busy">Busy</MenuItem>
                <MenuItem value="unavailable">Unavailable</MenuItem>
              </Select>
            </FormControl>
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
                  {["#", "Employee", "Role", "City / Specialisation", "Availability", "Bookings", "Rating", "Salary", "Status", "Actions"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.78rem", color: "#6b7280", py: 1.5 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>No employees found.</TableCell>
                  </TableRow>
                ) : (
                  filtered.map((emp, idx) => (
                    <TableRow
                      key={emp.id}
                      sx={{ "&:hover": { bgcolor: "#f9fafb" }, borderBottom: "1px solid #f3f4f6" }}
                    >
                      <TableCell sx={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 600 }}>{idx + 1}</TableCell>

                      {/* Employee column */}
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: roleColors[emp.role]?.bg, color: roleColors[emp.role]?.color, fontWeight: 700, width: 34, height: 34, fontSize: "0.85rem" }}>
                            {emp.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700} sx={{ fontSize: "0.83rem" }}>{emp.name}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>{emp.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={emp.role}
                          size="small"
                          sx={{ bgcolor: roleColors[emp.role]?.bg, color: roleColors[emp.role]?.color, fontWeight: 700, fontSize: "0.7rem" }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.82rem" }}>{emp.city}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem", display: "block", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {emp.specialization}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: availabilityColors[emp.availability as AvailabilityStatus], flexShrink: 0 }} />
                          <Typography variant="caption" sx={{ textTransform: "capitalize", fontSize: "0.78rem" }}>{emp.availability}</Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: "0.82rem" }}>
                          <span style={{ fontWeight: 700 }}>{emp.assignedBookings}</span>
                          <span style={{ color: "#9ca3af" }}> / {emp.completedBookings}</span>
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>Assigned / Done</Typography>
                      </TableCell>

                      <TableCell><Stars value={emp.rating} /></TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={700} sx={{ fontSize: "0.82rem" }}>
                          ₹{emp.salary.toLocaleString("en-IN")}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={emp.status}
                          size="small"
                          color={statusColors[emp.status as EmployeeStatus]}
                          sx={{ fontWeight: 700, fontSize: "0.7rem", textTransform: "capitalize" }}
                        />
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => setViewEmployee(emp)} sx={{ color: "#3b82f6" }}>
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {emp.status === "pending" && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton size="small" onClick={() => handleApprove(emp.id)} sx={{ color: "#10b981" }}>
                                  <CheckCircle fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton size="small" onClick={() => handleReject(emp.id)} sx={{ color: "#ef4444" }}>
                                  <Cancel fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}

                          {emp.status === "active" && (
                            <>
                              <Tooltip title="Assign Booking">
                                <IconButton size="small" onClick={() => setAssignTarget(emp)} sx={{ color: "#8b5cf6" }}>
                                  <Assignment fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Deactivate">
                                <IconButton size="small" onClick={() => handleDeactivate(emp.id)} sx={{ color: "#ef4444" }}>
                                  <Cancel fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}

                          {emp.status === "inactive" && (
                            <Tooltip title="Reactivate">
                              <IconButton size="small" onClick={() => handleReactivate(emp.id)} sx={{ color: "#10b981" }}>
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
        </motion.div>
      )}

      {/* ── View Details Drawer ───────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={!!viewEmployee}
        onClose={() => setViewEmployee(null)}
        PaperProps={{ sx: { width: { xs: "100%", sm: 420 }, p: 3 } }}
      >
        {viewEmployee && (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" fontWeight={700}>Employee Details</Typography>
              <IconButton onClick={() => setViewEmployee(null)}><Close /></IconButton>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: roleColors[viewEmployee.role]?.bg, color: roleColors[viewEmployee.role]?.color, fontSize: "2rem", fontWeight: 800, mb: 1.5 }}>
                {viewEmployee.name.charAt(0)}
              </Avatar>
              <Typography variant="h6" fontWeight={800}>{viewEmployee.name}</Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Chip label={viewEmployee.role} size="small" sx={{ bgcolor: roleColors[viewEmployee.role]?.bg, color: roleColors[viewEmployee.role]?.color, fontWeight: 700 }} />
                <Chip label={viewEmployee.status} size="small" color={statusColors[viewEmployee.status as EmployeeStatus]} sx={{ fontWeight: 700 }} />
              </Box>
            </Box>

            <Divider sx={{ mb: 2.5 }} />

            {[
              { icon: <Email sx={{ fontSize: 18, color: "#3b82f6" }} />, label: "Email", val: viewEmployee.email },
              { icon: <Phone sx={{ fontSize: 18, color: "#10b981" }} />, label: "Phone", val: viewEmployee.phone },
              { icon: <LocationOn sx={{ fontSize: 18, color: "#f59e0b" }} />, label: "City", val: viewEmployee.city },
              { icon: <Work sx={{ fontSize: 18, color: "#8b5cf6" }} />, label: "Specialization", val: viewEmployee.specialization },
              { icon: <AttachMoney sx={{ fontSize: 18, color: "#10b981" }} />, label: "Monthly Salary", val: `₹${viewEmployee.salary.toLocaleString("en-IN")}` },
              { icon: <CalendarMonth sx={{ fontSize: 18, color: "#6b7280" }} />, label: "Joined", val: viewEmployee.joinDate },
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

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1.5, mb: 2.5 }}>
              {[
                { label: "Assigned", val: viewEmployee.assignedBookings, color: "#3b82f6" },
                { label: "Completed", val: viewEmployee.completedBookings, color: "#10b981" },
                { label: "Rating", val: viewEmployee.rating > 0 ? viewEmployee.rating.toFixed(1) : "N/A", color: "#f59e0b" },
              ].map((m) => (
                <Box key={m.label} sx={{ textAlign: "center", p: 1.5, bgcolor: "#f9fafb", borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight={800} sx={{ color: m.color }}>{m.val}</Typography>
                  <Typography variant="caption" color="text.secondary">{m.label}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {viewEmployee.status === "pending" && (
                <>
                  <Button fullWidth variant="contained" onClick={() => { handleApprove(viewEmployee.id); setViewEmployee(null); }} sx={{ bgcolor: "#10b981", "&:hover": { bgcolor: "#059669" }, borderRadius: 2, fontWeight: 700 }} startIcon={<CheckCircle />}>Approve</Button>
                  <Button fullWidth variant="outlined" color="error" onClick={() => { handleReject(viewEmployee.id); setViewEmployee(null); }} sx={{ borderRadius: 2, fontWeight: 700 }} startIcon={<Cancel />}>Reject</Button>
                </>
              )}
              {viewEmployee.status === "active" && (
                <>
                  <Button fullWidth variant="contained" onClick={() => { setAssignTarget(viewEmployee); setViewEmployee(null); }} sx={{ bgcolor: "#8b5cf6", "&:hover": { bgcolor: "#7c3aed" }, borderRadius: 2, fontWeight: 700 }} startIcon={<Assignment />}>Assign Booking</Button>
                  <Button fullWidth variant="outlined" color="error" onClick={() => { handleDeactivate(viewEmployee.id); setViewEmployee(null); }} sx={{ borderRadius: 2, fontWeight: 700 }} startIcon={<Cancel />}>Deactivate</Button>
                </>
              )}
              {viewEmployee.status === "inactive" && (
                <Button fullWidth variant="contained" onClick={() => { handleReactivate(viewEmployee.id); setViewEmployee(null); }} sx={{ bgcolor: "#10b981", "&:hover": { bgcolor: "#059669" }, borderRadius: 2, fontWeight: 700 }} startIcon={<CheckCircle />}>Reactivate</Button>
              )}
            </Box>
          </>
        )}
      </Drawer>

      {/* ── Assign Booking Modal ──────────────────────────────────────────── */}
      <Dialog open={!!assignTarget} onClose={() => setAssignTarget(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Assign Booking
          <Typography variant="body2" color="text.secondary">Assigning to: <strong>{assignTarget?.name}</strong></Typography>
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
                      <Typography variant="body2" fontWeight={700} sx={{ color: "#7c3aed" }}>{b.id}</Typography>
                      <Typography variant="body2" fontWeight={600}>{b.customer}</Typography>
                      <Typography variant="caption" color="text.secondary">{b.service}</Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="body2" fontWeight={700}>₹{b.amount.toLocaleString("en-IN")}</Typography>
                      <Typography variant="caption" color="text.secondary">{b.date} · {b.time}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                    <Chip icon={<LocationOn sx={{ fontSize: "12px !important" }} />} label={b.city} size="small" sx={{ fontSize: "0.7rem", height: 20 }} />
                    <Chip label="Unassigned" size="small" color="warning" sx={{ fontSize: "0.7rem", height: 20, fontWeight: 600 }} />
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
          Add New Employee
          <IconButton size="small" onClick={() => setAddOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, pt: 1 }}>
            <TextField label="Full Name *" size="small" value={newEmp.name} onChange={(e) => setNewEmp((p) => ({ ...p, name: e.target.value }))} />
            <TextField label="Email *" size="small" type="email" value={newEmp.email} onChange={(e) => setNewEmp((p) => ({ ...p, email: e.target.value }))} />
            <TextField label="Phone *" size="small" value={newEmp.phone} onChange={(e) => setNewEmp((p) => ({ ...p, phone: e.target.value }))} />
            <FormControl size="small">
              <InputLabel>Role *</InputLabel>
              <Select value={newEmp.role} label="Role *" onChange={(e: SelectChangeEvent) => setNewEmp((p) => ({ ...p, role: e.target.value }))}>
                <MenuItem value="pandit">Pandit</MenuItem>
                <MenuItem value="astrologer">Astrologer</MenuItem>
              </Select>
            </FormControl>
            <TextField label="City *" size="small" value={newEmp.city} onChange={(e) => setNewEmp((p) => ({ ...p, city: e.target.value }))} />
            <TextField label="Specialization" size="small" value={newEmp.specialization} onChange={(e) => setNewEmp((p) => ({ ...p, specialization: e.target.value }))} />
            <TextField
              label="Monthly Salary (₹)" size="small" type="number"
              value={newEmp.salary} onChange={(e) => setNewEmp((p) => ({ ...p, salary: e.target.value }))}
              sx={{ gridColumn: { sm: "span 2" } }}
            />
          </Box>
          <Box sx={{ mt: 2, p: 1.5, bgcolor: "#fffbeb", borderRadius: 2, border: "1px solid #fde68a" }}>
            <Typography variant="caption" sx={{ color: "#92400e" }}>
              New employees are added with <strong>Pending</strong> status and require approval before they can be assigned bookings.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ color: "text.secondary" }}>Cancel</Button>
          <Button onClick={handleAddEmployee} variant="contained" sx={{ bgcolor: "#7c3aed", "&:hover": { bgcolor: "#6d28d9" }, borderRadius: 2, fontWeight: 700 }}>
            Add Employee
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
