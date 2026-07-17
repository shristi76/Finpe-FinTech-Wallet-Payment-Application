export default function AddMoneyCard({
  amount,
  onAmountChange,
  onSubmit,
  busy,
}) {
  return (
    <form
      className="topup-card"
      onSubmit={onSubmit}
    >
      <div>
        <span className="eyebrow">WALLET</span>
        <strong>Add money</strong>
      </div>

      <div className="topup-controls">
        <input
          aria-label="Amount to add"
          required
          type="number"
          min="1"
          placeholder="Amount"
          value={amount}
          onChange={(event) =>
            onAmountChange(event.target.value)
          }
        />

        <button disabled={busy}>
          Add
        </button>
      </div>
    </form>
  );
}