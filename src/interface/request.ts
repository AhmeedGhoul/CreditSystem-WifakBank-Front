export enum Employment {
    Employed = 'Employed',
    Self_Employed = 'Self_Employed',
    Unemployed = 'Unemployed',
    Student = 'Student',
}
export interface CreateDocumentDto {
    documentDate: Date;
    originalName: string;
    filePath: string;
    mimeType: string;
    size: number;
}

export interface CreateRequestDto {

    requestDate?: Date;


    isRequestApprovedByAgent?: boolean;
    isRequestApprovedByAuditor?: boolean;
    purpose?: string;

    employmentStatus?: Employment;

    yearsOfEmployment?: number;

    monthlyIncome?: number;
    otherIncomeSources?: string;
    existingLoans?: boolean;

    totalLoanAmount?: number;

    monthlyLoanPayments?: number;

    numberOfHouses?: number;

    estimatedHouseValue?: number;

    numberOfCars?: number;

    estimatedCarValue?: number;

    bankSavings?: number;

    otherAssets?: string;

    hasCriminalRecord?: boolean;


    documents?: CreateDocumentDto[];
}
