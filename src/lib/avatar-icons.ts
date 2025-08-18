import type { AvatarIcon } from '~/server/db/schema'
import {
	User,
	Crown,
	Zap,
	Star,
	Heart,
	Shield,
	Rocket,
	Gamepad2,
	Diamond,
	Club,
	Spade,
	Flame,
	Snowflake,
	Sun,
	Moon,
} from 'lucide-react'

export interface AvatarIconDefinition {
	id: AvatarIcon
	icon: React.ComponentType<{ className?: string }>
	name: string
	color: string
}

export interface AvatarIconLookup {
	key: AvatarIcon
	icon: React.ComponentType<{ className?: string }>
	color: string
	name: string
}

// Object format - useful for looking up specific avatars by ID
export const avatarIconsMap: Record<AvatarIcon, AvatarIconLookup> = {
	user: { icon: User, color: 'text-blue-600', name: 'User', key: 'user' },
	crown: { icon: Crown, color: 'text-yellow-600', name: 'Crown', key: 'crown' },
	star: { icon: Star, color: 'text-orange-600', name: 'Star', key: 'star' },
	heart: { icon: Heart, color: 'text-red-600', name: 'Heart', key: 'heart' },
	shield: {
		icon: Shield,
		color: 'text-green-600',
		name: 'Shield',
		key: 'shield',
	},
	rocket: {
		icon: Rocket,
		color: 'text-indigo-600',
		name: 'Rocket',
		key: 'rocket',
	},
	gamepad: {
		icon: Gamepad2,
		color: 'text-pink-600',
		name: 'Gamepad',
		key: 'gamepad',
	},
	diamond: {
		icon: Diamond,
		color: 'text-cyan-600',
		name: 'Diamond',
		key: 'diamond',
	},
	club: { icon: Club, color: 'text-gray-600', name: 'Club', key: 'club' },
	spade: { icon: Spade, color: 'text-slate-600', name: 'Spade', key: 'spade' },
	lightning: {
		icon: Zap,
		color: 'text-yellow-500',
		name: 'Lightning',
		key: 'lightning',
	},
	fire: { icon: Flame, color: 'text-orange-500', name: 'Fire', key: 'fire' },
	snowflake: {
		icon: Snowflake,
		color: 'text-blue-300',
		name: 'Snowflake',
		key: 'snowflake',
	},
	sun: { icon: Sun, color: 'text-amber-500', name: 'Sun', key: 'sun' },
	moon: { icon: Moon, color: 'text-indigo-300', name: 'Moon', key: 'moon' },
}
