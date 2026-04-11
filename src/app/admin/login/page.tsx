"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthLayout } from "@/components/templates/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAdmin } from "@/services/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginAdmin(email, password);
      router.push("/admin");
    } catch {
      setError("Неверные учётные данные администратора");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Вход для администратора"
      subtitle="Используйте учётные данные суперпользователя PocketBase"
      linkText="Вернуться на главную"
      linkHref="/"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2 text-left">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="admin@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading ? "Вход..." : "Войти как администратор"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
