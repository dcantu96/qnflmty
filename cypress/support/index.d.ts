declare namespace Cypress {
	interface Chainable {
		login(email: string): Chainable<Element>
		setProfileId(email: string, username: string): Chainable<null>
		task(event: 'login', params: LoginTaskParams): Chainable<string>
		task(
			event: 'getUserAccountId',
			params: GetUserAccountIdTaskParams,
		): Chainable<number>
		task(
			event: 'createUser',
			params: CreateUserTaskParams,
		): Chainable<{ id: number }>
		task(event: 'deleteUser', params: DeleteUserTaskParams): Chainable<null>
		task(
			event: 'createAdmin',
			params: CreateAdminTaskParams,
		): Chainable<{ id: number }>
		task(
			event: 'createSport',
			params: CreateSportTaskParams,
		): Chainable<{ id: number }>
		task(
			event: 'createTournament',
			params: CreateTournamentTaskParams,
		): Chainable<{ id: number }>
		task(event: 'deleteSport', params: { name: string }): Chainable<null>
		task(
			event: 'deleteTournament',
			params: DeleteTournamentTaskParams,
		): Chainable<null>
		task(
			event: 'createGroup',
			params: CreateGroupParams,
		): Chainable<{ id: number }>
		task(event: 'deleteGroup', params: DeleteGroupParams): Chainable<null>
		task(
			event: 'createTeam',
			params: CreateTeamParams,
		): Chainable<{ id: number }>
		task(event: 'deleteTeam', params: DeleteTeamParams): Chainable<null>
		task(
			event: 'createWeek',
			params: CreateWeekParams,
		): Chainable<{ id: number }>
		task(event: 'deleteWeek', params: DeleteWeekParams): Chainable<null>
		task(
			event: 'createUserAccount',
			params: CreateUserAccountParams,
		): Chainable<{ id: number }>
		task(
			event: 'deleteUserAccount',
			params: DeleteUserAccountParams,
		): Chainable<null>
	}
}
