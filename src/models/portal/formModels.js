export function createSettlementFormModel() {
  return {
    participantCode: '',
    clearingMethod: 'gross',
    processingMode: 'realtime',
    applicationArea: 'payment',
    automationLevel: 'automated',
    instrument: 'top_up',
    amount: '',
    currency: 'KZT',
    settlementDate: '',
    nettingPosition: 'flat',
    priority: 'medium',
    clearingAccount: '',
    batchWindow: '',
    batchOperationCount: 1
  }
}

export function createParticipantFormModel() {
  return {
    code: '',
    name: '',
    category: 'general member',
    riskLevel: 'low',
    guaranteeFund: '',
    operationalState: 'active',
    country: 'Kazakhstan'
  }
}

export function createEDSPurchaseFormModel() {
  return {
    companyCode: '',
    merchantCode: '',
    amount: 10000,
    currency: 'KZT',
    description: 'Покупка ЭДС через веб-портал',
    recipientCompanyCode: ''
  }
}

export function createCompanyFormModel() {
  return {
    code: '',
    name: '',
    merchantCode: ''
  }
}

export function createSupportTicketFormModel() {
  return {
    subject: '',
    category: 'payments',
    priority: 'medium',
    description: ''
  }
}

export function createSupportReplyFormModel() {
  return {
    message: ''
  }
}
