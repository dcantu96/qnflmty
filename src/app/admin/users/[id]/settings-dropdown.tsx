'use client'

import {
	Mail,
	Settings,
	Shield,
	ShieldOff,
	UserCheck,
	UserX,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
	activateUser,
	suspendUser,
	makeAdmin,
	removeAdmin,
} from '~/server/admin/mutations'

export function SettingsDropdown({
	id,
	suspended,
	admin,
}: { id: number; suspended: boolean; admin: boolean }) {
	const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
	const [activateDialogOpen, setActivateDialogOpen] = useState(false)
	const [makeAdminDialogOpen, setMakeAdminDialogOpen] = useState(false)
	const [removeAdminDialogOpen, setRemoveAdminDialogOpen] = useState(false)

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="sm" title="Settings">
						<Settings />
						Settings
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-42">
					<DropdownMenuItem>
						<Mail />
						Reset Password
					</DropdownMenuItem>
					{suspended ? (
						<DropdownMenuItem onClick={() => setActivateDialogOpen(true)}>
							<UserCheck />
							Activate User
						</DropdownMenuItem>
					) : (
						<DropdownMenuItem onClick={() => setSuspendDialogOpen(true)}>
							<UserX />
							Suspend User
						</DropdownMenuItem>
					)}
					<DropdownMenuSeparator />
					{admin ? (
						<DropdownMenuItem onClick={() => setRemoveAdminDialogOpen(true)}>
							<ShieldOff />
							Remove Admin
						</DropdownMenuItem>
					) : (
						<DropdownMenuItem onClick={() => setMakeAdminDialogOpen(true)}>
							<Shield />
							Make Admin
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
			{suspendDialogOpen && (
				<ConfirmSuspendDialog
					id={id}
					onClose={() => setSuspendDialogOpen(false)}
				/>
			)}
			{activateDialogOpen && (
				<ConfirmActivateDialog
					id={id}
					onClose={() => setActivateDialogOpen(false)}
				/>
			)}
			{makeAdminDialogOpen && (
				<ConfirmMakeAdminDialog
					id={id}
					onClose={() => setMakeAdminDialogOpen(false)}
				/>
			)}
			{removeAdminDialogOpen && (
				<ConfirmRemoveAdminDialog
					id={id}
					onClose={() => setRemoveAdminDialogOpen(false)}
				/>
			)}
		</>
	)
}

const ConfirmSuspendDialog = ({
	id,
	onClose,
}: { id: number; onClose: () => void }) => {
	const handleSuspend = async () => {
		await suspendUser({ id })
		onClose()
	}
	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Confirm Suspend</DialogTitle>
					<DialogDescription>
						Are you sure you want to suspend this user?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" type="button" onClick={onClose}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						type="button"
						title="Confirm Suspend"
						onClick={handleSuspend}
					>
						Suspend
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

const ConfirmActivateDialog = ({
	id,
	onClose,
}: { id: number; onClose: () => void }) => {
	const handleActivate = async () => {
		await activateUser({ id })
		onClose()
	}
	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Confirm Activate</DialogTitle>
					<DialogDescription>
						Are you sure you want to activate this user?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" type="button" onClick={onClose}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						type="button"
						title="Confirm Activate"
						onClick={handleActivate}
					>
						Activate
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

const ConfirmMakeAdminDialog = ({
	id,
	onClose,
}: { id: number; onClose: () => void }) => {
	const handleMakeAdmin = async () => {
		await makeAdmin({ id })
		onClose()
	}
	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Confirm Make Admin</DialogTitle>
					<DialogDescription>
						Are you sure you want to make this user an admin?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" type="button" onClick={onClose}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						type="button"
						title="Confirm Make Admin"
						onClick={handleMakeAdmin}
					>
						Make Admin
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

const ConfirmRemoveAdminDialog = ({
	id,
	onClose,
}: { id: number; onClose: () => void }) => {
	const handleRemoveAdmin = async () => {
		await removeAdmin({ id })
		onClose()
	}
	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Confirm Remove Admin</DialogTitle>
					<DialogDescription>
						Are you sure you want to remove this user as an admin?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" type="button" onClick={onClose}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						type="button"
						title="Confirm Remove Admin"
						onClick={handleRemoveAdmin}
					>
						Remove Admin
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
