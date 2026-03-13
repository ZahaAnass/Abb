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
    numberOfTransactions: number;
    recentTransactions: Transaction[];
}

export interface AdminDashboardData {
    totalEmployees: number;
    totalClients: number;
    totalTransactions: number;
}

export interface TransferRequest {
    receiverRib: string;
    amount: number;
    description: string;
}

export interface AdminDashboardData {
    totalClients: number;
    totalEmployees: number;
    totalTransactions: number;
}