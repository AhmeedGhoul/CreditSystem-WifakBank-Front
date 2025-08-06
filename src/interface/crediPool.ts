interface Contract {
    userUserId: number;
    creditPoolId:number;
}

interface CreditPool {
    creditPoolId: number;
    Frequency: number;
    Period: number;
    FinalValue: number;
    isFull: boolean;
    maxPeople:number,
    contracts: Contract[];
}
