import {
	MEGASWING_OBJECTS,
	type MegaSwingObject,
} from './megaswing-data';

export interface MegaSwingObjectResolver {
	listObjects(): MegaSwingObject[];
	findObject( id: string ): MegaSwingObject | undefined;
	findObjectByTitle( title: string ): MegaSwingObject | undefined;
	resolveObject( id: string ): MegaSwingObject;
}

const normalize = ( value: string ) =>
	value
		.replace( /^(Theme|Fact|Question|Scene)\s+/i, '' )
		.replace( /^\d+\s*[·.]?\s*/, '' )
		.trim()
		.toLocaleLowerCase();

export class StaticMegaSwingObjectResolver implements MegaSwingObjectResolver {
	private readonly objects: MegaSwingObject[];

	constructor( objects: MegaSwingObject[] = MEGASWING_OBJECTS ) {
		this.objects = objects;
	}

	listObjects() {
		return this.objects;
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
