export function BalanceOverview({ balance }: { balance: number }) {
    return (
        <div className="rounded-xl border p-6 bg-white dark:bg-gray-800 text-center">
            <h3 className="text-xl font-bold mb-2 text-gray-700 dark:text-white">Current Balance</h3>
            <p className="text-3xl font-semibold text-green-600">${balance.toFixed(2)}</p>
        </div>
    );
}