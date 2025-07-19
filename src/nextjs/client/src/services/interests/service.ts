type UserEntityInterest = {
  id: string
  userProfileId: string
  entityInterest: {
    id: string
    name: string
    interestType: {
      id: string
      name: string
    }
  }
}

export class InterestsService {

  mapUserEntityInterestsToText(userEntityInterests: UserEntityInterest[]): string {

    const grouped: Record<string, string[]> = {}

    for (const ui of userEntityInterests) {
      const type = ui.entityInterest.interestType.name
      const name = ui.entityInterest.name

      if (!grouped[type]) {
        grouped[type] = []
      }

      grouped[type].push(name)
    }

    return Object.entries(grouped)
      .map(([type, names]) => `${type}: ${names.join(', ')}`)
      .join("\n")
  }
}
