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

export type AvatarIcon =
	| 'user'
	| 'crown'
	| 'star'
	| 'heart'
	| 'shield'
	| 'rocket'
	| 'gamepad'
	| 'diamond'
	| 'club'
	| 'spade'
	| 'lightning'
	| 'fire'
	| 'snowflake'
	| 'sun'
	| 'moon'

export interface AvatarIconDefinition {
	id: AvatarIcon
	icon: React.ComponentType<{ className?: string }>
	name: string
	color: string
}

export interface AvatarIconLookup {
	icon: React.ComponentType<{ className?: string }>
	color: string
	name: string
}

// Object format - useful for looking up specific avatars by ID
export const avatarIconsMap: Record<AvatarIcon, AvatarIconLookup> = {
	user: { icon: User, color: 'text-blue-600', name: 'User' },
	crown: { icon: Crown, color: 'text-yellow-600', name: 'Crown' },
	star: { icon: Star, color: 'text-orange-600', name: 'Star' },
	heart: { icon: Heart, color: 'text-red-600', name: 'Heart' },
	shield: { icon: Shield, color: 'text-green-600', name: 'Shield' },
	rocket: { icon: Rocket, color: 'text-indigo-600', name: 'Rocket' },
	gamepad: { icon: Gamepad2, color: 'text-pink-600', name: 'Gamepad' },
	diamond: { icon: Diamond, color: 'text-cyan-600', name: 'Diamond' },
	club: { icon: Club, color: 'text-gray-600', name: 'Club' },
	spade: { icon: Spade, color: 'text-slate-600', name: 'Spade' },
	lightning: { icon: Zap, color: 'text-yellow-500', name: 'Lightning' },
	fire: { icon: Flame, color: 'text-orange-500', name: 'Fire' },
	snowflake: { icon: Snowflake, color: 'text-blue-300', name: 'Snowflake' },
	sun: { icon: Sun, color: 'text-amber-500', name: 'Sun' },
	moon: { icon: Moon, color: 'text-indigo-300', name: 'Moon' },
}
