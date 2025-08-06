export interface PaymentLog {
    id: string;
    amount: number;
    date: string;
    status: string;
}

export function PaymentLogs({ logs = [] }: { logs?: PaymentLog[] }) {
    return (
        <div className="rounded-xl border p-6 bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold mb-4 text-gray-700 dark:text-white">
                Payment History
            </h3>

            {logs.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-300">No payment history available.</p>
            ) : (
                <table className="w-full text-sm text-left">
                    <thead>
                    <tr>
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {logs.map((log) => (
                        <tr key={log.id}>
                            <td className="py-1">{log.date}</td>
                            <td className="py-1">${log.amount.toFixed(2)}</td>
                            <td className="py-1">{log.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
