const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value || 0);

export default function TransactionHistory({
  transactions,
  userId,
}) {
  const textFor = (item) => {
    if (item.type === "ADD_MONEY") {
      return "Added money to your wallet";
    }

    if (item.type === "BILL_PAY") {
      return `Paid ${item.billerName || "utility bill"}`;
    }

    const sent =
      String(item.sender?._id || item.sender) ===
      String(userId);

    const person = sent ? item.receiver : item.sender;

    return `${
      sent ? "Transferred to" : "Received from"
    } ${person?.upiId || person?.name || "Finpe user"}`;
  };

  if (!transactions.length) {
    return (
      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">PAYMENTS</span>
            <h2>Transaction history</h2>
          </div>
        </div>

        <p className="muted">
          Your completed transactions will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">PAYMENTS</span>
          <h2>Transaction history</h2>
        </div>

        <span className="count">
          Last {Math.min(transactions.length, 6)}
        </span>
      </div>

      <ul className="activity-list">
        {transactions.slice(0, 6).map((item) => {
          const debit =
            item.type !== "ADD_MONEY" &&
            String(item.sender?._id || item.sender) ===
              String(userId);

          return (
            <li key={item._id}>
              <span
                className={`transaction-icon ${
                  debit ? "outgoing" : "incoming"
                }`}
              >
                {debit ? "↑" : "↓"}
              </span>

              <div className="transaction-copy">
                <strong>{textFor(item)}</strong>

                {item.description && (
                  <small>{item.description}</small>
                )}

                <small>
                  {new Date(item.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </small>
              </div>

              <b className={debit ? "debit" : "credit"}>
                {debit ? "-" : "+"}
                {money(item.amount)}
              </b>
            </li>
          );
        })}
      </ul>
    </section>
  );
}