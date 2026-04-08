"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/templates/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClientResponseError } from "pocketbase";
import { loginUser } from "@/services/auth";

export default function LoginPage() {
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
      await loginUser(email, password);
      // Читаем параметр redirect из текущего URL
      let redirectPath = "/dashboard";
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const redir = urlParams.get("redirect");
        if (redir && redir.startsWith("/")) {
          redirectPath = redir;
        }
      }
      router.push(redirectPath);
    } catch (err) {
      if (err instanceof ClientResponseError && err.status === 400) {
        setError("Неверный email или пароль.");
      } else {
        setError("Ошибка соединения. Попробуйте позже.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="С возвращением"
      subtitle="Введите свой email и пароль для входа в аккаунт"
      linkText="Нет аккаунта? Зарегистрироваться"
      linkHref="/register"
    >
      <div className="grid gap-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2 text-left">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Пароль</Label>
                <a
                  href="#"
                  className="text-sm font-medium text-muted-foreground hover:text-primary hover:underline"
                >
                  Забыли пароль?
                </a>
              </div>
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
              {loading ? "Вход..." : "Войти"}
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
