export class BaseDataTypes {

  // Statuses
  static activeStatus = 'A'
  static deletePendingStatus = 'P'
  static newStatus = 'N'
  static inactiveStatus = 'I'

  static statusMap = {
    [this.activeStatus]: 'Active',
    [this.deletePendingStatus]: 'Delete pending'
  }

  static statusArray = [
    {
      value: this.activeStatus,
      name: 'Active'
    },
    {
      value: this.deletePendingStatus,
      name: 'Delete pending'
    }
  ]

  // Agents
  static batchAgentRefId = 'Batch'
  static batchAgentName = 'Batch'
  static batchAgentRole = 'Batch processing'

  static kindredAgentRefId = 'Kindred'
  static kindredAgentName = 'Kindred'
  static kindredAgentRole = 'Talk to users'

  static agents = [
    {
      agentRefId: this.batchAgentRefId,
      agentName: this.batchAgentName,
      agentRole: this.batchAgentRole
    },
    {
      agentRefId: this.kindredAgentRefId,
      agentName: this.kindredAgentName,
      agentRole: this.kindredAgentRole
    }
  ]
}
