import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../state/AuthContext.jsx";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "member"
};

export function AuthPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await signup(form);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-zinc-100 px-4 py-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden items-center justify-center border-r border-zinc-200 px-10 lg:flex">
        <div className="max-w-xl">
          <div className="mb-8 inline-flex items-center gap-3 rounded-lg bg-zinc-950 px-4 py-3 text-white">
            <LockKeyhole className="h-5 w-5" />
            <span className="font-semibold">TeamTask</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight text-zinc-950">Plan work with roles that actually mean something.</h1>
          <p className="mt-5 max-w-lg text-lg text-zinc-600">
            Projects, assignments, overdue work, and status reporting in one focused workspace.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center">
        <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-panel">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-zinc-950">{mode === "login" ? "Welcome back" : "Create account"}</h2>
            <p className="mt-1 text-sm text-zinc-500">{mode === "login" ? "Sign in to continue." : "Start with your team role."}</p>
          </div>

          <div className="space-y-4">
            {mode === "signup" && (
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-zinc-700">Name</span>
                <div className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 focus-within:border-zinc-950">
                  <UserRound className="h-4 w-4 text-zinc-400" />
                  <input
                    className="h-11 w-full bg-transparent outline-none"
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    required
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-zinc-700">Email</span>
              <div className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 focus-within:border-zinc-950">
                <Mail className="h-4 w-4 text-zinc-400" />
                <input
                  type="email"
                  className="h-11 w-full bg-transparent outline-none"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-zinc-700">Password</span>
              <div className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 focus-within:border-zinc-950">
                <LockKeyhole className="h-4 w-4 text-zinc-400" />
                <input
                  type="password"
                  className="h-11 w-full bg-transparent outline-none"
                  value={form.password}
                  onChange={(event) => update("password", event.target.value)}
                  minLength={8}
                  required
                />
              </div>
            </label>

            {mode === "signup" && (
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-zinc-700">Role</span>
                <select
                  className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 outline-none focus:border-zinc-950"
                  value={form.role}
                  onChange={(event) => update("role", event.target.value)}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            )}
          </div>

          {error && <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 h-11 w-full rounded-lg bg-emerald-600 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Working..." : mode === "login" ? "Login" : "Sign up"}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
            className="mt-4 w-full text-sm font-semibold text-zinc-700 hover:text-zinc-950"
          >
            {mode === "login" ? "Need an account? Sign up" : "Have an account? Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
