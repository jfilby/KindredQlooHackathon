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
  static searchAgentRefId = 'Search'
  static searchAgentName = 'Search'
  static searchAgentRole = 'Search'
}
