export interface ColorOption {
	label: string;
	value: string;
}

export const PROJECT_COLORS: ColorOption[] = [
	{ label: 'Blue', value: '#3B82F6' },
	{ label: 'Indigo', value: '#6366F1' },
	{ label: 'Violet', value: '#8B5CF6' },
	{ label: 'Purple', value: '#A855F7' },
	{ label: 'Pink', value: '#EC4899' },
	{ label: 'Rose', value: '#F43F5E' },
	{ label: 'Red', value: '#EF4444' },
	{ label: 'Orange', value: '#F97316' },
	{ label: 'Amber', value: '#F59E0B' },
	{ label: 'Yellow', value: '#EAB308' },
	{ label: 'Lime', value: '#84CC16' },
	{ label: 'Green', value: '#22C55E' },
	{ label: 'Emerald', value: '#10B981' },
	{ label: 'Teal', value: '#14B8A6' },
	{ label: 'Cyan', value: '#06B6D4' },
];

export const DEFAULT_PROJECT_COLOR = PROJECT_COLORS[0].value;
