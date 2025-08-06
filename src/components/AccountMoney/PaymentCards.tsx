export interface CardInfo {
    brand: string;
    last4: string;
    expMonth: string;
    expYear: string;
}

export function PaymentCards({ cards = [] }: { cards?: CardInfo[] }) {
    return (
        <div className="rounded-xl border p-6 bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold mb-4 text-gray-700 dark:text-white">Saved Cards</h3>

            {cards.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-300">No saved cards.</p>
            ) : (
                <ul className="space-y-3">
                    {cards.map((card, idx) => (
                        <li key={idx} className="flex justify-between items-center border-b pb-2">
                            <span>{card.brand} •••• {card.last4}</span>
                            <span className="text-sm text-gray-500">Exp {card.expMonth}/{card.expYear}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
