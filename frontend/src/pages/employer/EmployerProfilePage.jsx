import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EmployerProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    companyName: user?.companyName || "",
    companyWebsite: user?.companyWebsite || "",
    industry: user?.industry || "",
  });

  const initials =
    user?.name
      ?.split(" ")
      .slice(-2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "HR";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await authService.updateProfile(form);
      updateUser(updated);
      setSuccess(true);
      setEditing(false);
    } catch (err) {
      setError(err?.message || "Lưu thất bại, thử lại sau.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
      companyName: user?.companyName || "",
      companyWebsite: user?.companyWebsite || "",
      industry: user?.industry || "",
    });
    setError(null);
    setEditing(false);
  };

  const readonlyFields = [
    { label: "Email", value: user?.email },
    {
      label: "Ngày tham gia",
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("vi-VN")
        : "Chưa rõ",
    },
  ];

  const editableFields = [
    { label: "Họ và tên", name: "name" },
    { label: "Số điện thoại", name: "phone" },
    { label: "Tên công ty", name: "companyName" },
    { label: "Website công ty", name: "companyWebsite" },
    { label: "Lĩnh vực", name: "industry" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#64748B",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 28,
          }}
        >
          ← Quay lại
        </button>

        <Card style={{ borderRadius: 16, border: "1.5px solid #E2E8F0" }}>
          <CardContent style={{ padding: 32 }}>
            {/* Avatar + tên */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 28,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <Avatar style={{ width: 72, height: 72 }}>
                  <AvatarFallback
                    style={{
                      background: "linear-gradient(135deg, #7C3AED, #1E40AF)",
                      color: "white",
                      fontSize: 24,
                      fontWeight: 700,
                    }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#0F172A",
                      marginBottom: 4,
                    }}
                  >
                    {user?.name}
                  </h2>
                  <Badge
                    style={{
                      background: "rgba(124,58,237,0.1)",
                      color: "#7C3AED",
                      border: "none",
                      fontSize: 11,
                    }}
                  >
                    Nhà tuyển dụng
                  </Badge>
                </div>
              </div>
              {!editing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(true);
                    setSuccess(false);
                  }}
                >
                  ✏️ Chỉnh sửa
                </Button>
              )}
            </div>

            <Separator style={{ marginBottom: 24 }} />

            {/* Thông báo */}
            {success && (
              <div
                style={{
                  background: "#F0FDF4",
                  border: "1px solid #86EFAC",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 16,
                  color: "#16A34A",
                  fontSize: 13,
                }}
              >
                ✅ Cập nhật hồ sơ thành công!
              </div>
            )}
            {error && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FCA5A5",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 16,
                  color: "#DC2626",
                  fontSize: 13,
                }}
              >
                ❌ {error}
              </div>
            )}

            {/* Form chỉnh sửa */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {editableFields.map((f) =>
                editing ? (
                  <div key={f.name}>
                    <Label
                      style={{
                        fontSize: 12,
                        color: "#64748B",
                        marginBottom: 4,
                        display: "block",
                      }}
                    >
                      {f.label}
                    </Label>
                    <Input
                      name={f.name}
                      value={form[f.name]}
                      onChange={handleChange}
                      placeholder={f.label}
                      style={{ fontSize: 14 }}
                    />
                  </div>
                ) : (
                  <div
                    key={f.name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        color: "#64748B",
                        fontWeight: 500,
                        minWidth: 130,
                      }}
                    >
                      {f.label}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        color: user?.[f.name] ? "#0F172A" : "#94A3B8",
                        fontWeight: 500,
                      }}
                    >
                      {user?.[f.name] || "Chưa cập nhật"}
                    </span>
                  </div>
                ),
              )}

              {/* Readonly fields */}
              {readonlyFields.map((f) => (
                <div
                  key={f.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: "#64748B",
                      fontWeight: 500,
                      minWidth: 130,
                    }}
                  >
                    {f.label}
                  </span>
                  <span
                    style={{ fontSize: 14, color: "#0F172A", fontWeight: 500 }}
                  >
                    {f.value}
                  </span>
                </div>
              ))}
            </div>

            <Separator style={{ margin: "24px 0" }} />

            {/* Buttons */}
            {editing ? (
              <div style={{ display: "flex", gap: 10 }}>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ background: "#7C3AED", color: "white", flex: 1 }}
                >
                  {saving ? "Đang lưu..." : "💾 Lưu thay đổi"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  style={{ flex: 1 }}
                >
                  Hủy
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate("/employer/dashboard")}
                style={{ background: "#7C3AED", color: "white", width: "100%" }}
              >
                Về Dashboard
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
