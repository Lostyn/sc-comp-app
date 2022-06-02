export type FileFilter = {
	extensions: string[],
	name: string
}

export type OpenDialogOptions = {
	title?: string,
	openLabel?: string,
	canSelectFiles?: boolean,
	canSelectFolder?: boolean,
	canSelectMany?: boolean,
	filters?: FileFilter[];
}