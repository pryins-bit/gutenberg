import type { MegaSwingObject } from './megaswing-data';

export type MegaSwingUniversalKind =
	| MegaSwingObject[ 'kind' ]
	| 'project'
	| 'answer'
	| 'material'
	| 'location'
	| 'time'
	| 'situation'
	| 'technique';

export type MegaSwingResolvedObject = Omit<MegaSwingObject, 'kind'> & {
	kind: MegaSwingUniversalKind;
};
