"use client";
import React, { useState } from "react";
import {
  Box, Typography, Card, CardContent, TextField, Button, Switch,
  FormControlLabel, Tab, Tabs, Divider, InputAdornment, MenuItem,
  Select, FormControl, InputLabel, CircularProgress, Alert,
  SelectChangeEvent,
} from "@mui/material";
import {
  Settings as SettingsIcon, Search as SeoIcon, Email as EmailIcon,
  Payment as PaymentIcon, Save as SaveIcon, Check as CheckIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { mockSettings } from "@/app/lib/mock/adminData";

const TAB_ICONS = [<SettingsIcon key="g" />, <SeoIcon key="s" />, <EmailIcon key="e" />, <PaymentIcon key="p" />];
const TAB_LABELS = ["General", "SEO", "Email", "Payment"];

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, mt: 1, color: "text.primary" }}>
    {children}
  </Typography>
);

const FieldRow = ({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) => (
  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: `repeat(${cols}, 1fr)` }, gap: 2, mb: 2 }}>
    {children}
  </Box>
);

export default function AdminSettingsPage() {
  const [tab, setTab] = useState(0);
  const [saving, setSaving] = useState(false);

  // General settings state
  const [general, setGeneral] = useState(mockSettings.general);
  // SEO settings state
  const [seo, setSeo] = useState(mockSettings.seo);
  // Email settings state
  const [email, setEmail] = useState(mockSettings.email);
  // Payment settings state
  const [payment, setPayment] = useState(mockSettings.payment);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    toast.success(`${TAB_LABELS[tab]} settings saved successfully!`);
  };

  const SaveButton = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, pt: 3, borderTop: "1px solid", borderColor: "divider" }}>
      <Button
        variant="contained"
        startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon />}
        onClick={handleSave}
        disabled={saving}
        sx={{ bgcolor: "#f59e0b", color: "white", fontWeight: 700, "&:hover": { bgcolor: "#d97706" }, borderRadius: 2, px: 4, py: 1.2 }}
      >
        {saving ? "Saving…" : "Save Settings"}
      </Button>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Configure your OKPUJA platform settings
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2, fontSize: "0.84rem" }}>
        Changes are saved locally. Connect your backend API to persist settings.
      </Alert>

      {/* Settings Card */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2, "& .MuiTab-root": { fontSize: "0.82rem", fontWeight: 600, minHeight: 56 } }}
          >
            {TAB_LABELS.map((label, idx) => (
              <Tab key={label} label={label} icon={TAB_ICONS[idx]} iconPosition="start" />
            ))}
          </Tabs>
        </Box>

        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          {/* ── General Settings ── */}
          {tab === 0 && (
            <motion.div key="general" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SectionTitle>Site Information</SectionTitle>
              <FieldRow>
                <TextField label="Site Name" value={general.siteName} onChange={(e) => setGeneral({ ...general, siteName: e.target.value })} size="small" fullWidth />
                <TextField label="Tagline" value={general.tagline} onChange={(e) => setGeneral({ ...general, tagline: e.target.value })} size="small" fullWidth />
              </FieldRow>
              <FieldRow>
                <TextField label="Contact Email" value={general.email} onChange={(e) => setGeneral({ ...general, email: e.target.value })} size="small" fullWidth type="email" />
                <TextField label="Contact Phone" value={general.phone} onChange={(e) => setGeneral({ ...general, phone: e.target.value })} size="small" fullWidth />
              </FieldRow>
              <TextField label="Business Address" value={general.address} onChange={(e) => setGeneral({ ...general, address: e.target.value })} size="small" fullWidth sx={{ mb: 2 }} />

              <Divider sx={{ my: 2 }} />
              <SectionTitle>Regional Settings</SectionTitle>
              <FieldRow>
                <FormControl size="small" fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select value={general.currency} label="Currency" onChange={(e: SelectChangeEvent) => setGeneral({ ...general, currency: e.target.value })}>
                    <MenuItem value="INR">INR – Indian Rupee (₹)</MenuItem>
                    <MenuItem value="USD">USD – US Dollar ($)</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select value={general.timezone} label="Timezone" onChange={(e: SelectChangeEvent) => setGeneral({ ...general, timezone: e.target.value })}>
                    <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</MenuItem>
                    <MenuItem value="UTC">UTC</MenuItem>
                  </Select>
                </FormControl>
              </FieldRow>
              <SaveButton />
            </motion.div>
          )}

          {/* ── SEO Settings ── */}
          {tab === 1 && (
            <motion.div key="seo" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SectionTitle>Search Engine Optimization</SectionTitle>
              <TextField label="Meta Title" value={seo.metaTitle} onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })} size="small" fullWidth sx={{ mb: 2 }} helperText={`${seo.metaTitle.length}/60 chars (recommended)`} />
              <TextField
                label="Meta Description"
                value={seo.metaDescription}
                onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                size="small"
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 2 }}
                helperText={`${seo.metaDescription.length}/160 chars (recommended)`}
              />
              <TextField label="Keywords (comma-separated)" value={seo.keywords} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })} size="small" fullWidth sx={{ mb: 2 }} />

              <Divider sx={{ my: 2 }} />
              <SectionTitle>Analytics &amp; Tracking</SectionTitle>
              <FieldRow>
                <TextField
                  label="Google Analytics ID"
                  value={seo.googleAnalyticsId}
                  onChange={(e) => setSeo({ ...seo, googleAnalyticsId: e.target.value })}
                  size="small"
                  fullWidth
                  placeholder="G-XXXXXXXXXX"
                />
                <TextField
                  label="Facebook Pixel ID"
                  value={seo.facebookPixelId}
                  onChange={(e) => setSeo({ ...seo, facebookPixelId: e.target.value })}
                  size="small"
                  fullWidth
                  placeholder="Enter Pixel ID"
                />
              </FieldRow>
              <SaveButton />
            </motion.div>
          )}

          {/* ── Email Settings ── */}
          {tab === 2 && (
            <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SectionTitle>SMTP Configuration</SectionTitle>
              <FieldRow>
                <TextField label="SMTP Host" value={email.smtpHost} onChange={(e) => setEmail({ ...email, smtpHost: e.target.value })} size="small" fullWidth />
                <TextField label="SMTP Port" value={email.smtpPort} onChange={(e) => setEmail({ ...email, smtpPort: e.target.value })} size="small" fullWidth />
              </FieldRow>
              <FieldRow>
                <TextField label="SMTP Username" value={email.smtpUser} onChange={(e) => setEmail({ ...email, smtpUser: e.target.value })} size="small" fullWidth />
                <TextField label="From Name" value={email.fromName} onChange={(e) => setEmail({ ...email, fromName: e.target.value })} size="small" fullWidth />
              </FieldRow>

              <Divider sx={{ my: 2 }} />
              <SectionTitle>Email Notifications</SectionTitle>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {[
                  { key: "bookingConfirmation", label: "Booking Confirmation Email" },
                  { key: "paymentReceipt", label: "Payment Receipt Email" },
                  { key: "reminderEmails", label: "Reminder Emails (24h before puja)" },
                ].map(({ key, label }) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Switch
                        checked={email[key as keyof typeof email] as boolean}
                        onChange={(e) => setEmail({ ...email, [key]: e.target.checked })}
                        sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#f59e0b" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#f59e0b" } }}
                      />
                    }
                    label={<Typography variant="body2">{label}</Typography>}
                  />
                ))}
              </Box>
              <SaveButton />
            </motion.div>
          )}

          {/* ── Payment Settings ── */}
          {tab === 3 && (
            <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SectionTitle>Payment Methods</SectionTitle>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1, mb: 3 }}>
                {[
                  { key: "phonepeEnabled", label: "PhonePe" },
                  { key: "upiEnabled", label: "UPI" },
                  { key: "cardEnabled", label: "Credit / Debit Card" },
                  { key: "netBankingEnabled", label: "Net Banking" },
                  { key: "walletEnabled", label: "Digital Wallets" },
                ].map(({ key, label }) => (
                  <Card key={key} sx={{ borderRadius: 2, border: `1px solid ${payment[key as keyof typeof payment] ? "#f59e0b44" : "#e5e7eb"}`, boxShadow: "none" }}>
                    <CardContent sx={{ p: "12px 16px !important" }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={payment[key as keyof typeof payment] as boolean}
                            onChange={(e) => setPayment({ ...payment, [key]: e.target.checked })}
                            sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#f59e0b" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#f59e0b" } }}
                          />
                        }
                        label={<Typography variant="body2" fontWeight={600}>{label}</Typography>}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />
              <SectionTitle>Transaction Limits</SectionTitle>
              <FieldRow cols={3}>
                <TextField
                  label="Min. Amount (₹)"
                  value={payment.minimumAmount}
                  onChange={(e) => setPayment({ ...payment, minimumAmount: Number(e.target.value) })}
                  size="small"
                  fullWidth
                  type="number"
                  InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                />
                <TextField
                  label="Max. Amount (₹)"
                  value={payment.maximumAmount}
                  onChange={(e) => setPayment({ ...payment, maximumAmount: Number(e.target.value) })}
                  size="small"
                  fullWidth
                  type="number"
                  InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                />
                <TextField
                  label="Platform Commission %"
                  value={payment.commissionPercent}
                  onChange={(e) => setPayment({ ...payment, commissionPercent: Number(e.target.value) })}
                  size="small"
                  fullWidth
                  type="number"
                  InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                />
              </FieldRow>

              <Card sx={{ borderRadius: 2, bgcolor: payment.testMode ? "#fef3c7" : "#f0fdf4", border: `1px solid ${payment.testMode ? "#f59e0b44" : "#10b98144"}`, boxShadow: "none", mt: 2 }}>
                <CardContent sx={{ p: "12px 16px !important", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="body2" fontWeight={700}>{payment.testMode ? "⚠️ Test Mode Enabled" : "✅ Live Mode Active"}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {payment.testMode ? "Payments will not be processed for real." : "Real payments are being processed."}
                    </Typography>
                  </Box>
                  <Switch
                    checked={payment.testMode}
                    onChange={(e) => setPayment({ ...payment, testMode: e.target.checked })}
                    color={payment.testMode ? "warning" : "success"}
                  />
                </CardContent>
              </Card>
              <SaveButton />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
