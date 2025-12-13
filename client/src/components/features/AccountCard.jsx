import { Landmark, Wallet, Banknote, CreditCard } from 'lucide-react';

const TYPE_ICONS = {
    bank: Landmark,
    wallet: Wallet,
    cash: Banknote,
    other: CreditCard
};

const AccountCard = ({ account }) => {
    const Icon = TYPE_ICONS[account.type] || CreditCard;

    return (
        <div
            className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg transition-transform active:scale-95"
            style={{ backgroundColor: account.color || '#6366f1' }}
        >
            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white opacity-10 blur-xl"></div>
            <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-20 h-20 rounded-full bg-black opacity-10 blur-xl"></div>

            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="flex justify-between items-start">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <Icon size={24} />
                    </div>
                    {/* Chip Icon for realistic look */}
                    <div className="w-8 h-6 rounded-md bg-yellow-200/40 border border-yellow-200/60 backdrop-blur-md"></div>
                </div>

                <div>
                    <p className="text-white/80 text-sm font-medium mb-1">{account.name}</p>
                    <h3 className="text-2xl font-bold tracking-tight">₹ {account.balance.toLocaleString('en-IN')}</h3>
                </div>
            </div>
        </div>
    );
};

export default AccountCard;
