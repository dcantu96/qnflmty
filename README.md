# Qnflmty

[![Next.js App](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/detailed/wxjaty/main&style=flat&logo=cypress)](https://cloud.cypress.io/projects/wxjaty/runs)

## Todo

App Setup
- [x] Make it deploy (vercel)
- [x] Scaffold basic ui with mock data
- [x] Setup db (vercel postgres)
- [x] Attach db to ui
- [x] Add authentication (w/ next-auth)
- [x] Attach end to end tests (cypress)
- [x] Attach CI for cypress cloud
- [x] Layouts
- [ ] Error management (w/ sentry)

Features:
- [x] Users - Create profile
- [x] Users - Update profile
- [x] Users - Select profile
- [x] Users - Switch profile
- [x] Users - Request access
- [x] Users - View access
- [x] Admin - List/Create/Edit/Delete tournaments
- [x] Admin - List/Create/Edit/Delete sports
- [x] Admin - List/Create teams
- [x] Admin - List weeks
- [x] Add paymentDueDate to group schema to limit usage of app if any of the members have not paid by then
- [x] Admin - List/Suspend/Activate users
- [x] Admin - Users/:id overview
- [x] Admin - Users/:id suspend/activate & make/remove admin
- [x] Admin - Users/:id/edit - email, name, phone
- [x] Admin - Users/:id list userAccounts - username, avatar, createdAt
- [x] Admin - Groups - name, tournament, joinable, finished, createdAt, paymentDueDate
- [x] Admin - Groups - filter by tournament, active/finished
- [x] Admin - Groups - link to group.tournament
- [x] Admin - Groups - bulk actions (joinable, finished)
- [x] Admin - Groups/new - name, tournament, joinable, finished, paymentDueDate
- [x] Admin - Groups/:id/edit - name, joinable, finished, paymentDueDate (tournament cannot be changed)
- [ ] Admin - Groups/:id overview (memberships list) - username, avatar, name, email, paid, suspended, createdAt
- [ ] Admin - Groups - add members count to list view
- [ ] Admin - Groups/:id overview (memberships list) - bulk actions - suspend/activate, mark paid/unpaid
- [ ] Admin - Users/:id/ list userAccounts - memberships
- [ ] Admin - Users/:id/ list memberships - suspended, paid, group, createdAt
- [ ] Admin - Users/:id/ list memberships - bulk actions - suspend/activate, mark paid/unpaid
- [ ] Admin - Groups/:id requests
- [ ] Admin - Groups/:id requests - bulk actions (accept/deny)
- [ ] Admin - Users/:id/requests list requests - group, status, createdAt
- [ ] Admin - Users/:id/requests - bulk actions - accept/deny
- [ ] Admin - Users/:id list userAccounts - edit (username, avatar)
- [ ] Admin - Users/:id list userAccounts - transfer ownership

TBD
- [ ] Admin - List/Edit/Suspend/Paid memberships
- [ ] Admin - List/Accept/Deny requests
- [ ] Users - List/Edit Picks
- [ ] Users - List Leaderboard
- [ ] Admin - List/Edit Picks
- [ ] Admin - Populate tournament data
- [ ] Admin - Update Group Week
- [ ] Admin - Finalize Group Week

