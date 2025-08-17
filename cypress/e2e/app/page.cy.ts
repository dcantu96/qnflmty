/**
 * Complete User Journey Tests
 * Sequential tests that build upon each other to test the complete user flow
 */
describe('Complete User Journey', () => {
	const testUser = {
		name: 'Journey Test User',
		email: 'journey-test@example.com',
	}
	const firstUsername = 'JourneyTester'
	const secondUsername = 'SecondProfile'

	before(() => {
		// Create a new test user for the entire journey
		cy.createUser(testUser)
	})

	after(() => {
		// Clean up test user at the very end
		cy.deleteUser(testUser.email)
	})

	beforeEach(() => {
		cy.clearCookies()
		cy.login(testUser.email)
	})

	it('1. should redirect new users to profile creation', () => {
		cy.visit('/')

		// Should be redirected to create-profile page
		cy.url().should('include', '/create-profile')
		cy.contains('Create Your Profile', { matchCase: false })
		cy.contains('Choose a username and avatar to get started with Qnflmty', {
			matchCase: false,
		})
	})

	it('2. should display all avatar options on profile creation', () => {
		cy.visit('/create-profile')

		// Check that avatar selection grid exists
		cy.contains('Choose your avatar', { matchCase: false }).should('be.visible')

		// Check specific avatars by their labels
		cy.get('button').contains('User', { matchCase: false }).should('be.visible')
		cy.get('button')
			.contains('Crown', { matchCase: false })
			.should('be.visible')
		cy.get('button')
			.contains('Rocket', { matchCase: false })
			.should('be.visible')
		cy.get('button').contains('Star', { matchCase: false }).should('be.visible')
		cy.get('button')
			.contains('Heart', { matchCase: false })
			.should('be.visible')
		cy.get('button')
			.contains('Shield', { matchCase: false })
			.should('be.visible')
		cy.get('button')
			.contains('Gamepad', { matchCase: false })
			.should('be.visible')
	})

	it('3. should show validation errors for invalid profile input', () => {
		cy.visit('/create-profile')

		// Try to submit without username
		cy.get('button[type="submit"]')
			.contains('Create Profile', { matchCase: false })
			.should('be.disabled')

		// Try with invalid characters
		cy.get('label')
			.contains('Username', { matchCase: false })
			.parent()
			.find('input')
			.clear()
			.type('invalid@user!')
		cy.get('button[type="submit"]')
			.contains('Create Profile', { matchCase: false })
			.click()
		cy.contains(
			'Username can only contain letters, numbers, underscores, and hyphens',
			{ matchCase: false },
		)

		// Try with username too long
		cy.get('label')
			.contains('Username', { matchCase: false })
			.parent()
			.find('input')
			.clear()
			.type('a'.repeat(25))
		cy.get('button[type="submit"]')
			.contains('Create Profile', { matchCase: false })
			.click()
		cy.contains('Username must be 20 characters or less', { matchCase: false })
	})

	it('4. should create first profile successfully', () => {
		cy.visit('/create-profile')

		// Fill in username using label association
		cy.get('label')
			.contains('Username', { matchCase: false })
			.parent()
			.find('input')
			.clear()
			.type(firstUsername)

		// Select rocket avatar by clicking the button with "Rocket" text
		cy.get('button').contains('Rocket', { matchCase: false }).click()

		// Submit the form
		cy.get('button[type="submit"]')
			.contains('Create Profile', { matchCase: false })
			.click()

		// Should be redirected to request access page
		cy.url().should('include', '/request-access')

		// Verify the newly created profile username appears in the profile display
		// Look for the h2 element that follows the "Profile Created" text
		cy.contains('Profile Created', { matchCase: false })
			.parent()
			.find('h2')
			.should('contain.text', firstUsername)

		cy.contains('Access Request Submitted!', { matchCase: false })
		cy.contains(firstUsername, { matchCase: false })
	})

	it('5. should display profile selection screen with created profile', () => {
		cy.visit('/select-profile')

		// Should see QNFLMTY branding
		cy.contains('QNFLMTY', { matchCase: false }).should('be.visible')
		cy.contains('Your Premium NFL Experience', { matchCase: false }).should(
			'be.visible',
		)

		// Should see profile selection prompt
		cy.contains("Who's playing?", { matchCase: false }).should('be.visible')
		cy.contains('Select your profile to continue', { matchCase: false }).should(
			'be.visible',
		)

		// Should see the created profile
		cy.contains(firstUsername, { matchCase: false }).should('be.visible')

		// Should see "Add Profile" option
		cy.contains('Add Profile', { matchCase: false }).should('be.visible')

		// The QNFLMTY logo should be visible and centered
		cy.get('img[alt="QNFLMTY Logo"]').should('be.visible')
	})

	it('6. should redirect to dashboard when profile is selected', () => {
		cy.visit('/select-profile')

		// Click on the created profile
		cy.get('h3').contains(firstUsername, { matchCase: false }).click()

		// Should be redirected to dashboard
		cy.url().should('include', '/dashboard')
		cy.contains('Dashboard', { matchCase: false })
	})

	it('7. should redirect to dashboard from root when profile is selected', () => {
		// First ensure profile is selected by visiting select-profile and clicking
		cy.visit('/select-profile')
		cy.get('h3').contains(firstUsername, { matchCase: false }).click()

		// Now visit root page
		cy.visit('/')

		// Should be redirected to dashboard since profile is selected
		cy.url().should('include', '/dashboard')
	})

	it('8. should update avatar from sidebar profile switcher', () => {
		// Ensure we're on dashboard with profile selected
		cy.visit('/select-profile')
		cy.get('h3').contains(firstUsername, { matchCase: false }).click()
		cy.visit('/dashboard')

		// Click on profile switcher dropdown
		cy.get('button').contains(firstUsername, { matchCase: false }).click()

		// Click "Edit avatar" option from dropdown
		cy.contains('Edit avatar', { matchCase: false }).click()

		// Modal should open
		cy.contains('Update Avatar', { matchCase: false }).should('be.visible')

		// Select heart avatar
		cy.get('button').contains('Heart', { matchCase: false }).click()

		// Update avatar
		cy.get('button').contains('Update Avatar', { matchCase: false }).click()

		// Verify update (modal closes)
		cy.contains('Update Avatar', { matchCase: false }).should('not.exist')
	})

	it('9. should update avatar from profile selection screen', () => {
		cy.visit('/select-profile')

		// Find the profile card and hover to reveal edit button
		cy.get('h3')
			.contains(firstUsername, { matchCase: false })
			.parent()
			.parent()
			.trigger('mouseover')

		// Click edit button (button with Edit icon, screen reader text "Edit avatar")
		cy.get('button')
			.contains('Edit avatar', { matchCase: false })
			.click({ force: true })

		// Avatar update modal should open
		cy.contains('Update Avatar', { matchCase: false }).should('be.visible')
		cy.contains(`Choose a new avatar for ${firstUsername}`, {
			matchCase: false,
		}).should('be.visible')

		// Select a different avatar (Star)
		cy.get('button').contains('Star', { matchCase: false }).click()

		// Save changes
		cy.get('button').contains('Update Avatar', { matchCase: false }).click()

		// Modal should close
		cy.contains('Update Avatar', { matchCase: false }).should('not.exist')
	})

	it('10. should allow creating additional profiles', () => {
		cy.visit('/select-profile')

		// Click "Add Profile" button
		cy.get('h3').contains('Add Profile', { matchCase: false }).click()

		// Should be redirected to create-profile
		cy.url().should('include', '/create-profile')
		cy.contains('Create New Profile', { matchCase: false })
		cy.contains('Add another profile to your account', { matchCase: false })

		// Create second profile
		cy.get('label')
			.contains('Username', { matchCase: false })
			.parent()
			.find('input')
			.clear()
			.type(secondUsername)

		// Select different avatar
		cy.get('button').contains('Crown', { matchCase: false }).click()

		// Submit the form
		cy.get('button[type="submit"]')
			.contains('Create Profile', { matchCase: false })
			.click()

		// Should be redirected to request access page
		cy.url().should('include', '/request-access')

		// Verify the newly created profile username appears in the profile display
		// Look for the h2 element that follows the "Profile Created" text
		cy.contains('Profile Created', { matchCase: false })
			.parent()
			.find('h2')
			.should('contain.text', secondUsername)

		cy.contains('Access Request Submitted!', { matchCase: false })
		cy.contains(secondUsername, { matchCase: false })
	})

	it('11. should show multiple profiles in selection screen', () => {
		cy.visit('/select-profile')

		// Should see both profiles
		cy.contains(firstUsername, { matchCase: false }).should('be.visible')
		cy.contains(secondUsername, { matchCase: false }).should('be.visible')

		// Should still see "Add Profile" option
		cy.contains('Add Profile', { matchCase: false }).should('be.visible')
	})

	it('12. should switch between profiles in sidebar dropdown', () => {
		// First select a profile
		cy.visit('/select-profile')
		cy.get('h3').contains(firstUsername, { matchCase: false }).click()
		cy.visit('/dashboard')

		// Open profile switcher
		cy.get('button').contains('QNFLMTY Profile', { matchCase: false }).click()

		// Should see profiles dropdown
		cy.contains('Profiles', { matchCase: false }).should('be.visible')

		// Should see both profiles in dropdown
		cy.contains(firstUsername, { matchCase: false }).should('be.visible')
		cy.contains(secondUsername, { matchCase: false }).should('be.visible')

		// Should see "Add profile" option
		cy.contains('Add profile', { matchCase: false }).should('be.visible')
	})

	it('13. should redirect to profile selection when no profile selected', () => {
		// Clear localStorage to simulate no selected profile
		cy.window().then((win) => {
			win.localStorage.removeItem('selectedProfile')
		})

		cy.visit('/')

		// Should be redirected to profile selection since profiles exist but none selected
		cy.url().should('include', '/select-profile')
	})
})
