
export interface CreateAuditDto {
    auditStatus: AuditStatus;

    auditOutput: string;

    auditType: AuditType;
    activityLogIds: number[];
}
export enum AuditStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    Paused = "Paused",
}

export enum AuditType {
    Finacial = "Finacial",
    compliance = "compliance",
    Risk = "Risk",
}