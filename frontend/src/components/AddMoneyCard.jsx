export default function AddMoneyCard({
  amount,
  onAmountChange,
  mpin,
  onMpinChange,
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

        <input
          aria-label="MPIN"
          required
          type="password"
          inputMode="numeric"
          pattern="[0-9]{4}"
          minLength="4"
          maxLength="4"
          placeholder="4-digit MPIN"
          value={mpin}
          onChange={(event) => onMpinChange(event.target.value)}
        />

        <button disabled={busy}>
          Add
        </button>
      </div>
    </form>
  );
}
