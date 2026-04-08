import { AuthLayout } from "@/components/templates/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Создать аккаунт"
      subtitle="Заполните данные ниже для регистрации"
      linkText="Уже есть аккаунт? Войти"
      linkHref="/login"
    >
      <div className="grid gap-6">
        <form>
          <div className="grid gap-4">
            <div className="grid gap-2 text-left">
              <Label htmlFor="name">Имя</Label>
              <Input id="name" placeholder="Иван Иванов" required />
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
              />
            </div>
            <div className="grid gap-2 text-left">
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" type="password" required />
            </div>
            <Button className="mt-2 w-full">Зарегистрироваться</Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Или зарегистрироваться с
            </span>
          </div>
        </div>
        <Button variant="outline" type="button" className="w-full">
          Google
        </Button>
      </div>
    </AuthLayout>
  );
}
