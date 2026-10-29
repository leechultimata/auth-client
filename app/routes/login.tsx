import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

type LoginResponse = { ok: true } | { ok: false; error: string };

export default function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const result = (await response.json()) as LoginResponse;

      if (result.ok) {
        navigate("/profile");
        return;
      }
      setError(result.error);
    } catch {
      setError("Не удалось выполнить вход. Проверьте соединение.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex w-72 flex-col gap-3 border border-black p-6">
        <label className="flex flex-col gap-1">
          Логин
          <input
            name="login"
            type="text"
            autoComplete="username"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            className="border border-black px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-1">
          Пароль
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="border border-black px-2 py-1"
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={pending} className="bg-black px-2 py-1 text-white disabled:opacity-50">
          Войти
        </button>
      </form>
    </div>
  );
}
