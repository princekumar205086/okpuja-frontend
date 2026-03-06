"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, Card, CardContent, Button, Chip, Tab, Tabs, Divider,
  CircularProgress,
} from "@mui/material";
import {
  Save as SaveIcon, Policy as PolicyIcon, Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { mockPolicies } from "@/app/lib/mock/adminData";

const POLICY_TABS = [
  { key: "privacy-policy", label: "Privacy Policy" },
  { key: "terms-of-service", label: "Terms of Service" },
  { key: "refund-policy", label: "Refund Policy" },
];

// Simple toolbar button component
const ToolbarBtn = ({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    style={{
      padding: "4px 8px",
      margin: "2px",
      borderRadius: 4,
      border: "1px solid",
      borderColor: active ? "#f59e0b" : "#e5e7eb",
      background: active ? "#fef3c7" : "white",
      cursor: "pointer",
      fontWeight: active ? 700 : 400,
      fontSize: "0.82rem",
      color: active ? "#d97706" : "#374151",
      transition: "all 0.15s",
    }}
  >
    {children}
  </button>
);

function PolicyEditor({ policyKey }: { policyKey: string }) {
  const policyData = mockPolicies[policyKey];
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: policyData?.content ?? "",
    editorProps: {
      attributes: {
        class: "cms-editor-content",
        style: "min-height:320px; padding:16px; outline:none; font-size:0.92rem; line-height:1.7;",
      },
    },
  });

  // Reload content when policy tab changes
  useEffect(() => {
    if (editor && policyData?.content) {
      editor.commands.setContent(policyData.content);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyKey]);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setLastSaved(new Date().toLocaleTimeString());
    toast.success(`${policyData?.title ?? "Policy"} saved successfully!`);
  };

  if (!editor) return null;

  return (
    <Box>
      {/* Toolbar */}
      <Box sx={{ p: 1.5, borderBottom: "1px solid", borderColor: "divider", bgcolor: "grey.50", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0.5 }}>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
          <strong>B</strong>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
          <em>I</em>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
          <s>S</s>
        </ToolbarBtn>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
          H2
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
          H3
        </ToolbarBtn>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
          • List
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List">
          1. List
        </ToolbarBtn>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
          ❝
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Horizontal Rule">
          —
        </ToolbarBtn>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} active={false} title="Undo">
          ↩
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} active={false} title="Redo">
          ↪
        </ToolbarBtn>
      </Box>

      {/* Editor Content */}
      <Box
        sx={{
          border: "none",
          "& .cms-editor-content": {
            minHeight: 320,
            p: 2,
          },
          "& .cms-editor-content h2": { fontSize: "1.3rem", fontWeight: 700, mt: 2, mb: 1 },
          "& .cms-editor-content h3": { fontSize: "1.1rem", fontWeight: 700, mt: 1.5, mb: 0.5 },
          "& .cms-editor-content p": { mb: 1, lineHeight: 1.7 },
          "& .cms-editor-content ul, & .cms-editor-content ol": { pl: 3, mb: 1 },
          "& .cms-editor-content li": { mb: 0.5 },
          "& .cms-editor-content blockquote": {
            borderLeft: "3px solid #f59e0b", pl: 2, ml: 0, color: "text.secondary", fontStyle: "italic"
          },
          "& .cms-editor-content strong": { fontWeight: 700 },
          "& .ProseMirror:focus": { outline: "none" },
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {lastSaved && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ScheduleIcon sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">Last saved at {lastSaved}</Typography>
            </Box>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
          sx={{ bgcolor: "#f59e0b", color: "white", fontWeight: 700, "&:hover": { bgcolor: "#d97706" }, borderRadius: 2, px: 3 }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
}

export default function AdminCMSPoliciesPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
          CMS &amp; Policies
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Edit website policy pages with rich text editor
        </Typography>
      </Box>

      {/* Policy Cards Row */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2, mb: 3 }}>
        {POLICY_TABS.map((p, idx) => (
          <motion.div key={p.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
            <Card
              sx={{
                borderRadius: 3, cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                border: tab === idx ? "2px solid #f59e0b" : "2px solid transparent",
                transition: "border-color 0.2s",
              }}
              onClick={() => setTab(idx)}
            >
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
                <Box sx={{ bgcolor: tab === idx ? "#f59e0b18" : "grey.100", borderRadius: 2, p: 1.2, color: tab === idx ? "#f59e0b" : "text.secondary" }}>
                  <PolicyIcon />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={700}>{p.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Updated {mockPolicies[p.key]?.lastUpdated}
                  </Typography>
                </Box>
                {tab === idx && <Chip label="Editing" size="small" sx={{ ml: "auto", bgcolor: "#f59e0b", color: "white", fontWeight: 700, fontSize: "0.72rem" }} />}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Editor Card */}
      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          {/* Editor Tabs */}
          <Box sx={{ borderBottom: "1px solid", borderColor: "divider", px: 2, pt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
              <Typography variant="h6" fontWeight={700}>
                {POLICY_TABS[tab]?.label}
              </Typography>
              <Chip label="Rich Text Editor" size="small" sx={{ bgcolor: "#3b82f618", color: "#3b82f6", fontWeight: 600 }} />
            </Box>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ "& .MuiTab-root": { fontSize: "0.82rem", fontWeight: 600, minWidth: "auto" } }}>
              {POLICY_TABS.map((p) => <Tab key={p.key} label={p.label} />)}
            </Tabs>
          </Box>

          {/* Dynamic Editor */}
          <PolicyEditor key={POLICY_TABS[tab]?.key} policyKey={POLICY_TABS[tab]?.key ?? "privacy-policy"} />
        </Card>
      </motion.div>
    </Box>
  );
}
