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
- [-] Admin - Users/:id/edit - email, name, phone
- [ ] Admin - Users/:id list userAccounts - username, createdAt
- [ ] Admin - List groups + bulk actions (joinable, finished)
- [ ] Admin - Groups/:id overview (memberships)
- [ ] Admin - Users/:id/memberships list memberships - suspended, paid, group, createdAt

TBD
- [ ] Admin - List/Edit/Suspend/Paid memberships
- [ ] Admin - List/Accept/Deny requests
- [ ] Users - List/Edit Picks
- [ ] Users - List Leaderboard
- [ ] Admin - List/Edit Picks
- [ ] Admin - Populate tournament data
- [ ] Admin - Update Group Week
- [ ] Admin - Finalize Group Week

