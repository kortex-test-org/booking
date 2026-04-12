"use client";

import { ClientResponseError } from "pocketbase";
import { useState } from "react";
import { useUpdatePassword, useUpdateProfile } from "@/queries/users";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Settings } from "lucide-react";

interface ProfileSettingsDialogProps {
  userId: string;
  currentName: string;
  displayName: string;
  mobileMode?: boolean;
  onOpen?: () => void;
}

export function ProfileSettingsDialog({
  userId,
  currentName,
  displayName,
  mobileMode = false,
  onOpen,
}: ProfileSettingsDialogProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(currentName);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();

  function handleOpen() {
    setName(currentName);
    setNameError(null);
    setNameSuccess(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
    setPasswordSuccess(false);
    onOpen?.();
    setOpen(true);
  }

  async function handleNameSubmit(event: React.FormEvent) {
    event.preventDefault();
    setNameError(null);
    setNameSuccess(false);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Никнейм не может быть пустым.");
      return;
    }

    updateProfile.mutate(
      { userId, name: trimmedName },
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

    updatePassword.mutate(
      { userId, oldPassword, newPassword },
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
    <>
      {mobileMode ? (
        <button
          type="button"
          onClick={handleOpen}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors w-full"
        >
          <Settings className="w-4 h-4 text-muted-foreground" />
          Настройки профиля
        </button>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="hidden sm:inline text-xs text-muted-foreground font-medium hover:text-foreground transition-colors cursor-pointer"
        >
          {displayName}
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Настройки профиля</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-2">
            <form onSubmit={handleNameSubmit} className="grid gap-3">
              <p className="text-sm font-medium">Никнейм</p>
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
              {nameError && (
                <p className="text-xs text-destructive">{nameError}</p>
              )}
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

            <form onSubmit={handlePasswordSubmit} className="grid gap-3">
              <p className="text-sm font-medium">Изменить пароль</p>
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
        </DialogContent>
      </Dialog>
    </>
  );
}
