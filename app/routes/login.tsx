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
        navigate("/");
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
    <form onSubmit={handleSubmit}>
      <label>
        Логин
        <input
          name="login"
          type="text"
          autoComplete="username"
          value={login}
          onChange={(event) => setLogin(event.target.value)}
        />
      </label>
      <label>
        Пароль
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={pending}>
        Войти
      </button>
    </form>
  );
}
