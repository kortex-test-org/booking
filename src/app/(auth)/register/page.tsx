"use client";

import { useRouter } from "next/navigation";
import { ClientResponseError } from "pocketbase";
import { useState } from "react";
import { AuthLayout } from "@/components/templates/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser, registerUser } from "@/services/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerUser({ name, email, password });
      await loginUser(email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ClientResponseError) {
        const emailErr = err.response?.data?.email?.code;
        const passErr = err.response?.data?.password?.code;
        if (emailErr === "validation_not_unique") {
          setError(
            "Этот email уже зарегистрирован. Войдите или используйте другой адрес.",
          );
        } else if (passErr === "validation_length_out_of_range") {
          setError("Пароль слишком короткий. Минимум 8 символов.");
        } else {
          setError(err.message || "Не удалось зарегистрироваться.");
        }
      } else {
        setError(
          "Не удалось зарегистрироваться. Проверьте данные и попробуйте снова.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Создать аккаунт"
      subtitle="Заполните данные ниже для регистрации"
      linkText="Уже есть аккаунт? Войти"
      linkHref="/login"
    >
      <div className="grid gap-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2 text-left">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                placeholder="Иван Иванов"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
