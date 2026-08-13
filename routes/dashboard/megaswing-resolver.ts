import { MEGASWING_EXTRA_OBJECTS } from './megaswing-catalog';
import { MEGASWING_OBJECTS } from './megaswing-data';
import { MEGASWING_EXTRA_SCENES } from './megaswing-scenes';
import type { MegaSwingResolvedObject } from './megaswing-universal';

export interface MegaSwingObjectResolver {
	listObjects(): MegaSwingResolvedObject[];
	listObjectsByKind( kind: MegaSwingResolvedObject[ 'kind' ] ): MegaSwingResolvedObject[];
	findObject( id: string ): MegaSwingResolvedObject | undefined;
	findObjectByTitle( title: string ): MegaSwingResolvedObject | undefined;
	resolveObject( id: string ): MegaSwingResolvedObject;
}

const normalize = ( value: string ) =>
	value
		.replace( /^(Theme|Fact|Question|Scene|Character|Material|Location|Situation|Technique|Answer)\s+/i, '' )
		.replace( /^\d+\s*[·.]?\s*/, '' )
		.trim()
		.toLocaleLowerCase();

const DEFAULT_OBJECTS: MegaSwingResolvedObject[] = [
	...MEGASWING_OBJECTS,
	...MEGASWING_EXTRA_SCENES,
	...MEGASWING_EXTRA_OBJECTS,
];

export class StaticMegaSwingObjectResolver implements MegaSwingObjectResolver {
	private readonly objects: MegaSwingResolvedObject[];

	constructor( objects: MegaSwingResolvedObject[] = DEFAULT_OBJECTS ) {
		this.objects = objects;
	}

	listObjects() {
		return this.objects;
	}

	listObjectsByKind( kind: MegaSwingResolvedObject[ 'kind' ] ) {
		return this.objects.filter( ( object ) => object.kind === kind );
	}

	findObject( id: string ) {
		return this.objects.find( ( object ) => object.id === id );
	}

	findObjectByTitle( title: string ) {
		const target = normalize( title );
		return this.objects.find( ( object ) => {
			const objectTitle = normalize( object.title );
			return objectTitle === target || objectTitle.includes( target ) || target.includes( objectTitle );
		} );
	}

	resolveObject( id: string ) {
		return this.findObject( id ) ?? this.objects[ 0 ];
	}
}

export const megaSwingResolver = new StaticMegaSwingObjectResolver();
