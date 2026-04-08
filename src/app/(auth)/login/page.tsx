import { AuthLayout } from "@/components/templates/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <AuthLayout
      title="С возвращением"
      subtitle="Введите свой email и пароль для входа в аккаунт"
      linkText="Нет аккаунта? Зарегистрироваться"
      linkHref="/register"
    >
      <div className="grid gap-6">
        <form>
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
              />
            </div>
            <Button className="mt-2 w-full">Войти</Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Или продолжить с
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
