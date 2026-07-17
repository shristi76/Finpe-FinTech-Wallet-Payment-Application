import { useEffect, useState } from "react";
import AddMoneyCard from "./components/AddMoneyCard";
import InsightsCard from "./components/InsightsCard";
import TransactionHistory from "./components/TransactionHistory";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value || 0);

async function request(path, options = {}, token) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export default function App() {
  const [session, setSession] = useState(() =>
    JSON.parse(localStorage.getItem("finpe-session") || "null")
  );

  const [mode, setMode] = useState("login");

  const [auth, setAuth] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [payment, setPayment] = useState({
    receiverIdentifier: "",
    amount: "",
    description: "",
    mpin: "",
  });

  const [topUp, setTopUp] = useState("");
  const [newMpin, setNewMpin] = useState("");

  const [history, setHistory] = useState([]);
  const [insight, setInsight] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const saveSession = (data) => {
    setSession(data);
    localStorage.setItem("finpe-session", JSON.stringify(data));
  };

  const refresh = async () => {
    if (!session?.token) return;

    const [profile, transactions] = await Promise.all([
      request("/auth/profile", {}, session.token),
      request("/transactions/history", {}, session.token),
    ]);

    saveSession({
      ...session,
      ...profile,
    });

    setHistory(transactions);
  };

  useEffect(() => {
    refresh().catch((error) => setNotice(error.message));
  }, []);

  const action = async (callback) => {
    setBusy(true);
    setNotice("");

    try {
      await callback();
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  };

  const submitAuth = (event) => {
    event.preventDefault();

    action(async () => {
      const body =
        mode === "login"
          ? {
              email: auth.email,
              password: auth.password,
            }
          : auth;

      const data = await request(
        `/auth/${mode === "login" ? "login" : "register"}`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );

      saveSession(data);
      setNotice(`Welcome to finpe , ${data.name}!`);
    });
  };

  const setupMpin = (event) => {
    event.preventDefault();

    action(async () => {
      await request(
        "/auth/setup-mpin",
        {
          method: "POST",
          body: JSON.stringify({
            mpin: newMpin,
          }),
        },
        session.token
      );

      setNewMpin("");
      await refresh();

      setNotice("Your MPIN is ready. You can now make payments.");
    });
  };

  const addMoney = (event) => {
    event.preventDefault();

    action(async () => {
      const data = await request(
        "/wallet/add-money",
        {
          method: "POST",
          body: JSON.stringify({
            amount: topUp,
          }),
        },
        session.token
      );

      setTopUp("");
      await refresh();

      setNotice(data.message);
    });
  };

  const sendPayment = (event) => {
    event.preventDefault();

    action(async () => {
      const data = await request(
        "/transactions/send",
        {
          method: "POST",
          body: JSON.stringify(payment),
          headers: {
            "Idempotency-Key": crypto.randomUUID(),
          },
        },
        session.token
      );

      setPayment({
        receiverIdentifier: "",
        amount: "",
        description: "",
        mpin: "",
      });

      await refresh();
      setNotice(data.message);
    });
  };

  const getInsight = () =>
    action(async () => {
      const data = await request(
        "/ai/summary",
        {},
        session.token
      );

      setInsight(data.summary);
    });

  // Authentication Screen
  if (!session?.token) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="brand">
            fin<span>pe</span>
          </div>

          <p>Simple, secure payments through  digital wallet.</p>

          <form onSubmit={submitAuth}>
            {mode === "register" && (
              <>
                <label>
                  Name
                  <input
                    required
                    value={auth.name}
                    onChange={(e) =>
                      setAuth({
                        ...auth,
                        name: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Phone
                  <input
                    required
                    value={auth.phone}
                    onChange={(e) =>
                      setAuth({
                        ...auth,
                        phone: e.target.value,
                      })
                    }
                  />
                </label>
              </>
            )}

            <label>
              Email
              <input
                type="email"
                required
                value={auth.email}
                onChange={(e) =>
                  setAuth({
                    ...auth,
                    email: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Password
              <input
                type="password"
                required
                value={auth.password}
                onChange={(e) =>
                  setAuth({
                    ...auth,
                    password: e.target.value,
                  })
                }
              />
            </label>

            <button disabled={busy}>
              {busy
                ? "Please wait…"
                : mode === "login"
                ? "Log in"
                : "Create account"}
            </button>
          </form>

          <button
            className="text-button"
            onClick={() =>
              setMode(mode === "login" ? "register" : "login")
            }
          >
            {mode === "login"
              ? "New here? Create an account"
              : "Already have an account? Log in"}
          </button>

          {notice && <p className="notice">{notice}</p>}
        </section>
      </main>
    );
  }

  // Dashboard
  return (
    <main className="dashboard">
      <nav>
        <div className="brand">
          fin<span>pe Digital wallet</span>
        </div>

        <button
          className="text-button"
          onClick={() => {
            localStorage.removeItem("finpe-session");
            setSession(null);
          }}
        >
          Log out
        </button>
      </nav>

      <section className="balance-card">
        <div>
          <span className="eyebrow">
            TOTAL WALLET BALANCE
          </span>

          <h1>{money(session.balance)}</h1>

          <p>{session.upiId}</p>
        </div>

        <AddMoneyCard
          amount={topUp}
          onAmountChange={setTopUp}
          onSubmit={addMoney}
          busy={busy}
        />
      </section>

      {notice && <p className="notice">{notice}</p>}

      {!session.hasMpinSet ? (
        <form
          className="panel setup-panel"
          onSubmit={setupMpin}
        >
          <span className="eyebrow">SECURITY</span>

          <h2>Set up your MPIN</h2>

          <p className="muted">
            Create a 4-digit MPIN before you can send money.
          </p>

          <label>
            New MPIN
            <input
              required
              type="password"
              inputMode="numeric"
              pattern="[0-9]{4}"
              minLength="4"
              maxLength="4"
              value={newMpin}
              onChange={(e) => setNewMpin(e.target.value)}
            />
          </label>

          <button disabled={busy}>Set MPIN</button>
        </form>
      ) : (
        <section className="content-grid">
          <form
            className="panel send-panel"
            onSubmit={sendPayment}
          >
            <span className="eyebrow">PAYMENT</span>

            <h2>Send money</h2>

            <label>
              Phone or Finpe UPI ID
              <input
                required
                placeholder="name@finpe"
                value={payment.receiverIdentifier}
                onChange={(e) =>
                  setPayment({
                    ...payment,
                    receiverIdentifier: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Amount
              <input
                required
                type="number"
                min="1"
                value={payment.amount}
                onChange={(e) =>
                  setPayment({
                    ...payment,
                    amount: e.target.value,
                  })
                }
              />
            </label>

            <label>
              What is this for? <em>(optional)</em>
              <input
                maxLength="200"
                placeholder="Example - Buying books"
                value={payment.description}
                onChange={(e) =>
                  setPayment({
                    ...payment,
                    description: e.target.value,
                  })
                }
              />
            </label>

            <label>
              MPIN
              <input
                required
                type="password"
                inputMode="numeric"
                value={payment.mpin}
                onChange={(e) =>
                  setPayment({
                    ...payment,
                    mpin: e.target.value,
                  })
                }
              />
            </label>

            <button disabled={busy}>
              Send securely
            </button>
          </form>

          <InsightsCard
            insight={insight}
            onGenerate={getInsight}
            busy={busy}
          />
        </section>
      )}

      <section className="history-wrap">
        <TransactionHistory
          transactions={history}
          userId={session._id}
        />
      </section>
    </main>
  );
}