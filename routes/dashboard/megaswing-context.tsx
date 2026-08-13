import {
	createContext,
	useContext,
	type ReactNode,
} from '@wordpress/element';
import {
	megaSwingResolver,
	type MegaSwingObjectResolver,
} from './megaswing-resolver';

type MegaSwingObjectContextValue = {
	resolver: MegaSwingObjectResolver;
	openObject: ( objectId: string ) => void;
};

const MegaSwingObjectContext = createContext<MegaSwingObjectContextValue>( {
	resolver: megaSwingResolver,
	openObject: () => undefined,
} );

export function MegaSwingObjectProvider( {
	children,
	openObject,
	resolver = megaSwingResolver,
}: {
	children: ReactNode;
	openObject: ( objectId: string ) => void;
	resolver?: MegaSwingObjectResolver;
} ) {
	return (
		<MegaSwingObjectContext.Provider value={ { resolver, openObject } }>
			{ children }
		</MegaSwingObjectContext.Provider>
	);
}

export const useMegaSwingObjectContext = () => useContext( MegaSwingObjectContext );
