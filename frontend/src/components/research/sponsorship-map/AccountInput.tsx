type AccountInputProps = {
  account: string;
  network: string;
  disabled: boolean;
  onAccount: (value: string) => void;
  onNetwork: (value: string) => void;
};

export function AccountInput({
  account,
  network,
  disabled,
  onAccount,
  onNetwork,
}: AccountInputProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="account" className="text-sm font-medium">
          Account
        </label>
        <input
          id="account"
          type="text"
          value={account}
          onChange={(e) => onAccount(e.target.value)}
          disabled={disabled}
          placeholder="GABC..."
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm disabled:opacity-50"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="network" className="text-sm font-medium">
          Network
        </label>
        <select
          id="network"
          value={network}
          onChange={(e) => onNetwork(e.target.value)}
          disabled={disabled}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm disabled:opacity-50"
        >
          <option value="stellar-testnet">Testnet</option>
          <option value="stellar-pubnet">Pubnet</option>
        </select>
      </div>
    </div>
  );
}
