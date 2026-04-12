"use client";

import { ClientResponseError } from "pocketbase";
import { useState } from "react";
import { useUpdatePassword, useUpdateProfile } from "@/queries/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
  const { userRecord } = useAuth();

  const [name, setName] = useState(userRecord?.["name"] ?? "");
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();

  async function handleNameSubmit(event: React.FormEvent) {
    event.preventDefault();
    setNameError(null);
    setNameSuccess(false);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Никнейм не может быть пустым.");
      return;
    }

    if (!userRecord) return;

    updateProfile.mutate(
      { userId: userRecord.id, name: trimmedName },
      {
        onSuccess: () => setNameSuccess(true),
        onError: () => setNameError("Не удалось обновить никнейм."),
      },
    );
  }

  async function handlePasswordSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError("Новый пароль должен быть не менее 8 символов.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Пароли не совпадают.");
      return;
    }

    if (!userRecord) return;

    updatePassword.mutate(
      { userId: userRecord.id, oldPassword, newPassword },
      {
        onSuccess: () => {
          setPasswordSuccess(true);
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (error) => {
          if (error instanceof ClientResponseError && error.status === 400) {
            setPasswordError("Неверный текущий пароль.");
          } else {
            setPasswordError("Не удалось изменить пароль.");
          }
        },
      },
    );
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Настройки профиля</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Управляйте своим именем и паролем
        </p>
      </div>

      <div className="max-w-lg mx-auto w-full grid gap-8">
        <form onSubmit={handleNameSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="profile-name">Имя</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ваш никнейм"
              disabled={updateProfile.isPending}
            />
          </div>
          {nameError && <p className="text-xs text-destructive">{nameError}</p>}
          {nameSuccess && (
            <p className="text-xs text-green-600">Никнейм обновлён.</p>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={updateProfile.isPending}
            className="w-fit"
          >
            {updateProfile.isPending ? "Сохранение..." : "Сохранить"}
          </Button>
        </form>

        <div className="border-t" />

        <form onSubmit={handlePasswordSubmit} className="grid gap-4">
          <h2 className="text-base font-semibold">Изменить пароль</h2>
        <div className="grid gap-2">
          <Label htmlFor="old-password">Текущий пароль</Label>
          <Input
            id="old-password"
            type="password"
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
            placeholder="••••••••"
            disabled={updatePassword.isPending}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="new-password">Новый пароль</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="••••••••"
            disabled={updatePassword.isPending}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Повторите новый пароль</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="••••••••"
            disabled={updatePassword.isPending}
          />
        </div>
        {passwordError && (
          <p className="text-xs text-destructive">{passwordError}</p>
        )}
        {passwordSuccess && (
          <p className="text-xs text-green-600">Пароль изменён.</p>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={updatePassword.isPending}
          className="w-fit"
        >
          {updatePassword.isPending ? "Сохранение..." : "Изменить пароль"}
        </Button>
      </form>
      </div>
    </div>
  );
}
