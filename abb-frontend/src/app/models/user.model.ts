export interface Transaction {
    id?: number;
    senderRib: string;
    receiverRib: string;
    amount: number;
    description: string;
    transactionDate: string;
}

export interface ClientDashboardData {
    name: string;
    rib: string;
    solde: number;
    recentTransactions: Transaction[];
}

export interface AdminDashboardData {
    totalEmployees: number;
    totalClients: number;
    totalTransactions: number;
}