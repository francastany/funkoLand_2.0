import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/hooks/useAuth";

const registerSchema = z.object({
  email: z.string().email("Ingresá un email válido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirmá tu contraseña"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function Register() {
  const { signUp } = useAuthContext();
  const [serverError, setServerError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setServerError(null);

    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Las contraseñas no coinciden" });
      return;
    }

    try {
      const { needsConfirmation } = await signUp(data.email, data.password);
      if (needsConfirmation) {
        setEmailSent(true);
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Error al crear la cuenta",
      );
    }
  };

  if (emailSent) {
    return (
      <section className="mx-auto max-w-md py-12 h-[70dvh]">
        <div className="rounded-xl border bg-white px-6 py-10 shadow-sm text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="size-7 text-primary" />
          </div>
          <h1 className="mt-4 text-xl font-bold">Revisá tu email</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-[32ch] mx-auto">
            Te enviamos un enlace de confirmación. Hacé click en él para activar
            tu cuenta.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Ir a Iniciar Sesión
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md py-12 h-[70dvh]">
      <div className="rounded-xl border bg-white px-6 py-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Crear Cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registrate en FunkoLand
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
          {serverError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {serverError}
            </p>
          )}

          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="register-email">
              Email
            </label>
            <Input
              id="register-email"
              type="email"
              placeholder="vos@ejemplo.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="register-password">
              Contraseña
            </label>
            <Input
              id="register-password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="register-confirm">
              Confirmar Contraseña
            </label>
            <Input
              id="register-confirm"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </section>
  );
}
